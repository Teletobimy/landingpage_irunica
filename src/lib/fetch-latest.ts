import { getTrendTranslationCache, cacheTrendTranslation } from './firebase-admin';
import { SupportedLanguage } from '@/config/tld-language';

const GEMINI_API_KEY = process.env.GOOGLE_GEMINI_API_KEY;
const MODEL_NAME = 'gemini-2.5-flash';

const LANGUAGE_NAMES: Record<string, string> = {
    en: 'English',
    ko: 'Korean',
    ja: 'Japanese',
    es: 'Spanish',
    zh: 'Chinese (Simplified)',
};

// Translate summary text using Gemini API (server-side)
async function translateSummaryServer(text: string, targetLang: SupportedLanguage): Promise<string> {
    if (targetLang === 'ko' || !GEMINI_API_KEY) {
        return text;
    }

    const targetLanguage = LANGUAGE_NAMES[targetLang] || 'English';

    try {
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
            console.error('[Server Translate] API error:', await response.text());
            return text;
        }

        const result = await response.json();
        const translatedText = result.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

        return translatedText || text;
    } catch (error) {
        console.error('[Server Translate] Error:', error);
        return text;
    }
}

// Get translated trend data with caching
export async function getTranslatedTrendData(
    trendData: any,
    lang: SupportedLanguage
): Promise<{ translatedData: any; translatedSummaries: Record<string, string> }> {
    if (!trendData || lang === 'ko') {
        return { translatedData: trendData, translatedSummaries: {} };
    }

    const categories = ['메이크업', '립메이크업', '아이메이크업', '베이스메이크업'];
    const translatedSummaries: Record<string, string> = {};

    // Process each category
    for (const category of categories) {
        if (!trendData[category]?.summary) continue;

        // Check cache first
        const cached = await getTrendTranslationCache(lang, category);
        if (cached) {
            translatedSummaries[category] = cached;
        } else {
            // Translate and cache
            const translated = await translateSummaryServer(trendData[category].summary, lang);
            if (translated !== trendData[category].summary) {
                await cacheTrendTranslation(lang, category, translated);
            }
            translatedSummaries[category] = translated;
        }
    }

    return { translatedData: trendData, translatedSummaries };
}

export async function getLatestTrends(type: 'category' | 'color') {
    const DATA_PROJECT_ID = "oliveyoung-ranking";
    const url = `https://firestore.googleapis.com/v1/projects/${DATA_PROJECT_ID}/databases/(default)/documents:runQuery`;

    const query = {
        structuredQuery: {
            from: [{ collectionId: "trend_analysis" }],
            where: {
                fieldFilter: {
                    field: { fieldPath: "type" },
                    op: "EQUAL",
                    value: { stringValue: `${type}_trends` }
                }
            },
            orderBy: [{ field: { fieldPath: "updatedAt" }, direction: "DESCENDING" }],
            limit: 1
        }
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(query),
            next: { revalidate: 3600 }
        });

        if (!response.ok) {
            const errorDetail = await response.text();
            console.warn(`[Data Project Error] ${response.status}: ${errorDetail}`);
            return null;
        }

        const result = await response.json();
        if (!result || !result[0]?.document) {
            console.warn(`No ${type} data found in oliveyoung-ranking.`);
            return null;
        }

        // Reuse existing parser
        const doc = result[0].document;
        return {
            id: doc.name.split('/').pop(),
            data: parseFirestoreValue(doc.fields.data),
            updatedAt: doc.fields.updatedAt.stringValue
        };
    } catch (error) {
        console.error(`Latest ${type} Fetch Error:`, error);
        return null;
    }
}

// Helper to parse Firestore REST API response format
export function parseFirestoreValue(value: any): any {
    if (value.mapValue) {
        const map = value.mapValue.fields || {};
        const obj: any = {};
        for (const key in map) {
            obj[key] = parseFirestoreValue(map[key]);
        }
        return obj;
    } else if (value.arrayValue) {
        const arr = value.arrayValue.values || [];
        return arr.map((v: any) => parseFirestoreValue(v));
    } else if (value.stringValue !== undefined) {
        return value.stringValue;
    } else if (value.integerValue !== undefined) {
        return Number(value.integerValue);
    } else if (value.doubleValue !== undefined) {
        return Number(value.doubleValue);
    } else if (value.booleanValue !== undefined) {
        return value.booleanValue;
    } else if (value.timestampValue !== undefined) {
        return value.timestampValue;
    } else if (value.nullValue !== undefined) {
        return null;
    }
    return value;
}
