import { getTrendTranslationCache, cacheTrendTranslation, getColorNameCache, cacheColorNames } from './firebase-admin';
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

// Check if a color name is in Korean (contains Hangul characters)
function isKoreanColorName(name: string): boolean {
    // Has Korean characters AND no English in parentheses
    const hasKorean = /[\uAC00-\uD7AF\u1100-\u11FF\u3130-\u318F]/.test(name);
    const hasEnglishInParens = /\([A-Za-z\s&]+\)/.test(name);
    return hasKorean && !hasEnglishInParens;
}

// Extract all color names from trend data that need translation
function extractColorNamesToTranslate(trendData: any): string[] {
    const colorNames = new Set<string>();
    const categories = ['메이크업', '립메이크업', '아이메이크업', '베이스메이크업'];

    for (const category of categories) {
        if (!trendData[category]) continue;

        // Add trending_colors
        const trendingColors = trendData[category].trending_colors || [];
        for (const color of trendingColors) {
            if (isKoreanColorName(color)) {
                colorNames.add(color);
            }
        }

        // Add color_family keys and values
        const colorFamilies = trendData[category].color_families || {};
        for (const [familyName, colors] of Object.entries(colorFamilies)) {
            if (isKoreanColorName(familyName)) {
                colorNames.add(familyName);
            }
            if (Array.isArray(colors)) {
                for (const color of colors) {
                    if (isKoreanColorName(color)) {
                        colorNames.add(color);
                    }
                }
            }
        }
    }

    return Array.from(colorNames);
}

// Translate color names in batch using Gemini API
async function translateColorNamesBatch(colorNames: string[], targetLang: SupportedLanguage): Promise<Record<string, string>> {
    if (colorNames.length === 0 || !GEMINI_API_KEY) {
        return {};
    }

    const targetLanguage = LANGUAGE_NAMES[targetLang] || 'English';

    try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${GEMINI_API_KEY}`;

        const prompt = `Translate these Korean cosmetic color names to ${targetLanguage}.
These are makeup/lipstick color names used in K-Beauty products.
Keep translations short, elegant, and suitable for cosmetic product naming.

Color names to translate:
${colorNames.map((name, i) => `${i + 1}. ${name}`).join('\n')}

Respond in JSON format ONLY, no markdown, no explanation:
{"translations": {"original Korean name": "translated name", ...}}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: prompt }]
                }],
                generationConfig: {
                    temperature: 0.2,
                    maxOutputTokens: 2000,
                }
            })
        });

        if (!response.ok) {
            console.error('[TranslateColorNames] API error:', await response.text());
            return {};
        }

        const result = await response.json();
        const rawText = result.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

        if (!rawText) return {};

        // Parse JSON response - handle potential markdown code blocks
        let jsonText = rawText;
        if (rawText.includes('```')) {
            const jsonMatch = rawText.match(/```(?:json)?\s*([\s\S]*?)```/);
            jsonText = jsonMatch ? jsonMatch[1].trim() : rawText;
        }

        const parsed = JSON.parse(jsonText);
        return parsed.translations || {};
    } catch (error) {
        console.error('[TranslateColorNames] Error:', error);
        return {};
    }
}

// Main function to get translated color names with caching
export async function getTranslatedColorNames(
    trendData: any,
    lang: SupportedLanguage
): Promise<Record<string, string>> {
    if (!trendData || lang === 'ko') {
        return {};
    }

    // Check cache first
    const cached = await getColorNameCache(lang);
    if (cached) {
        // Verify cache has all needed translations
        const neededColors = extractColorNamesToTranslate(trendData);
        const missingColors = neededColors.filter(color => !cached[color]);

        if (missingColors.length === 0) {
            return cached;
        }

        // Translate missing colors and merge with cache
        console.log(`[TranslateColorNames] ${missingColors.length} colors missing from cache, translating...`);
        const newTranslations = await translateColorNamesBatch(missingColors, lang);
        const merged = { ...cached, ...newTranslations };

        // Update cache with new translations
        if (Object.keys(newTranslations).length > 0) {
            await cacheColorNames(lang, merged);
        }

        return merged;
    }

    // No cache - translate all colors
    const colorNames = extractColorNamesToTranslate(trendData);
    console.log(`[TranslateColorNames] Translating ${colorNames.length} colors for ${lang}`);

    const translations = await translateColorNamesBatch(colorNames, lang);

    // Cache the results
    if (Object.keys(translations).length > 0) {
        await cacheColorNames(lang, translations);
    }

    return translations;
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
