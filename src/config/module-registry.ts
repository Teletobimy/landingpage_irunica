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
    { component: 'RiskFreeScaler', priority: 1 },
    { component: 'ProtocolMatcher', priority: 2 },
    { component: 'ColorAtelier', priority: 3 },
  ],
  clinic: [
    { component: 'RiskFreeScaler', priority: 1 },
    { component: 'ProtocolMatcher', priority: 2 },
    { component: 'ColorAtelier', priority: 3 },
  ],
  retail: [
    { component: 'RiskFreeScaler', priority: 1 },
    { component: 'TrendAnalysis', priority: 2 },
    { component: 'ColorAtelier', priority: 3 },
  ],
  hotel: [
    { component: 'BulkPricing', priority: 1 },
    { component: 'WhiteLabel', priority: 2 },
    { component: 'ProtocolMatcher', priority: 3 },
  ],
  distributor: [
    { component: 'BrandPortfolio', priority: 1 },
    { component: 'BulkPricing', priority: 2 },
    { component: 'RiskFreeScaler', priority: 3 },
  ],
  unknown: [
    { component: 'RiskFreeScaler', priority: 1 },
    { component: 'ProtocolMatcher', priority: 2 },
    { component: 'ColorAtelier', priority: 3 },
  ],
};

export function getModulesForIndustry(industry: IndustryType): ModuleConfig[] {
  return INDUSTRY_MODULES[industry] || INDUSTRY_MODULES.unknown;
}
