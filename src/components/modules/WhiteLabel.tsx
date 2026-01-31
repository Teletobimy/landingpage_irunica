'use client';
import { motion } from 'framer-motion';
import { SupportedLanguage } from '@/config/tld-language';
import { getTranslations } from '@/locales/translations';

interface Props {
    lang?: SupportedLanguage;
}

export default function WhiteLabel({ lang = 'en' }: Props) {
    const t = getTranslations(lang).whiteLabel;

    const WHITE_LABEL_FEATURES = [
        { title: t.feature1Title, description: t.feature1Desc, icon: '🏷️' },
        { title: t.feature2Title, description: t.feature2Desc, icon: '📦' },
        { title: t.feature3Title, description: t.feature3Desc, icon: '✨' },
        { title: t.feature4Title, description: t.feature4Desc, icon: '⚡' },
    ];

    const AMENITY_SETS = [
        { name: t.essentialSet, items: t.essentialItems, rooms: '50-100' },
        { name: t.premiumSet, items: t.premiumItems, rooms: '100-300' },
        { name: t.luxurySet, items: t.luxuryItems, rooms: '300+' },
    ];

    return (
        <section className="py-20 bg-white text-black px-6">
            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-12">
                    <span className="text-[10px] text-neutral-400 font-mono tracking-widest uppercase">White Label Solutions</span>
                    <h3 className="text-3xl font-light mt-4">{t.title} <span className="font-bold">{t.titleBold}</span></h3>
                    <p className="text-neutral-500 mt-4 max-w-2xl mx-auto">
                        {t.subtitle}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                    {WHITE_LABEL_FEATURES.map((feature, index) => (
                        <motion.div
                            key={feature.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="p-6 bg-neutral-50 rounded-xl border border-neutral-100"
                        >
                            <div className="text-3xl mb-3">{feature.icon}</div>
                            <h4 className="text-lg font-bold text-neutral-900 mb-2">{feature.title}</h4>
                            <p className="text-sm text-neutral-600">{feature.description}</p>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    viewport={{ once: true }}
                    className="bg-neutral-950 text-white p-8 rounded-2xl"
                >
                    <h4 className="text-xl font-bold mb-6 text-center">{t.amenitySets}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {AMENITY_SETS.map((set, index) => (
                            <div
                                key={set.name}
                                className={`p-5 rounded-xl border ${
                                    index === 1
                                        ? 'bg-gold-500/10 border-gold-500/30'
                                        : 'bg-neutral-900 border-white/5'
                                }`}
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <h5 className="font-bold">{set.name}</h5>
                                    {index === 1 && (
                                        <span className="text-[9px] px-2 py-0.5 bg-gold-500 text-black rounded-full font-bold">
                                            {t.popular}
                                        </span>
                                    )}
                                </div>
                                <p className="text-xs text-neutral-400 mb-3">{set.items}</p>
                                <p className="text-[10px] text-neutral-500">
                                    {t.idealFor} <span className="text-gold-500">{set.rooms} {t.rooms}</span>
                                </p>
                            </div>
                        ))}
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    viewport={{ once: true }}
                    className="mt-8 text-center"
                >
                    <p className="text-sm text-neutral-500">
                        {t.trusted}
                        <span className="text-black font-medium ml-1">{t.schedule}</span>
                    </p>
                </motion.div>
            </div>
        </section>
    );
}
