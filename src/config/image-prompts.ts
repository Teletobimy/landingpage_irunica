import { IndustryType } from '@/types/company';

export interface ImagePromptConfig {
  productStyle: string;
  atmosphere: string;
  additionalContext: string;
}

// Base context for ALL prompts - ensures skincare/cosmetics products
const KBEAUTY_BASE = 'Korean skincare cosmetic product';

export const INDUSTRY_IMAGE_PROMPTS: Record<IndustryType, ImagePromptConfig> = {
  spa: {
    productStyle: `${KBEAUTY_BASE}, frosted glass serum bottle with botanical elements`,
    atmosphere: 'zen spa environment, bamboo accents, soft natural lighting',
    additionalContext: 'relaxation and wellness skincare theme',
  },
  clinic: {
    productStyle: `${KBEAUTY_BASE}, medical-grade dropper serum bottle, clinical precision packaging`,
    atmosphere: 'clean clinical setting, professional lighting, sterile aesthetic',
    additionalContext: 'dermatologist-approved professional skincare',
  },
  retail: {
    productStyle: `${KBEAUTY_BASE}, trendy colorful skincare package with modern K-beauty design`,
    atmosphere: 'instagrammable flat lay, vibrant colors, lifestyle setting',
    additionalContext: 'social media ready K-beauty consumer appeal',
  },
  hotel: {
    productStyle: `${KBEAUTY_BASE}, luxury skincare amenity bottle with elegant minimalist design`,
    atmosphere: '5-star hotel bathroom, marble surfaces, premium ambiance',
    additionalContext: 'hospitality luxury skincare, guest experience',
  },
  distributor: {
    productStyle: `${KBEAUTY_BASE}, premium skincare serum bottle with wholesale presentation`,
    atmosphere: 'professional product showcase, clean backdrop, commercial display',
    additionalContext: 'B2B skincare presentation, bulk cosmetics packaging',
  },
  unknown: {
    productStyle: `${KBEAUTY_BASE}, premium frosted glass serum bottle with minimalist logo`,
    atmosphere: 'professional studio lighting, clean white background',
    additionalContext: 'versatile premium K-beauty skincare',
  },
};

export function generateImagePromptsForIndustry(
  companyName: string,
  industry: IndustryType
): { id: string; p: string }[] {
  const config = INDUSTRY_IMAGE_PROMPTS[industry] || INDUSTRY_IMAGE_PROMPTS.unknown;
  const { productStyle, atmosphere, additionalContext } = config;

  const productCore = `${productStyle} with subtle '${companyName}' branding`;

  return [
    {
      id: 'p1',
      p: `Professional studio shot of ${productCore}, ${atmosphere}, ${additionalContext}, 8k resolution, product photography`,
    },
    {
      id: 'p2',
      p: `Close-up detail of Korean skincare serum bottle with ${companyName} logo, macro shot, professional cosmetic photography`,
    },
    {
      id: 'p3',
      p: `Artistic composition of ${productCore} in ${atmosphere}, luxury K-beauty vibe`,
    },
    {
      id: 'm1',
      p: `A professional model with flawless skin holding ${productCore}, beauty magazine style, ${additionalContext}`,
    },
    {
      id: 'm2',
      p: `Luxury skincare lifestyle setting with ${productCore}, ${atmosphere}, soft morning light, K-beauty aesthetic`,
    },
  ];
}
