import { IndustryType } from '@/types/company';

export type ModuleName =
  | 'RiskFreeScaler'
  | 'ProtocolMatcher'
  | 'ColorAtelier'
  | 'TrendAnalysis'
  | 'BulkPricing'
  | 'WhiteLabel'
  | 'BrandPortfolio'
  | 'SocialProof'
  | 'WhyIrunica'
  | 'ProcessTimeline'
  | 'FAQ';

export interface ModuleConfig {
  component: ModuleName;
  priority: number;
}

export const INDUSTRY_MODULES: Record<IndustryType, ModuleConfig[]> = {
  spa: [
    { component: 'BrandPortfolio', priority: 1 },
    { component: 'RiskFreeScaler', priority: 2 },
    { component: 'ProtocolMatcher', priority: 3 },
    { component: 'ColorAtelier', priority: 4 },
  ],
  clinic: [
    { component: 'BrandPortfolio', priority: 1 },
    { component: 'RiskFreeScaler', priority: 2 },
    { component: 'ProtocolMatcher', priority: 3 },
    { component: 'ColorAtelier', priority: 4 },
  ],
  retail: [
    { component: 'BrandPortfolio', priority: 1 },
    { component: 'RiskFreeScaler', priority: 2 },
    { component: 'TrendAnalysis', priority: 3 },
    { component: 'ColorAtelier', priority: 4 },
  ],
  hotel: [
    { component: 'BrandPortfolio', priority: 1 },
    { component: 'BulkPricing', priority: 2 },
    { component: 'WhiteLabel', priority: 3 },
    { component: 'ProtocolMatcher', priority: 4 },
  ],
  distributor: [
    { component: 'BrandPortfolio', priority: 1 },
    { component: 'BulkPricing', priority: 2 },
    { component: 'RiskFreeScaler', priority: 3 },
  ],
  unknown: [
    { component: 'BrandPortfolio', priority: 1 },
    { component: 'RiskFreeScaler', priority: 2 },
    { component: 'ProtocolMatcher', priority: 3 },
    { component: 'ColorAtelier', priority: 4 },
  ],
};

export function getModulesForIndustry(industry: IndustryType): ModuleConfig[] {
  return INDUSTRY_MODULES[industry] || INDUSTRY_MODULES.unknown;
}
