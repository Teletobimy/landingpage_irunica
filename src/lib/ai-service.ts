import * as admin from 'firebase-admin';
import { cacheVipResult, checkVipCache, uploadImagesToStorage } from './firebase-admin';
import { headers } from 'next/headers';
import { CompanyClassification, IndustryType } from '@/types/company';
import { generateImagePromptsForIndustry } from '@/config/image-prompts';
import { SupportedLanguage, LANGUAGE_NAMES } from '@/config/tld-language';

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
                console.log(`[RateLimit] IP ${ip} exceeded daily limit`);
                return false;
            }
            t.update(docRef, { count: admin.firestore.FieldValue.increment(1) });
            return true;
        });
    } catch (e) {
        console.error('[RateLimit] Error:', e);
        return true; // Allow on error
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

// Helper: Classify company industry using Gemini
async function classifyCompanyViaRest(companyName: string): Promise<CompanyClassification> {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${TEXT_MODEL_NAME}:generateContent?key=${API_KEY}`;
    const prompt = `
        You are a business analyst. Based on the company/brand name "${companyName}", infer what type of business this might be.

        Output ONLY valid JSON. No markdown formatting. No intro text.
        Structure:
        {
          "industry": "spa" | "clinic" | "retail" | "hotel" | "distributor" | "unknown",
          "country": "Inferred country or 'unknown'",
          "companySize": "small" | "medium" | "large" | "unknown",
          "confidence": 0.0 to 1.0,
          "painPoints": ["Array of likely business pain points for cosmetics B2B"]
        }

        Industry classification guide:
        - "spa": Spa, wellness center, beauty salon, massage therapy
        - "clinic": Medical clinic, dermatology, aesthetic medicine, plastic surgery
        - "retail": E-commerce, beauty store, department store, boutique
        - "hotel": Hotel, resort, hospitality business
        - "distributor": Wholesale, distribution, import/export, trading company
        - "unknown": Cannot determine
    `;

    try {
        const payload = {
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { responseMimeType: "application/json" }
        };
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const data = await response.json();
        const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
        const cleanedText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(cleanedText);

        const result: CompanyClassification = {
            industry: parsed.industry || 'unknown',
            country: parsed.country || 'unknown',
            companySize: parsed.companySize || 'unknown',
            confidence: parsed.confidence || 0.5,
            painPoints: parsed.painPoints || [],
            classifiedAt: new Date().toISOString(),
        };

        console.log(`[Classification Result] ${result.industry} (${result.confidence})`);
        return result;
    } catch (e) {
        console.error('[Gemini Classification] Failed', e);
        return {
            industry: 'unknown',
            country: 'unknown',
            companySize: 'unknown',
            confidence: 0,
            painPoints: [],
            classifiedAt: new Date().toISOString(),
        };
    }
}

// Helper: Standard Text Gen with industry context, language, and research data
async function generateTextViaRest(
    companyName: string,
    classification?: CompanyClassification,
    language: SupportedLanguage = 'en',
    researchReport?: string
): Promise<any> {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${TEXT_MODEL_NAME}:generateContent?key=${API_KEY}`;

    const languageName = LANGUAGE_NAMES[language];
    const industryContext = classification && classification.industry !== 'unknown'
        ? `This is a ${classification.industry} business${classification.country !== 'unknown' ? ` based in ${classification.country}` : ''}. Consider their specific needs: ${classification.painPoints.join(', ')}.`
        : '';

    const researchContext = researchReport
        ? `\n\nHere is detailed research about this company:\n${researchReport}\n\nUse this research to create a highly personalized and relevant proposal.`
        : '';

    const prompt = `
        You are a brand strategist. Analyze the brand "${companyName}".
        ${industryContext}
        ${researchContext}

        IMPORTANT: Write ALL text output in ${languageName}. The headline and description must be in ${languageName}.

        Output ONLY valid JSON. No markdown formatting. No intro text.
        Structure:
        {
          "headline": "Premium B2B Proposal Headline for ${companyName} (in ${languageName})",
          "description": "Short persuasive paragraph on why they should partner with Irunica (private label cosmetics) (in ${languageName})."
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
    classification?: CompanyClassification;
}


// Public Entry Point
export const getOrGenerateAssets = async (
    vipId: string,
    companyName: string,
    language: SupportedLanguage = 'en',
    researchReport?: string
): Promise<{
    synergyText: GeneratedContent['synergyText'];
    productImagesPromise: Promise<GeneratedContent['productImages']>;
    classification: CompanyClassification;
} | null> => {

    // 0. Cache-First Strategy: Check for existing cached content
    const cachedResult = await checkVipCache(vipId);
    if (cachedResult?.synergyText && cachedResult?.productImages?.length > 0) {
        console.log(`[Cache HIT] ${vipId} - Returning cached content`);
        // Use cached classification or default to unknown
        const classification: CompanyClassification = cachedResult.classification || {
            industry: 'unknown',
            country: 'unknown',
            companySize: 'unknown',
            confidence: 0,
            painPoints: [],
            classifiedAt: new Date().toISOString(),
        };
        return {
            synergyText: cachedResult.synergyText,
            productImagesPromise: Promise.resolve(cachedResult.productImages),
            classification,
        };
    }
    console.log(`[Cache MISS] ${vipId} - Generating new content (language: ${language})`);

    const headersList = await headers();
    const forwardedFor = headersList.get('x-forwarded-for');
    const ip = forwardedFor ? forwardedFor.split(',')[0] : 'unknown';

    console.log(`[Generation Start] VIP: ${companyName}, Model: ${IMAGE_MODEL_NAME} (REST), Language: ${language}`);

    // 1. Classify company first (needed for text and image prompts)
    const classification = await classifyCompanyViaRest(companyName);

    // 2. Text Generation with industry context, language, and research data
    const textPromise = generateTextViaRest(companyName, classification, language, researchReport);

    // 3. Image Generation with industry-specific prompts
    const imagePrompts = generateImagePromptsForIndustry(companyName, classification.industry);

    console.log(`[AI-Orchestrator] Dispatching 5 Image Requests for ${classification.industry} industry to ${IMAGE_MODEL_NAME}...`);

    const productImagesPromise = (async () => {
        // Parallel execution with 100ms stagger to be polite to the API
        const imageResults = await Promise.all(
            imagePrompts.map((item, index) =>
                new Promise<void>(resolve => setTimeout(resolve, index * 100))
                    .then(() => {
                        console.log(`[AI-Orchestrator] Requesting Item: ${item.id}`);
                        return generateImageViaGeminiRest(item.p);
                    })
                    .then(base64Url => {
                        if (base64Url) {
                            console.log(`[AI-Orchestrator] Success: ${item.id}`);
                            return { id: item.id, url: base64Url };
                        } else {
                            console.warn(`[AI-Orchestrator] Failed: ${item.id}`);
                            return { id: item.id, url: '/assets/images/default-premium-product.jpg' };
                        }
                    })
            )
        );

        // Background upload and cache - DO NOT AWAIT
        uploadImagesToStorage(vipId, imageResults).then(async (uploadedImages) => {
            await cacheVipResult(vipId, { synergyText: await textPromise, productImages: uploadedImages, classification });
            console.log(`[Cache] Cached images for ${vipId}`);
        }).catch(err => console.error('[Cache] Failed:', err));

        return imageResults;
    })();

    const synergyText = await textPromise;

    // Return immediately with Promise that resolves to empty array
    // Frontend will use fallback images, actual images cached in background
    return {
        synergyText,
        productImagesPromise: Promise.resolve([]),
        classification
    };
};

export const generateCustomAssets = getOrGenerateAssets;
export const classifyCompany = classifyCompanyViaRest;
export type { CompanyClassification };
