'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { motion } from 'framer-motion';
import { SupportedLanguage } from '@/config/tld-language';

const LANGUAGE_LABELS: Record<SupportedLanguage, string> = {
    en: 'EN',
    ko: 'KR',
    ja: 'JA',
    es: 'ES',
    zh: 'ZH',
    pt: 'PT',
    de: 'DE',
    fr: 'FR',
    it: 'IT',
};

export default function Header() {
    const { language, setLanguage, t } = useLanguage();

    // Show current language + EN toggle (if not already EN)
    const toggleOptions: SupportedLanguage[] = language === 'en'
        ? ['en']
        : ['en', language];

    return (
        <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between bg-gradient-to-b from-black/80 to-transparent backdrop-blur-sm"
        >
            {/* Logo */}
            <div className="flex items-center gap-2 cursor-pointer">
                <span className="text-xl font-bold tracking-widest text-white selection:bg-gold-500 selection:text-black">
                    {t('header.logo')}
                </span>
                <span className="w-1.5 h-1.5 bg-gold-500 rounded-full" />
            </div>

            {/* CTA + Language Selector */}
            <div className="flex items-center gap-3">
                <a href="#contact" className="hidden sm:block px-4 py-2 bg-gold-500 text-black text-xs font-bold rounded-full hover:opacity-90 transition-opacity">
                    Get in Touch
                </a>
                <div className="flex items-center gap-1 border border-white/10 rounded-full p-1 bg-black/40 backdrop-blur-md">
                    {toggleOptions.map((lang) => (
                        <button
                            key={lang}
                            onClick={() => setLanguage(lang)}
                            className={`px-3 py-1 text-xs font-medium rounded-full transition-all duration-300 ${language === lang
                                    ? 'bg-gold-500 text-black shadow-[0_0_10px_rgba(212,175,55,0.4)]'
                                    : 'text-white/50 hover:text-white'
                                }`}
                        >
                            {LANGUAGE_LABELS[lang]}
                        </button>
                    ))}
                </div>
            </div>
        </motion.header>
    );
}
