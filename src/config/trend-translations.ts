import { SupportedLanguage } from './tld-language';

// Color family name translations - keys must match exactly with Firestore data
export const COLOR_FAMILY_TRANSLATIONS: Record<string, Record<SupportedLanguage, string>> = {
    // === 립메이크업 (Korean only) ===
    '레드': { en: 'Red', ko: '레드', ja: 'レッド', es: 'Rojo', zh: '红色' },
    '핑크': { en: 'Pink', ko: '핑크', ja: 'ピンク', es: 'Rosa', zh: '粉色' },
    '코랄/피치': { en: 'Coral/Peach', ko: '코랄/피치', ja: 'コーラル/ピーチ', es: 'Coral/Melocotón', zh: '珊瑚/桃色' },
    '누드/베이지': { en: 'Nude/Beige', ko: '누드/베이지', ja: 'ヌード/ベージュ', es: 'Nude/Beige', zh: '裸色/米色' },
    '로즈/모브/플럼': { en: 'Rose/Mauve/Plum', ko: '로즈/모브/플럼', ja: 'ローズ/モーブ/プラム', es: 'Rosa/Malva/Ciruela', zh: '玫瑰/淡紫/梅色' },
    '기타/투명': { en: 'Other/Clear', ko: '기타/투명', ja: 'その他/クリア', es: 'Otros/Transparente', zh: '其他/透明' },

    // === 아이메이크업 (Korean only) ===
    '내추럴 블랙 & 그레이': { en: 'Natural Black & Gray', ko: '내추럴 블랙 & 그레이', ja: 'ナチュラルブラック＆グレー', es: 'Negro y Gris Natural', zh: '自然黑&灰' },
    '클래식 & 딥 브라운': { en: 'Classic & Deep Brown', ko: '클래식 & 딥 브라운', ja: 'クラシック＆ディープブラウン', es: 'Marrón Clásico y Profundo', zh: '经典&深棕' },
    '소프트 뮤트 & 애쉬 브라운': { en: 'Soft Mute & Ash Brown', ko: '소프트 뮤트 & 애쉬 브라운', ja: 'ソフトミュート＆アッシュブラウン', es: 'Marrón Suave y Ceniza', zh: '柔和&灰棕' },
    '로지 & 모브 & 플럼': { en: 'Rosy & Mauve & Plum', ko: '로지 & 모브 & 플럼', ja: 'ロージー＆モーブ＆プラム', es: 'Rosado, Malva y Ciruela', zh: '玫瑰&淡紫&梅色' },
    '웜 피치 & 코랄 & 베이지': { en: 'Warm Peach & Coral & Beige', ko: '웜 피치 & 코랄 & 베이지', ja: 'ウォームピーチ＆コーラル＆ベージュ', es: 'Melocotón, Coral y Beige Cálido', zh: '暖桃&珊瑚&米色' },
    '하이라이팅 쉬머 & 글리터': { en: 'Highlighting Shimmer & Glitter', ko: '하이라이팅 쉬머 & 글리터', ja: 'ハイライトシマー＆グリッター', es: 'Brillo y Glitter', zh: '高光闪粉&亮片' },

    // === 메이크업 (Korean + English in parentheses) ===
    '뉴트럴 & 베이지 (Neutral & Beige)': { en: 'Neutral & Beige', ko: '뉴트럴 & 베이지', ja: 'ニュートラル＆ベージュ', es: 'Neutral y Beige', zh: '中性&米色' },
    '모브 & 뮤트 (Mauve & Muted)': { en: 'Mauve & Muted', ko: '모브 & 뮤트', ja: 'モーブ＆ミュート', es: 'Malva y Apagado', zh: '淡紫&柔和' },
    '핑크 & 로즈 (Pink & Rose)': { en: 'Pink & Rose', ko: '핑크 & 로즈', ja: 'ピンク＆ローズ', es: 'Rosa y Rosado', zh: '粉色&玫瑰' },
    '애쉬 & 그레이 음영 (Ash & Gray Shading)': { en: 'Ash & Gray Shading', ko: '애쉬 & 그레이 음영', ja: 'アッシュ＆グレーシェーディング', es: 'Sombreado Ceniza y Gris', zh: '灰色阴影' },
    '스킨 & 베이스 (Skin & Base)': { en: 'Skin & Base', ko: '스킨 & 베이스', ja: 'スキン＆ベース', es: 'Piel y Base', zh: '肤色&底妆' },
    '딥 & 클래식 (Deep & Classic)': { en: 'Deep & Classic', ko: '딥 & 클래식', ja: 'ディープ＆クラシック', es: 'Profundo y Clásico', zh: '深色&经典' },

    // === 베이스메이크업 (Korean + English in parentheses) ===
    '페일/라이트 베이스 (Brightening)': { en: 'Pale/Light Base (Brightening)', ko: '페일/라이트 베이스', ja: 'ペール/ライトベース', es: 'Base Clara/Iluminadora', zh: '浅色/亮白底妆' },
    '뉴트럴/내추럴 베이지 (Neutral & Sand)': { en: 'Neutral/Natural Beige', ko: '뉴트럴/내추럴 베이지', ja: 'ニュートラル/ナチュラルベージュ', es: 'Beige Neutro/Natural', zh: '中性/自然米色' },
    '모브/쿨 핑크 (Cool-Toned Muted)': { en: 'Mauve/Cool Pink (Cool-Toned)', ko: '모브/쿨 핑크', ja: 'モーブ/クールピンク', es: 'Malva/Rosa Frío', zh: '淡紫/冷粉' },
    '웜 피치/코랄 (Warm-Toned Healthy)': { en: 'Warm Peach/Coral (Warm-Toned)', ko: '웜 피치/코랄', ja: 'ウォームピーチ/コーラル', es: 'Melocotón/Coral Cálido', zh: '暖桃/珊瑚' },
    '컨투어링/뉴트럴 브라운 (Shading & Muted)': { en: 'Contouring/Neutral Brown', ko: '컨투어링/뉴트럴 브라운', ja: 'コントゥアリング/ニュートラルブラウン', es: 'Contorno/Marrón Neutro', zh: '修容/中性棕' },
    '글로우/하이라이팅 (Radiance & Glow)': { en: 'Glow/Highlighting', ko: '글로우/하이라이팅', ja: 'グロー/ハイライト', es: 'Brillo/Iluminador', zh: '光泽/高光' },
};

// Get translated color family name
export function getColorFamilyTranslation(koreanName: string, lang: SupportedLanguage): string {
    // Direct match first
    const translation = COLOR_FAMILY_TRANSLATIONS[koreanName];
    if (translation) {
        return translation[lang] || translation.en || koreanName;
    }

    // If no direct match and lang is not Korean, try to extract English from parentheses
    if (lang !== 'ko') {
        const match = koreanName.match(/\(([^)]+)\)/);
        if (match) {
            return match[1].trim();
        }
    }

    // For Korean, remove English in parentheses
    if (lang === 'ko') {
        return koreanName.replace(/\s*\([^)]*\)\s*/g, '').trim();
    }

    return koreanName;
}

// Extract English name from color name like "뮤트 모브(Mute Mauve)"
export function extractColorName(colorName: string, lang: SupportedLanguage): string {
    if (lang === 'ko') {
        // For Korean, show Korean name only (remove English in parentheses)
        return colorName.replace(/\s*\([^)]*\)\s*/g, '').trim();
    }

    // For other languages, extract English from parentheses
    const match = colorName.match(/\(([^)]+)\)/);
    if (match) {
        return match[1].trim();
    }

    // Fallback: remove parentheses content
    return colorName.replace(/\s*\([^)]*\)\s*/g, '').trim();
}
