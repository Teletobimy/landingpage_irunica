'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SupportedLanguage } from '@/config/tld-language';
import { getTranslations } from '@/locales/translations';

interface Props {
    companyName: string;
    lang?: SupportedLanguage;
}

export default function ProtocolMatcher({ companyName, lang = 'en' }: Props) {
    const t = getTranslations(lang).protocolMatcher;

    const PROTOCOLS = [
        { id: 'laser', title: t.laser, match: t.laserMatch, benefit: t.laserBenefit },
        { id: 'peeling', title: t.peeling, match: t.peelingMatch, benefit: t.peelingBenefit },
        { id: 'filler', title: t.filler, match: t.fillerMatch, benefit: t.fillerBenefit },
    ];

    const [selected, setSelected] = useState(PROTOCOLS[0]);

    return (
        <section className="py-20 bg-neutral-950 text-white px-6">
            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div>
                    <h3 className="text-2xl font-light mb-8 italic">{t.title} <br /><span className="font-bold text-white not-italic">{t.titleBold}</span></h3>
                    <div className="space-y-4">
                        {PROTOCOLS.map((p) => (
                            <button
                                key={p.id}
                                onClick={() => setSelected(p)}
                                className={`w-full text-left p-4 rounded-xl transition-all border ${selected.id === p.id ? 'bg-white text-black border-white' : 'bg-transparent border-white/10 text-gray-500'}`}
                            >
                                {p.title}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="relative aspect-square bg-neutral-900 rounded-3xl p-8 flex flex-col justify-center border border-white/5">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={selected.id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-4"
                        >
                            <span className="text-[10px] text-gold-500 font-mono tracking-widest uppercase">{t.matchingFormula}</span>
                            <h4 className="text-xl font-bold">{selected.match}</h4>
                            <p className="text-sm text-gray-400">{selected.benefit}</p>
                            <div className="pt-6 mt-6 border-t border-white/10">
                                <p className="text-[10px] text-gray-600 uppercase">{t.suggestedLabeling}</p>
                                <p className="text-sm italic font-serif text-white/80">&quot;{t.exclusiveAfterCare} {companyName}&quot;</p>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </section>
    );
}
