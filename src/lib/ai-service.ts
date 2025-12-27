import * as admin from 'firebase-admin';
import { cacheVipResult } from './firebase-admin';
import { headers } from 'next/headers';

// --- Configuration ---
const DAILY_LIMIT_PER_IP = 100;
const API_KEY = process.env.GOOGLE_GEMINI_API_KEY || '';

// User-specified Model Names
const TEXT_MODEL_NAME = 'gemini-2.5-flash';
const IMAGE_MODEL_NAME = 'gemini-2.5-flash-image';

// Internal: Rate Limiter
async function checkIpRateLimit(ip: string): Promise<boolean> {
    const db = admin.firestore();
    const dateStr = new Date().toISOString().split('T')[0];
    const docId = `limit_${ip.replace(/[^a-zA-Z0-9]/g, '_')}_${dateStr}`;
    const docRef = db.collection('rate_limits').doc(docId);

    try {
        return await db.runTransaction(async (t) => {
            const doc = await t.get(docRef);
            if (!doc.exists) {
                t.set(docRef, { count: 1, timestamp: admin.firestore.FieldValue.serverTimestamp() });
                return true;
            }
            const data = doc.data();
            if (data?.count >= DAILY_LIMIT_PER_IP) {
                return false;
            }
            t.update(docRef, { count: admin.firestore.FieldValue.increment(1) });
            return true;
        });
    } catch (e) {
        console.error('Rate limit error', e);
        return true;
    }
}

// ---------------------------------------------------------
// Helper: Raw REST Call for "Gemini 2.5 Flash Image"
// Mimics: .responseModalities("TEXT", "IMAGE") from Java
// ---------------------------------------------------------
async function generateImageViaGeminiRest(prompt: string): Promise<string | null> {
    // Endpoint: generativelanguage.googleapis.com/v1beta/models/{MODEL}:generateContent
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${IMAGE_MODEL_NAME}:generateContent?key=${API_KEY}`;

    // Strict Payload Construction based on User Request
    const payload = {
        contents: [{
            parts: [{ text: prompt }]
        }],
        generationConfig: {
            responseModalities: ["IMAGE"], // KEY: As requested
            candidateCount: 1
        }
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errText = await response.text();
            console.error(`[Gemini Image Check] Failed: ${response.status}`, errText);
            return null;
        }

        const data = await response.json();

        // Parsing logic based on Java snippet:
        // part.inlineData().get() -> blob
        const candidates = data.candidates || [];
        for (const candidate of candidates) {
            const parts = candidate.content?.parts || [];
            for (const part of parts) {
                if (part.inlineData && part.inlineData.data) {
                    // Found image data
                    const mimeType = part.inlineData.mimeType || 'image/png';
                    const base64 = part.inlineData.data;
                    return `data:${mimeType};base64,${base64}`;
                }
            }
        }
        console.warn('[Gemini Image Check] No inlineData found in response');
        return null;

    } catch (e) {
        console.error('[Gemini Image Check] Exception:', e);
        return null;
    }
}

// Helper: Standard Text Gen (can use same REST pattern for consistency)
async function generateTextViaRest(companyName: string): Promise<any> {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${TEXT_MODEL_NAME}:generateContent?key=${API_KEY}`;
    const prompt = `
        You are a brand strategist. Analyze the brand "${companyName}".
        Output ONLY valid JSON. No markdown formatting. No intro text.
        Structure:
        {
          "headline": "Premium B2B Proposal Headline for ${companyName}",
          "description": "Short persuasive paragraph on why they should partner with Irunica (private label cosmetics)."
        }
    `;

    try {
        const payload = {
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { responseMimeType: "application/json" } // Force JSON mode
        };
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const data = await response.json();
        const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
        // Cleanup just in case
        const cleanedText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(cleanedText);
    } catch (e) {
        console.error('[Gemini Text Check] Failed', e);
        return { headline: `Elevate ${companyName}`, description: "Partner with Irunica." };
    }
}

export interface GeneratedContent {
    synergyText: {
        headline: string;
        description: string;
    };
    productImages: { id: string; url: string }[];
}


// Public Entry Point
export const getOrGenerateAssets = async (vipId: string, companyName: string): Promise<{
    synergyText: GeneratedContent['synergyText'];
    productImagesPromise: Promise<GeneratedContent['productImages']>;
} | null> => {

    const headersList = await headers();
    const forwardedFor = headersList.get('x-forwarded-for');
    const ip = forwardedFor ? forwardedFor.split(',')[0] : 'unknown';

    console.log(`[Generation Start] VIP: ${companyName}, Model: ${IMAGE_MODEL_NAME} (REST)`);

    // 1. Text Generation
    const textPromise = generateTextViaRest(companyName);

    // 2. Image Generation (Strict Custom Model)
    const productCore = `premium frosted glass bottle with '${companyName}' minimalist logo`;
    const imagePrompts = [
        { id: 'p1', p: `Studio main shot of ${productCore}, professional lighting, 8k resolution` },
        { id: 'p2', p: `Close-up detail of ${companyName} logo on frosted glass texture, macro shot` },
        { id: 'p3', p: `Artistic composition of ${productCore} on a marble podium, luxury vibe` },
        { id: 'm1', p: `A professional model holding ${productCore}, fashion magazine style` },
        { id: 'm2', p: `Luxury lifestyle vanity table with ${productCore}, soft morning light` },
    ];

    console.log(`[AI-Orchestrator] Dispatching 5 Image Requests to ${IMAGE_MODEL_NAME}...`);

    const productImagesPromise = (async () => {
        const imageResults: any[] = [];

        // Sequential to verify each
        for (const [index, item] of imagePrompts.entries()) {
            // Slight delay to be polite to the API
            await new Promise(r => setTimeout(r, index === 0 ? 0 : 1500));

            console.log(`[AI-Orchestrator] Requesting Item: ${item.id}`);
            const base64Url = await generateImageViaGeminiRest(item.p);

            if (base64Url) {
                console.log(`[AI-Orchestrator] Success: ${item.id}`);
                imageResults.push({ id: item.id, url: base64Url });
            } else {
                console.warn(`[AI-Orchestrator] Failed: ${item.id}`);
                // User said: "Don't use Unsplash". 
                // We return a local placeholder (black/default) if it strictly fails.
                imageResults.push({ id: item.id, url: '/assets/images/default-premium-product.jpg' });
            }
        }
        return imageResults;
    })();

    const synergyText = await textPromise;

    productImagesPromise.then(images => {
        cacheVipResult(vipId, { synergyText, productImages: images }).catch(console.error);
    });

    return { synergyText, productImagesPromise };
};

export const generateCustomAssets = getOrGenerateAssets;
