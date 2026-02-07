export type SupportedLanguage = 'en' | 'ko' | 'ja' | 'es' | 'zh' | 'pt' | 'de' | 'fr' | 'it';

export const LANGUAGE_NAMES: Record<SupportedLanguage, string> = {
  en: 'English',
  ko: 'Korean',
  ja: 'Japanese',
  es: 'Spanish',
  zh: 'Chinese',
  pt: 'Portuguese',
  de: 'German',
  fr: 'French',
  it: 'Italian',
};

export const TLD_LANGUAGE_MAP: Record<string, SupportedLanguage> = {
  // 한국어
  'kr': 'ko',

  // 일본어
  'jp': 'ja',

  // 스페인어
  'mx': 'es',  // 멕시코
  'es': 'es',  // 스페인
  'ar': 'es',  // 아르헨티나
  'co': 'es',  // 콜롬비아
  'cl': 'es',  // 칠레
  'pe': 'es',  // 페루
  've': 'es',  // 베네수엘라
  'ec': 'es',  // 에콰도르
  'gt': 'es',  // 과테말라
  'cu': 'es',  // 쿠바
  'do': 'es',  // 도미니카 공화국
  'py': 'es',  // 파라과이
  'uy': 'es',  // 우루과이
  'bo': 'es',  // 볼리비아
  'hn': 'es',  // 온두라스
  'sv': 'es',  // 엘살바도르
  'ni': 'es',  // 니카라과
  'cr': 'es',  // 코스타리카
  'pa': 'es',  // 파나마

  // 중국어
  'cn': 'zh',
  'tw': 'zh',
  'hk': 'zh',

  // 포르투갈어
  'br': 'pt',  // 브라질
  'pt': 'pt',  // 포르투갈

  // 독일어
  'de': 'de',  // 독일
  'at': 'de',  // 오스트리아
  'ch': 'de',  // 스위스 (독일어 기본)

  // 프랑스어
  'fr': 'fr',  // 프랑스
  'be': 'fr',  // 벨기에

  // 이탈리아어
  'it': 'it',  // 이탈리아

  // 영어 (기본값)
  'com': 'en',
  'net': 'en',
  'org': 'en',
  'us': 'en',
  'uk': 'en',
  'au': 'en',
  'ca': 'en',
  'nz': 'en',
  'ie': 'en',
  'sg': 'en',

  // 테크/스타트업 TLD (영어 기본)
  'io': 'en',   // British Indian Ocean Territory - 테크 스타트업
  'ai': 'en',   // Anguilla - AI 회사들
  // 'co'는 위에서 스페인어로 설정됨 (콜롬비아)
  'app': 'en',  // 앱 관련
  'dev': 'en',  // 개발자
  'tech': 'en', // 테크
  'me': 'en',   // Montenegro - 개인 브랜드
  'gg': 'en',   // Guernsey - 게임
  'tv': 'en',   // Tuvalu - 미디어
  'so': 'en',   // Somalia - 스타트업
  'fm': 'en',   // Micronesia - 팟캐스트/라디오
  'to': 'en',   // Tonga - 링크 단축
  'cc': 'en',   // Cocos Islands
  'biz': 'en',  // 비즈니스
  'info': 'en', // 정보
};

export const DEFAULT_LANGUAGE: SupportedLanguage = 'en';
