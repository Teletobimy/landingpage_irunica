export type IndustryType = 'spa' | 'clinic' | 'retail' | 'hotel' | 'distributor' | 'unknown';

export interface CompanyClassification {
  industry: IndustryType;
  country: string;
  companySize: 'small' | 'medium' | 'large' | 'unknown';
  confidence: number;
  painPoints: string[];
  classifiedAt: string;
}
