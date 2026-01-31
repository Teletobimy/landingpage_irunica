/**
 * Leads API Client
 * Fetches lead data from Flask backend API instead of Google Sheets.
 * This integrates the landing page with the main email sender pipeline.
 */

const API_BASE_URL = process.env.FLASK_API_URL || 'https://email-sender-53995941986.asia-northeast3.run.app';

export interface LeadData {
    companyName: string;
    email: string;
    website: string;
    researchReport: string;
    language: string;
    region: string;
    keyword: string;
}

/**
 * Get lead data by landing page ID.
 * This is the main entry point for the landing page.
 */
export async function getLeadByPageId(pageId: string): Promise<LeadData | null> {
    try {
        const response = await fetch(`${API_BASE_URL}/api/landing/${encodeURIComponent(pageId)}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            // Disable caching to always get fresh data
            cache: 'no-store',
        });

        if (!response.ok) {
            if (response.status === 404) {
                console.log(`Landing page '${pageId}' not found`);
                return null;
            }
            throw new Error(`API error: ${response.status}`);
        }

        const result = await response.json();

        if (!result.success) {
            console.error('API returned error:', result.error);
            return null;
        }

        const data = result.data;
        return {
            companyName: data.company_name || '',
            email: data.email || '',
            website: data.website || '',
            researchReport: data.research_summary || '',
            language: data.language || 'en',
            region: data.region || '',
            keyword: data.keyword || '',
        };
    } catch (error) {
        console.error('Error fetching lead data:', error);
        return null;
    }
}

/**
 * Track landing page visit.
 * Called when a visitor views the landing page.
 */
export async function trackPageVisit(pageId: string): Promise<boolean> {
    try {
        const response = await fetch(`${API_BASE_URL}/api/landing/${encodeURIComponent(pageId)}/visit`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            console.error('Failed to track visit:', response.status);
            return false;
        }

        return true;
    } catch (error) {
        console.error('Error tracking visit:', error);
        return false;
    }
}

/**
 * Detect language from email TLD.
 * Returns ISO 639-1 language code (e.g., 'en', 'ko', 'ja').
 * This mirrors the backend logic for consistency.
 */
export function detectLanguageFromEmail(email: string): string {
    if (!email) return 'en';

    const emailLower = email.toLowerCase();
    const tldMap: Record<string, string> = {
        '.jp': 'ja',
        '.kr': 'ko',
        '.cn': 'zh',
        '.tw': 'zh',
        '.de': 'de',
        '.fr': 'fr',
        '.es': 'es',
        '.mx': 'es',
        '.it': 'it',
        '.br': 'pt',
        '.pt': 'pt',
    };

    for (const [tld, lang] of Object.entries(tldMap)) {
        if (emailLower.endsWith(tld)) {
            return lang;
        }
    }

    return 'en';
}

/**
 * Get language code from language name or code.
 * Handles both ISO codes ('en', 'ko') and full names ('English', 'Korean').
 * Used for i18n compatibility.
 */
export function getLanguageCode(language: string): string {
    // If already ISO code (2-3 chars), return as-is
    if (language && language.length <= 3) {
        return language;
    }

    // Map full names to ISO codes
    const languageMap: Record<string, string> = {
        'English': 'en',
        'Korean': 'ko',
        'Japanese': 'ja',
        'Chinese': 'zh',
        'Spanish': 'es',
        'German': 'de',
        'French': 'fr',
        'Italian': 'it',
        'Portuguese': 'pt',
    };

    return languageMap[language] || 'en';
}
