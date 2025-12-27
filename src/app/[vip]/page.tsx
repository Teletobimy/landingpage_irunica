import { getVIPData } from '@/lib/google-sheets';
import { getOrGenerateAssets, GeneratedContent } from '@/lib/ai-service';
import { checkVipCache, cacheVipResult, logVisitor } from '@/lib/firebase-admin';
import { notFound } from 'next/navigation';
import React from 'react';
import CinematicIntro from '@/components/CinematicIntro';
import VisualSection from '@/components/VisualSection';
import AnalysisSection from '@/components/AnalysisSection';
import ColorAtelier from '@/components/ColorAtelier';
import RiskFreeScaler from '@/components/modules/RiskFreeScaler';
import ProtocolMatcher from '@/components/modules/ProtocolMatcher';
import InfluencerStore from '@/components/modules/InfluencerStore';
import LeadCaptureFlow from '@/components/LeadCaptureFlow';
import { getLatestTrends } from '@/lib/fetch-latest';


export const dynamic = 'force-dynamic';

interface PageProps {
    params: Promise<{
        vip: string;
    }>;
}

export default async function VIPPage({ params }: PageProps) {
    const { vip } = await params;
    const vipId = decodeURIComponent(vip);

    if (!vipId) return notFound();

    return (
        <main className="min-h-screen bg-black text-white selection:bg-gold-500 selection:text-black">
            {/* 0. Cinematic Intro (Immediate Render - 0ms delay) */}
            <CinematicIntro />

            {/* 1. Main Content (Suspended while fetching data) */}
            <React.Suspense fallback={<div className="min-h-screen bg-black" />}>
                <VIPPageContent vipId={vipId} />
            </React.Suspense>
        </main>
    );
}

// Data Fetching Component
async function VIPPageContent({ vipId }: { vipId: string }) {
    // 1. Validate VIP
    const vipData = await getVIPData(vipId);
    if (!vipData) {
        console.log(`VIP not found in whitelist: ${vipId}`);
        return notFound();
    }

    const companyName = vipData.companyName || vipId;

    // Fetch Latest Trend Data (Independent)
    const trendDataResponse = await getLatestTrends('color');
    const trendData = trendDataResponse ? trendDataResponse.data : null;

    // 2. Fetch Content (Streaming Pattern)
    let synergyText;
    let productImagesPromise;

    try {
        const result = await getOrGenerateAssets(vipId, companyName);
        if (!result) return notFound();
        synergyText = result.synergyText;
        productImagesPromise = result.productImagesPromise;

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

    return (
        <>
            {/* Analysis Section (Immediate: Text is ready) */}
            <AnalysisSection companyName={companyName} analysisData={synergyText} />

            {/* Module 1: Risk & Business Value (Rational) */}
            <RiskFreeScaler />

            {/* Module 2: Solution Fitting */}
            <ProtocolMatcher companyName={companyName} />

            {/* Module 3: Color Trends */}
            <ColorAtelier trendData={trendData} category="립메이크업" />

            {/* Module 4: Product Visualization (Streaming Images) */}
            <React.Suspense fallback={<div className="h-[600px] flex items-center justify-center text-gold-500 animate-pulse">Creating Visuals...</div>}>
                <VisualSectionWrapper imagesPromise={productImagesPromise} companyName={companyName} />
            </React.Suspense>

            {/* Module 5: Influencer Store (Requires Images) */}
            <React.Suspense fallback={<div className="h-96" />}>
                <InfluencerStoreWrapper imagesPromise={productImagesPromise} companyName={companyName} />
            </React.Suspense>

            {/* CTA */}
            <React.Suspense fallback={<div className="h-48" />}>
                <LeadCaptureFlowWrapper imagesPromise={productImagesPromise} companyName={companyName} />
            </React.Suspense>
        </>
    );
}

// Temporary Inline Wrappers
async function VisualSectionWrapper({ imagesPromise, companyName }: { imagesPromise: Promise<any>, companyName: string }) {
    const images = await imagesPromise;
    return <VisualSection images={images} companyName={companyName} />;
}
async function InfluencerStoreWrapper({ imagesPromise, companyName }: { imagesPromise: Promise<any>, companyName: string }) {
    const images = await imagesPromise;
    return <InfluencerStore companyName={companyName} productImages={images} />;
}
async function LeadCaptureFlowWrapper({ imagesPromise, companyName }: { imagesPromise: Promise<any>, companyName: string }) {
    const images = await imagesPromise;
    return <LeadCaptureFlow companyName={companyName} generatedImages={images} />;
}
