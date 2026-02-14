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
import Footer from '@/components/Footer';
import StickyCTA from '@/components/StickyCTA';
import { getLatestTrends, getTranslatedTrendData, getTranslatedColorNames } from '@/lib/fetch-latest';
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
    WhiteLabel: dynamicImport(() => import('@/components/modules/WhiteLabel')),
    BulkPricing: dynamicImport(() => import('@/components/modules/BulkPricing')),
    BrandPortfolio: dynamicImport(() => import('@/components/modules/BrandPortfolio')),
    SocialProof: dynamicImport(() => import('@/components/modules/SocialProof')),
    WhyIrunica: dynamicImport(() => import('@/components/modules/WhyIrunica')),
    ProcessTimeline: dynamicImport(() => import('@/components/modules/ProcessTimeline')),
    FAQ: dynamicImport(() => import('@/components/modules/FAQ')),
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
    const rawTrendData = trendDataResponse ? trendDataResponse.data : null;
    const trendUpdatedAt = trendDataResponse ? trendDataResponse.updatedAt : null;
    const researchReport = leadData.researchReport; // AI 회사 조사보고서

    // 2. Use language from API (supports both ISO codes and full names)
    const langMap: Record<string, SupportedLanguage> = {
        'ko': 'ko', 'Korean': 'ko',
        'ja': 'ja', 'Japanese': 'ja',
        'zh': 'zh', 'Chinese': 'zh',
        'es': 'es', 'Spanish': 'es',
        // Unsupported languages fallback to English
        'pt': 'en', 'Portuguese': 'en',
        'de': 'en', 'German': 'en',
        'fr': 'en', 'French': 'en',
        'it': 'en', 'Italian': 'en',
        'en': 'en', 'English': 'en',
    };
    const language = (langMap[leadData.language] || 'en') as SupportedLanguage;
    console.log(`[Language] Detected: ${language} for ${vipId}`);
    if (researchReport) {
        console.log(`[Research] Found research report for ${vipId} (${researchReport.length} chars)`);
    }

    // 2.5. Server-side translation of trend data and color names (with Firestore caching)
    const [{ translatedData: trendData, translatedSummaries }, translatedColorNames] = await Promise.all([
        getTranslatedTrendData(rawTrendData, language),
        getTranslatedColorNames(rawTrendData, language)
    ]);

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

    // Common static modules (shown for all industries)
    const SocialProofComponent = MODULE_COMPONENTS.SocialProof;
    const WhyIrunicaComponent = MODULE_COMPONENTS.WhyIrunica;
    const ProcessTimelineComponent = MODULE_COMPONENTS.ProcessTimeline;
    const FAQComponent = MODULE_COMPONENTS.FAQ;

    return (
        <>
            {/* Signal that main content is ready (dismisses CinematicIntro) */}
            <ContentReadySignal />

            {/* Analysis Section (Immediate: Text is ready) */}
            <AnalysisSection
                companyName={companyName}
                analysisData={synergyText}
                lang={language}
                confidence={classification.confidence}
            />

            {/* Social Proof - Trust Building */}
            <SocialProofComponent lang={language} />

            {/* First Industry-Specific Module */}
            {modules.slice(0, 1).map((moduleConfig) => {
                const ModuleComponent = MODULE_COMPONENTS[moduleConfig.component];
                const props = getModuleProps(moduleConfig.component, companyName, trendData, trendUpdatedAt, language, vipId, translatedSummaries, translatedColorNames);
                return <ModuleComponent key={moduleConfig.component} {...props} />;
            })}

            {/* Why Irunica - Differentiators */}
            <WhyIrunicaComponent lang={language} />

            {/* Mid-page CTA */}
            <section className="py-16 bg-[#C8A97E] text-black text-center px-6">
                <h3 className="text-2xl md:text-3xl font-bold mb-4">Ready to Launch Your K-Beauty Line?</h3>
                <p className="text-sm mb-8 opacity-80">From formulation to your shelves in just 14 days</p>
                <a href="#contact" className="inline-block px-10 py-4 bg-black text-white rounded-full font-bold hover:bg-neutral-800 transition-colors">
                    Get Started
                </a>
            </section>

            {/* Process Timeline */}
            <ProcessTimelineComponent lang={language} />

            {/* Remaining Industry-Specific Modules */}
            {modules.slice(1).map((moduleConfig) => {
                const ModuleComponent = MODULE_COMPONENTS[moduleConfig.component];
                const props = getModuleProps(moduleConfig.component, companyName, trendData, trendUpdatedAt, language, vipId, translatedSummaries, translatedColorNames);
                return <ModuleComponent key={moduleConfig.component} {...props} />;
            })}

            {/* FAQ Section */}
            <FAQComponent lang={language} />

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

            {/* Sticky CTA - appears after scrolling past AnalysisSection */}
            <StickyCTA />
        </>
    );
}

// Helper function to get props for each module type
function getModuleProps(moduleName: ModuleName, companyName: string, trendData: any, trendUpdatedAt: string | null, lang: SupportedLanguage, vipId: string, translatedSummaries?: Record<string, string>, translatedColorNames?: Record<string, string>): Record<string, any> {
    const baseProps = { lang, vipId };
    switch (moduleName) {
        case 'ProtocolMatcher':
            return { ...baseProps, companyName };
        case 'ColorAtelier':
            return { ...baseProps, trendData, category: '립메이크업', translatedColorNames };
        case 'TrendAnalysis':
            return { ...baseProps, trendData, updatedAt: trendUpdatedAt, translatedSummaries, translatedColorNames };
        case 'BulkPricing':
            return { ...baseProps, companyName, vipId };
        case 'BrandPortfolio':
            return { ...baseProps, companyName };
        default:
            return baseProps;
    }
}

// Combined wrapper for all image-dependent sections
async function ImageDependentSections({ imagesPromise, companyName, lang, vipId }: { imagesPromise: Promise<{ id: string; url: string }[]>, companyName: string, lang: SupportedLanguage, vipId: string }) {
    const images = await imagesPromise;
    return (
        <>
            <VisualSection images={images} companyName={companyName} lang={lang} />
            <InfluencerStore companyName={companyName} productImages={images} vipId={vipId} lang={lang} />
            <LeadCaptureFlow companyName={companyName} generatedImages={images} lang={lang} />
            <Footer lang={lang} />
        </>
    );
}
