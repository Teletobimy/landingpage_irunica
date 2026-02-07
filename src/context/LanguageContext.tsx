'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { SupportedLanguage } from '@/config/tld-language';

interface LanguageContextProps {
    language: SupportedLanguage;
    setLanguage: (lang: SupportedLanguage) => void;
    t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

const TRANSLATIONS: Record<SupportedLanguage, Record<string, string>> = {
    en: {
        'header.logo': 'IRUNICA',
        'header.contact': 'Contact',
    },
    ko: {
        'header.logo': 'IRUNICA',
        'header.contact': '문의하기',
    },
    ja: {
        'header.logo': 'IRUNICA',
        'header.contact': 'お問い合わせ',
    },
    es: {
        'header.logo': 'IRUNICA',
        'header.contact': 'Contacto',
    },
    zh: {
        'header.logo': 'IRUNICA',
        'header.contact': '联系我们',
    },
    pt: {
        'header.logo': 'IRUNICA',
        'header.contact': 'Contato',
    },
    de: {
        'header.logo': 'IRUNICA',
        'header.contact': 'Kontakt',
    },
    fr: {
        'header.logo': 'IRUNICA',
        'header.contact': 'Contact',
    },
    it: {
        'header.logo': 'IRUNICA',
        'header.contact': 'Contatto',
    },
};

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [language, setLanguage] = useState<SupportedLanguage>('en');

    const t = (key: string) => {
        return TRANSLATIONS[language]?.[key] || TRANSLATIONS.en[key] || key;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}
