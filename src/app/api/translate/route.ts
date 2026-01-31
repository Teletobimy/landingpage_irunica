import { NextRequest, NextResponse } from 'next/server';

const GEMINI_API_KEY = process.env.GOOGLE_GEMINI_API_KEY;
const MODEL_NAME = 'gemini-2.5-flash';

const LANGUAGE_NAMES: Record<string, string> = {
    en: 'English',
    ko: 'Korean',
    ja: 'Japanese',
    es: 'Spanish',
    zh: 'Chinese (Simplified)',
};

export async function POST(request: NextRequest) {
    try {
        const { text, targetLang } = await request.json();

        if (!text || !targetLang) {
            return NextResponse.json(
                { error: 'Missing required fields: text, targetLang' },
                { status: 400 }
            );
        }

        if (!GEMINI_API_KEY) {
            return NextResponse.json(
                { error: 'API key not configured' },
                { status: 500 }
            );
        }

        const targetLanguage = LANGUAGE_NAMES[targetLang] || 'English';

        const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${GEMINI_API_KEY}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `Translate the following Korean beauty trend analysis to ${targetLanguage}. Keep it natural and professional. Preserve any brand names or technical terms.

Text to translate:
${text}

Respond with ONLY the translated text, no explanations or quotes.`
                    }]
                }],
                generationConfig: {
                    temperature: 0.3,
                    maxOutputTokens: 1000,
                }
            })
        });

        if (!response.ok) {
            const error = await response.text();
            console.error('[Translate API Error]', error);
            return NextResponse.json(
                { error: 'Translation failed' },
                { status: 500 }
            );
        }

        const result = await response.json();
        const translatedText = result.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

        if (!translatedText) {
            return NextResponse.json(
                { error: 'No translation result' },
                { status: 500 }
            );
        }

        return NextResponse.json({ translatedText });

    } catch (error) {
        console.error('[Translate API Error]', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
