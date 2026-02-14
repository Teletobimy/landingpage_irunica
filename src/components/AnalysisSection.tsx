'use client';
import { motion } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';
import { SupportedLanguage } from '@/config/tld-language';
import { getTranslations } from '@/locales/translations';

interface AnalysisSectionProps {
    companyName: string;
    analysisData: {
        headline: string;
        description: string;
    };
    lang?: SupportedLanguage;
    confidence?: number;
    trendCount?: number;
}

export default function AnalysisSection({ companyName, analysisData, lang = 'en', confidence, trendCount }: AnalysisSectionProps) {
    const t = getTranslations(lang).analysisSection;

    const metrics = [
        { label: t.brandMatch, status: t.verified, icon: '\u2713' },
        { label: t.globalTrend, status: t.analyzed, icon: '\u2713' },
        { label: t.formulaOpt, status: t.optimized, icon: '\u2713' },
        { label: t.marketFit, status: t.matched, icon: '\u2713' },
    ];

    return (
        <section className="min-h-screen bg-gold-50 bg-hanji text-black pt-32 pb-16 px-10 flex flex-col justify-center border-b border-neutral-200">
            <div className="max-w-4xl mx-auto w-full space-y-12">

                {/* Module 1: AI Analysis Status */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {metrics.map((metric, i) => (
                        <motion.div
                            key={metric.label}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: i * 0.125 }}
                            className="bg-neutral-50 p-4 rounded-lg border border-neutral-200"
                        >
                            <p className="text-[10px] text-gray-500 uppercase tracking-tighter">{metric.label}</p>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-gold-600 text-lg font-bold">{metric.icon}</span>
                                <span className="text-sm font-semibold text-neutral-800">{metric.status}</span>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Module 2: Typing Manifesto */}
                <div className="space-y-4">
                    <h2 className="text-3xl md:text-5xl font-thin leading-tight text-neutral-900">
                        {companyName} & IRUNICA <br />
                        <span className="text-gold-500 font-bold italic">{t.renderingFuture}</span>
                    </h2>

                    <div className="text-neutral-600 text-lg md:text-xl font-light leading-relaxed min-h-[100px]">
                        {/* Render typing animation only if description is present */}
                        {analysisData.description && (
                            <TypeAnimation
                                sequence={[
                                    analysisData.description,
                                    1000,
                                ]}
                                speed={90}
                                cursor={true}
                                repeat={0}
                            />
                        )}
                    </div>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-8 justify-center">
                    <a href="#contact" className="px-8 py-4 bg-black text-white rounded-full font-bold text-sm hover:bg-neutral-800 transition-colors text-center">
                        Request Free Samples
                    </a>
                    <a href="#contact" className="px-8 py-4 border border-black text-black rounded-full font-bold text-sm hover:bg-black hover:text-white transition-colors text-center">
                        Schedule a Call
                    </a>
                </div>

                {/* Bottom Arrow */}
                <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="flex justify-center pt-6"
                >
                    <span className="text-[10px] tracking-[0.5em] text-gray-600">{t.scrollToView}</span>
                </motion.div>
            </div>
        </section>
    );
}
