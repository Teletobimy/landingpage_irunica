'use client';
import { motion } from 'framer-motion';
import { SupportedLanguage } from '@/config/tld-language';
import { getTranslations } from '@/locales/translations';

interface Props {
    lang?: SupportedLanguage;
}

export default function SocialProof({ lang = 'en' }: Props) {
    const t = getTranslations(lang).socialProof;

    const stats = [
        { value: '500+', label: t.brandsLaunched },
        { value: '50+', label: t.countriesServed },
        { value: '98%', label: t.reorderRate },
        { value: '14', label: t.timeToMarket },
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
    };

    return (
        <section className="py-20 bg-neutral-950 text-white px-6">
            <div className="max-w-5xl mx-auto">
                <motion.h3
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-3xl font-light mb-16 text-center"
                >
                    {t.title} <span className="font-bold text-gold-500">{t.titleBold}</span>
                </motion.h3>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16"
                >
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            variants={itemVariants}
                            className="text-center p-6 border border-white/10 rounded-2xl bg-white/5 backdrop-blur-sm"
                        >
                            <div className="text-4xl md:text-5xl font-bold text-gold-500 mb-2">
                                {stat.value}
                            </div>
                            <div className="text-sm text-gray-400 uppercase tracking-wider">
                                {stat.label}
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                    className="flex flex-wrap justify-center items-center gap-8 opacity-50"
                >
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div
                            key={i}
                            className="w-20 h-10 bg-white/10 rounded flex items-center justify-center text-[10px] text-white/30"
                        >
                            LOGO
                        </div>
                    ))}
                </motion.div>

                <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 }}
                    className="text-center text-sm text-gray-500 mt-8"
                >
                    {t.trustedBy}
                </motion.p>
            </div>
        </section>
    );
}
