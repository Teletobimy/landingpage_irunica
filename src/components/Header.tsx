'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { motion } from 'framer-motion';

export default function Header() {
    const { language, setLanguage, t } = useLanguage();

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

            {/* Language Selector */}
            <div className="flex items-center gap-1 border border-white/10 rounded-full p-1 bg-black/40 backdrop-blur-md">
                <button
                    onClick={() => setLanguage('en')}
                    className={`px-3 py-1 text-xs font-medium rounded-full transition-all duration-300 ${language === 'en'
                            ? 'bg-gold-500 text-black shadow-[0_0_10px_rgba(212,175,55,0.4)]'
                            : 'text-white/50 hover:text-white'
                        }`}
                >
                    EN
                </button>
                <button
                    onClick={() => setLanguage('ko')}
                    className={`px-3 py-1 text-xs font-medium rounded-full transition-all duration-300 ${language === 'ko'
                            ? 'bg-gold-500 text-black shadow-[0_0_10px_rgba(212,175,55,0.4)]'
                            : 'text-white/50 hover:text-white'
                        }`}
                >
                    KR
                </button>
            </div>
        </motion.header>
    );
}
