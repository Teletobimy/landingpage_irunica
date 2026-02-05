'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SupportedLanguage } from '@/config/tld-language';
import { getTranslations } from '@/locales/translations';

interface Props {
    lang?: SupportedLanguage;
}

export default function ProcessTimeline({ lang = 'en' }: Props) {
    const t = getTranslations(lang).processTimeline;
    const [activeStep, setActiveStep] = useState<number | null>(null);

    const steps = [
        { num: 1, title: t.step1, desc: t.step1Desc, day: t.step1Day },
        { num: 2, title: t.step2, desc: t.step2Desc, day: t.step2Day },
        { num: 3, title: t.step3, desc: t.step3Desc, day: t.step3Day },
        { num: 4, title: t.step4, desc: t.step4Desc, day: t.step4Day },
        { num: 5, title: t.step5, desc: t.step5Desc, day: t.step5Day },
    ];

    return (
        <section className="py-20 bg-neutral-950 text-white px-6 overflow-hidden">
            <div className="max-w-5xl mx-auto">
                <motion.h3
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-3xl font-light mb-16 text-center"
                >
                    {t.title} <span className="font-bold text-gold-500">{t.titleBold}</span>
                </motion.h3>

                {/* Desktop Timeline (Horizontal) */}
                <div className="hidden md:block">
                    <div className="relative">
                        {/* Timeline Line */}
                        <div className="absolute top-8 left-0 right-0 h-0.5 bg-white/10" />
                        <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: '100%' }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.5, ease: 'easeOut' }}
                            className="absolute top-8 left-0 h-0.5 bg-gradient-to-r from-gold-500 to-gold-600"
                        />

                        {/* Steps */}
                        <div className="flex justify-between relative">
                            {steps.map((step, index) => (
                                <motion.div
                                    key={step.num}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className="flex flex-col items-center cursor-pointer group"
                                    onClick={() => setActiveStep(activeStep === index ? null : index)}
                                >
                                    {/* Node */}
                                    <motion.div
                                        whileHover={{ scale: 1.1 }}
                                        className={`w-16 h-16 rounded-full flex items-center justify-center text-lg font-bold transition-all duration-300 ${
                                            activeStep === index
                                                ? 'bg-gold-500 text-black'
                                                : 'bg-neutral-800 text-white border border-white/20 group-hover:border-gold-500'
                                        }`}
                                    >
                                        {step.num}
                                    </motion.div>

                                    {/* Title */}
                                    <div className="mt-4 text-center">
                                        <div className="text-sm font-semibold">{step.title}</div>
                                        <div className="text-xs text-gold-500 mt-1">{step.day}</div>
                                    </div>

                                    {/* Expanded Detail */}
                                    <AnimatePresence>
                                        {activeStep === index && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className="mt-4 p-4 bg-white/5 rounded-xl max-w-[180px] text-center border border-white/10"
                                            >
                                                <p className="text-xs text-gray-400 leading-relaxed">{step.desc}</p>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Mobile Timeline (Vertical) */}
                <div className="md:hidden">
                    <div className="relative pl-8">
                        {/* Timeline Line */}
                        <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-white/10" />
                        <motion.div
                            initial={{ height: 0 }}
                            whileInView={{ height: '100%' }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.5, ease: 'easeOut' }}
                            className="absolute left-3 top-0 w-0.5 bg-gradient-to-b from-gold-500 to-gold-600"
                        />

                        {/* Steps */}
                        <div className="space-y-8">
                            {steps.map((step, index) => (
                                <motion.div
                                    key={step.num}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className="relative"
                                    onClick={() => setActiveStep(activeStep === index ? null : index)}
                                >
                                    {/* Node */}
                                    <div
                                        className={`absolute -left-8 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                                            activeStep === index
                                                ? 'bg-gold-500 text-black'
                                                : 'bg-neutral-800 text-white border border-white/20'
                                        }`}
                                    >
                                        {step.num}
                                    </div>

                                    {/* Content */}
                                    <div className="ml-4">
                                        <div className="flex items-center gap-3">
                                            <span className="text-sm font-semibold">{step.title}</span>
                                            <span className="text-xs text-gold-500">{step.day}</span>
                                        </div>

                                        <AnimatePresence>
                                            {activeStep === index && (
                                                <motion.p
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: 'auto' }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    className="text-xs text-gray-400 leading-relaxed mt-2"
                                                >
                                                    {step.desc}
                                                </motion.p>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
