'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SupportedLanguage } from '@/config/tld-language';
import { getTranslations } from '@/locales/translations';

interface Props {
    companyName: string;
    generatedImages: any;
    lang?: SupportedLanguage;
}

export default function LeadCaptureFlow({ companyName, generatedImages, lang = 'en' }: Props) {
    const t = getTranslations(lang).leadCapture;
    const [step, setStep] = useState(1); // 1: Email, 2: Details, 3: Success
    const [email, setEmail] = useState('');
    const [details, setDetails] = useState({ name: '', phone: '', message: '' });

    // 1. Step 1: Submit Email (Send visual assets)
    const handleStep1 = () => {
        if (!email || !email.includes('@')) {
            alert('Please enter a valid business email.');
            return;
        }

        // Call Backend (Fire & Forget - No await to ensure speed)
        fetch('/api/send-proposal', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email,
                companyName,
                imageUrls: generatedImages?.map((img: any) => img.url) || [],
                step: 1
            }),
        });

        // Immediate Transition
        setStep(2);
    };

    // 2. Step 2: Submit Details
    const handleStep2 = (e: React.FormEvent) => {
        e.preventDefault();

        // Update Lead Info
        fetch('/api/send-proposal', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email, // Link to previous email
                ...details,
                companyName,
                step: 2
            }),
        });

        setStep(3); // Show Success
    };

    return (
        <section className="py-24 bg-neutral-900 text-white px-6 border-t border-white/10" id="contact">
            <div className="max-w-md mx-auto">
                <AnimatePresence mode="wait">

                    {/* STEP 1: Email Capture */}
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            <h2 className="text-2xl font-bold mb-4 text-center">{t.title}</h2>
                            <p className="text-gray-400 text-center text-sm mb-8">
                                {t.subtitle.replace('the visual package.', '')} <span className="text-gold-500">{companyName}</span>
                            </p>
                            <div className="flex flex-col gap-3">
                                <input
                                    type="email" required placeholder={t.emailPlaceholder}
                                    className="w-full bg-black border border-white/10 px-6 py-4 rounded-xl outline-none focus:border-gold-500 transition-colors"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleStep1()}
                                />
                                <button
                                    onClick={handleStep1}
                                    className="w-full bg-gold-500 hover:bg-gold-400 text-black font-black py-4 rounded-xl uppercase tracking-widest transition-colors shadow-lg shadow-gold-900/20"
                                >
                                    {t.downloadButton}
                                </button>
                            </div>
                            <p className="text-center text-[10px] text-neutral-600 mt-4">
                                {t.disclaimer}
                            </p>
                        </motion.div>
                    )}

                    {/* STEP 2: Lead Details */}
                    {step === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                        >
                            <h2 className="text-xl font-bold mb-2 text-gold-500">{t.assetsSent} ✓</h2>
                            <p className="text-gray-400 text-sm mb-8">
                                {t.assetsSentDesc}
                            </p>
                            <form onSubmit={handleStep2} className="space-y-3">
                                <input
                                    type="text" required placeholder={t.namePlaceholder}
                                    className="w-full bg-black border border-white/10 px-6 py-4 rounded-xl text-sm outline-none focus:border-white/30"
                                    onChange={(e) => setDetails({ ...details, name: e.target.value })}
                                />
                                <input
                                    type="tel" required placeholder={t.phonePlaceholder}
                                    className="w-full bg-black border border-white/10 px-6 py-4 rounded-xl text-sm outline-none focus:border-white/30"
                                    onChange={(e) => setDetails({ ...details, phone: e.target.value })}
                                />
                                <textarea
                                    placeholder={t.messagePlaceholder}
                                    className="w-full bg-black border border-white/10 px-6 py-4 rounded-xl text-sm h-24 resize-none outline-none focus:border-white/30"
                                    onChange={(e) => setDetails({ ...details, message: e.target.value })}
                                />
                                <button className="w-full bg-white hover:bg-gray-200 text-black font-bold py-4 rounded-xl uppercase text-xs tracking-widest transition-colors">
                                    {t.completeButton}
                                </button>
                            </form>
                        </motion.div>
                    )}

                    {/* STEP 3: Success */}
                    {step === 3 && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center py-10"
                        >
                            <div className="w-20 h-20 bg-gold-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                <div className="text-gold-500 text-4xl">✓</div>
                            </div>
                            <h2 className="text-2xl font-bold mb-2">{t.successTitle}</h2>
                            <p className="text-gray-400 text-sm max-w-xs mx-auto">
                                {t.successDesc}
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </section>
    );
}
