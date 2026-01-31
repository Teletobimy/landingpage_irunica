'use client';
import { motion } from 'framer-motion';
import { SupportedLanguage } from '@/config/tld-language';
import { getTranslations } from '@/locales/translations';

interface Props {
    lang?: SupportedLanguage;
}

export default function RiskFreeScaler({ lang = 'en' }: Props) {
    const t = getTranslations(lang).riskFreeScaler;

    const COMPARISON_DATA = [
        { label: t.moq, traditional: t.moqTraditional, irunica: t.moqIrunica },
        { label: t.timeToMarket, traditional: t.timeTraditional, irunica: t.timeIrunica },
        { label: t.rdCert, traditional: t.rdTraditional, irunica: t.rdIrunica },
        { label: t.inventoryRisk, traditional: t.inventoryTraditional, irunica: t.inventoryIrunica },
    ];

    return (
        <section className="py-20 bg-white text-black px-6">
            <div className="max-w-5xl mx-auto">
                <h3 className="text-3xl font-light mb-12 text-center">{t.title} <span className="font-bold">{t.titleBold}</span></h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Traditional Way */}
                    <div className="p-8 bg-neutral-50 rounded-3xl border border-neutral-200 opacity-60">
                        <h4 className="text-sm font-bold uppercase mb-6 text-neutral-400">{t.traditional}</h4>
                        <div className="space-y-6">
                            {COMPARISON_DATA.map((item) => (
                                <div key={item.label} className="flex justify-between border-b border-neutral-200 pb-2">
                                    <span className="text-xs text-neutral-500">{item.label}</span>
                                    <span className="text-sm font-medium">{item.traditional}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    {/* Irunica Way */}
                    <motion.div
                        whileHover={{ y: -5 }}
                        className="p-8 bg-black text-white rounded-3xl shadow-2xl relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-4 bg-gold-500 text-black text-[10px] font-bold">{t.fastTrack}</div>
                        <h4 className="text-sm font-bold uppercase mb-6 text-gold-400 font-mono">{t.irunica}</h4>
                        <div className="space-y-6">
                            {COMPARISON_DATA.map((item) => (
                                <div key={item.label} className="flex justify-between border-b border-white/10 pb-2">
                                    <span className="text-xs text-gray-400">{item.label}</span>
                                    <span className="text-sm font-bold text-gold-500">{item.irunica}</span>
                                </div>
                            ))}
                        </div>
                        <p className="mt-8 text-[11px] text-gray-500 leading-relaxed">
                            {t.footnote}
                        </p>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
