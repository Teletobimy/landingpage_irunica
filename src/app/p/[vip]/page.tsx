import type { Metadata } from 'next';
import { getLeadByPageId, trackPageVisit, getLanguageCode } from '@/lib/leads-api';
import { getOrGenerateAssets } from '@/lib/ai-service';
import { logVisitor } from '@/lib/firebase-admin';
import { notFound } from 'next/navigation';
import React from 'react';
import dynamicImport from 'next/dynamic';
import { VIPPageWrapper, ContentReadySignal } from '@/components/VIPPageWrapper';
import VisualSection from '@/components/VisualSection';
import AnalysisSection from '@/components/AnalysisSection';
import InfluencerStore from '@/components/modules/InfluencerStore';
import LeadCaptureFlow from '@/components/LeadCaptureFlow';
import { getLatestTrends } from '@/lib/fetch-latest';
import { getModulesForIndustry, ModuleName } from '@/config/module-registry';
import { CompanyClassification } from '@/types/company';
import { detectLanguageFromDomain } from '@/lib/language-detector';
import { SupportedLanguage } from '@/config/tld-language';

// Dynamic imports for all module components
const MODULE_COMPONENTS: Record<ModuleName, React.ComponentType<any>> = {
    RiskFreeScaler: dynamicImport(() => import('@/components/modules/RiskFreeScaler')),
    ProtocolMatcher: dynamicImport(() => import('@/components/modules/ProtocolMatcher')),
    ColorAtelier: dynamicImport(() => import('@/components/ColorAtelier')),
    TrendAnalysis: dynamicImport(() => import('@/components/modules/TrendAnalysis')),
    BulkPricing: dynamicImport(() => import('@/components/modules/BulkPricing')),
    WhiteLabel: dynamicImport(() => import('@/components/modules/WhiteLabel')),
};


export const dynamic = 'force-dynamic';

// Static OG metadata for social sharing
export const metadata: Metadata = {
    title: 'Irunica - Premium K-Beauty Private Label',
    description: 'Your exclusive gateway to Korean beauty innovation. Premium Korean cosmetics ODM/OEM solutions.',
    openGraph: {
        title: 'Irunica - Premium K-Beauty Private Label',
        description: 'Your exclusive gateway to Korean beauty innovation.',
        type: 'website',
    },
};

interface PageProps {
    params: Promise<{
        vip: string;
    }>;
}

export default async function VIPPage({ params }: PageProps) {
    const { vip } = await params;
    const vipId = decodeURIComponent(vip);

    if (!vipId) return notFound();

    // Detect language from vipId (email or domain) for loading screen
    const initialLang = detectLanguageFromDomain(vipId);

    return (
        <main className="min-h-screen bg-black text-white selection:bg-gold-500 selection:text-black">
            {/* VIPPageWrapper: Coordinates CinematicIntro with content loading */}
            <VIPPageWrapper lang={initialLang}>
                {/* Main Content (Suspended while fetching data) */}
                <React.Suspense fallback={<div className="min-h-screen bg-black" />}>
                    <VIPPageContent vipId={vipId} />
                </React.Suspense>
            </VIPPageWrapper>
        </main>
    );
}

// Data Fetching Component
async function VIPPageContent({ vipId }: { vipId: string }) {
    // 1. Parallel fetch: Lead data from API + Trend data (independent)
    const [leadData, trendDataResponse] = await Promise.all([
        getLeadByPageId(vipId),
        getLatestTrends('color')
    ]);

    if (!leadData) {
        console.log(`Landing page not found: ${vipId}`);
        return notFound();
    }

    // Track the visit (fire-and-forget)
    trackPageVisit(vipId).catch(err => console.error('Failed to track visit:', err));

    const companyName = leadData.companyName || vipId;
    const trendData = trendDataResponse ? trendDataResponse.data : null;
    const trendUpdatedAt = trendDataResponse ? trendDataResponse.updatedAt : null;
    const researchReport = leadData.researchReport; // AI 회사 조사보고서

    // 2. Use language from API (supports both ISO codes and full names)
    const langMap: Record<string, SupportedLanguage> = {
        'ko': 'ko', 'Korean': 'ko',
        'ja': 'ja', 'Japanese': 'ja',
        'zh': 'zh', 'Chinese': 'zh',
        'es': 'es', 'Spanish': 'es',
        'pt': 'pt', 'Portuguese': 'pt',
        'de': 'de', 'German': 'de',
        'fr': 'fr', 'French': 'fr',
        'it': 'it', 'Italian': 'it',
        'en': 'en', 'English': 'en',
    };
    const language = (langMap[leadData.language] || 'en') as SupportedLanguage;
    console.log(`[Language] Detected: ${language} for ${vipId}`);
    if (researchReport) {
        console.log(`[Research] Found research report for ${vipId} (${researchReport.length} chars)`);
    }

    // 3. Fetch Content (Streaming Pattern)
    let synergyText;
    let productImagesPromise;
    let classification: CompanyClassification;

    try {
        const result = await getOrGenerateAssets(vipId, companyName, language, researchReport);
        if (!result) return notFound();
        synergyText = result.synergyText;
        productImagesPromise = result.productImagesPromise;
        classification = result.classification;

        await logVisitor(vipId);
    } catch (e) {
        console.error('Content retrieval failed:', e);
        return (
            <div className="min-h-screen flex items-center justify-center bg-black text-white">
                <div className="text-center p-8 border border-white/10 rounded-2xl bg-neutral-900">
                    <h1 className="text-xl font-bold mb-4 text-red-500">Access Limited</h1>
                    <p className="text-gray-400">
                        {e instanceof Error ? e.message : 'Too many requests. Please try again later.'}
                    </p>
                </div>
            </div>
        );
    }

    // Get industry-specific modules
    const modules = getModulesForIndustry(classification.industry);

    return (
        <>
            {/* Signal that main content is ready (dismisses CinematicIntro) */}
            <ContentReadySignal />

            {/* Analysis Section (Immediate: Text is ready) */}
            <AnalysisSection companyName={companyName} analysisData={synergyText} />

            {/* Dynamic Industry-Specific Modules */}
            {modules.map((moduleConfig) => {
                const ModuleComponent = MODULE_COMPONENTS[moduleConfig.component];
                // Pass props based on component type (including language)
                const props = getModuleProps(moduleConfig.component, companyName, trendData, trendUpdatedAt, language, vipId);
                return <ModuleComponent key={moduleConfig.component} {...props} />;
            })}

            {/* Image-Dependent Sections (Single Suspense Boundary) */}
            <React.Suspense fallback={
                <div className="h-[600px] flex items-center justify-center text-gold-500 animate-pulse">
                    Creating Visuals...
                </div>
            }>
                <ImageDependentSections
                    imagesPromise={productImagesPromise}
                    companyName={companyName}
                    lang={language}
                    vipId={vipId}
                />
            </React.Suspense>
        </>
    );
}

// Helper function to get props for each module type
function getModuleProps(moduleName: ModuleName, companyName: string, trendData: any, trendUpdatedAt: string | null, lang: SupportedLanguage, vipId: string): Record<string, any> {
    const baseProps = { lang };
    switch (moduleName) {
        case 'ProtocolMatcher':
            return { ...baseProps, companyName };
        case 'ColorAtelier':
            return { ...baseProps, trendData, category: '립메이크업' };
        case 'TrendAnalysis':
            return { ...baseProps, trendData, updatedAt: trendUpdatedAt };
        case 'BulkPricing':
            return { ...baseProps, companyName, vipId };
        default:
            return baseProps;
    }
}

// Combined wrapper for all image-dependent sections
async function ImageDependentSections({ imagesPromise, companyName, lang, vipId }: { imagesPromise: Promise<{ id: string; url: string }[]>, companyName: string, lang: SupportedLanguage, vipId: string }) {
    const images = await imagesPromise;
    return (
        <>
            <VisualSection images={images} companyName={companyName} />
            <InfluencerStore companyName={companyName} productImages={images} vipId={vipId} />
            <LeadCaptureFlow companyName={companyName} generatedImages={images} lang={lang} />
        </>
    );
}
