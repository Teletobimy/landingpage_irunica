'use client';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { SupportedLanguage } from '@/config/tld-language';
import { getTranslations } from '@/locales/translations';
import { getColorFamilyTranslation, extractColorName } from '@/config/trend-translations';

interface TrendCategory {
    trending_colors: string[];
    color_codes: Record<string, string>;
    color_families: Record<string, string[]>;
    summary: string;
}

interface TrendData {
    '메이크업'?: TrendCategory;
    '립메이크업'?: TrendCategory;
    '아이메이크업'?: TrendCategory;
    '베이스메이크업'?: TrendCategory;
}

interface Props {
    trendData?: TrendData;
    updatedAt?: string;
    lang?: SupportedLanguage;
}

// Category display order and labels
const CATEGORY_ORDER = [
    { key: '메이크업', label: 'Total Makeup', labelKo: '종합 메이크업', icon: '✦' },
    { key: '립메이크업', label: 'Lip', labelKo: '립', icon: '💋' },
    { key: '아이메이크업', label: 'Eye', labelKo: '아이', icon: '👁' },
    { key: '베이스메이크업', label: 'Base', labelKo: '베이스', icon: '✨' },
] as const;

export default function TrendAnalysis({ trendData, updatedAt, lang = 'en' }: Props) {
    const t = getTranslations(lang).trendAnalysis;
    const [expandedCategory, setExpandedCategory] = useState<string | null>('메이크업');
    const [translatedSummaries, setTranslatedSummaries] = useState<Record<string, string>>({});
    const [translatingCategory, setTranslatingCategory] = useState<string | null>(null);

    // Format date
    const formatDate = (dateStr?: string) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
    };

    // Translate summary on demand
    const translateSummary = async (categoryKey: string, originalText: string) => {
        if (translatedSummaries[categoryKey] || lang === 'ko') return;

        setTranslatingCategory(categoryKey);
        try {
            const response = await fetch('/api/translate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: originalText, targetLang: lang })
            });

            if (response.ok) {
                const { translatedText } = await response.json();
                setTranslatedSummaries(prev => ({ ...prev, [categoryKey]: translatedText }));
            }
        } catch (error) {
            console.error('Translation failed:', error);
        } finally {
            setTranslatingCategory(null);
        }
    };

    // Fallback if no data
    if (!trendData) {
        return (
            <section className="py-20 bg-neutral-50 px-6">
                <div className="max-w-5xl mx-auto text-center text-neutral-400">
                    Trend data currently unavailable.
                </div>
            </section>
        );
    }

    return (
        <section className="py-24 bg-gradient-to-b from-white to-neutral-50 px-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 mb-4">
                        <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                        <span className="text-[10px] font-mono text-neutral-500 tracking-widest uppercase">
                            Live from Olive Young Rankings
                        </span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-light tracking-tight mb-4">
                        K-Beauty <span className="font-bold">Trend Radar</span>
                    </h2>
                    {updatedAt && (
                        <p className="text-sm text-neutral-400 font-mono">
                            Data Updated: <span className="text-black font-medium">{formatDate(updatedAt)}</span>
                        </p>
                    )}
                </div>

                {/* Category Tabs */}
                <div className="flex flex-wrap justify-center gap-2 mb-12">
                    {CATEGORY_ORDER.map(({ key, label, labelKo }) => {
                        const category = trendData[key as keyof TrendData];
                        if (!category) return null;

                        return (
                            <button
                                key={key}
                                onClick={() => setExpandedCategory(expandedCategory === key ? null : key)}
                                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                                    expandedCategory === key
                                        ? 'bg-black text-white shadow-lg'
                                        : 'bg-white text-neutral-600 border border-neutral-200 hover:border-neutral-400'
                                }`}
                            >
                                {lang === 'ko' ? labelKo : label}
                            </button>
                        );
                    })}
                </div>

                {/* Category Content */}
                {CATEGORY_ORDER.map(({ key, label, labelKo, icon }) => {
                    const category = trendData[key as keyof TrendData];
                    if (!category || expandedCategory !== key) return null;

                    const displaySummary = translatedSummaries[key] || category.summary;
                    const isTranslated = !!translatedSummaries[key];
                    const isTranslating = translatingCategory === key;
                    const showTranslateButton = lang !== 'ko' && !isTranslated;

                    return (
                        <motion.div
                            key={key}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4 }}
                            className="bg-white rounded-3xl border border-neutral-100 shadow-sm overflow-hidden"
                        >
                            {/* Category Header */}
                            <div className="p-8 border-b border-neutral-100 bg-gradient-to-r from-neutral-50 to-white">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <span className="text-2xl">{icon}</span>
                                        <h3 className="text-2xl font-bold">{lang === 'ko' ? labelKo : label}</h3>
                                    </div>
                                    {/* Translate Button */}
                                    {showTranslateButton && (
                                        <button
                                            onClick={() => translateSummary(key, category.summary)}
                                            disabled={isTranslating}
                                            className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-neutral-500 bg-neutral-100 hover:bg-neutral-200 rounded-full transition-colors disabled:opacity-50"
                                        >
                                            {isTranslating ? (
                                                <>
                                                    <span className="w-3 h-3 border border-neutral-400 border-t-transparent rounded-full animate-spin" />
                                                    Translating...
                                                </>
                                            ) : (
                                                <>
                                                    <span>🌐</span>
                                                    Translate
                                                </>
                                            )}
                                        </button>
                                    )}
                                    {isTranslated && (
                                        <span className="text-[10px] text-neutral-400 flex items-center gap-1">
                                            <span>🌐</span> Translated by AI
                                        </span>
                                    )}
                                </div>
                                <p className="text-neutral-600 leading-relaxed max-w-3xl">
                                    {displaySummary}
                                </p>
                            </div>

                            {/* Trending Colors */}
                            <div className="p-8">
                                <h4 className="text-xs font-bold tracking-widest text-neutral-400 uppercase mb-6">
                                    {lang === 'ko' ? '트렌드 컬러' : 'Trending Colors'}
                                </h4>
                                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                    {category.trending_colors.map((colorName, idx) => {
                                        const hex = category.color_codes[colorName];
                                        const displayName = extractColorName(colorName, lang);

                                        return (
                                            <motion.div
                                                key={colorName}
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ delay: idx * 0.1 }}
                                                className="group"
                                            >
                                                <div
                                                    className="aspect-square rounded-2xl mb-3 shadow-inner border border-black/5 group-hover:scale-105 transition-transform cursor-pointer relative overflow-hidden"
                                                    style={{ backgroundColor: hex || '#ccc' }}
                                                >
                                                    {/* Rank Badge */}
                                                    <div className="absolute top-2 left-2 w-6 h-6 bg-white/90 backdrop-blur rounded-full flex items-center justify-center text-xs font-bold text-neutral-700">
                                                        {idx + 1}
                                                    </div>
                                                </div>
                                                <p className="text-xs font-medium text-center text-neutral-700 leading-tight">
                                                    {displayName}
                                                </p>
                                                <p className="text-[10px] font-mono text-center text-neutral-400 mt-1">
                                                    {hex}
                                                </p>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Color Families */}
                            <div className="p-8 bg-neutral-50/50 border-t border-neutral-100">
                                <h4 className="text-xs font-bold tracking-widest text-neutral-400 uppercase mb-6">
                                    {lang === 'ko' ? '컬러 패밀리' : 'Color Families'}
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {Object.entries(category.color_families).map(([familyName, colors]) => (
                                        <div
                                            key={familyName}
                                            className="bg-white rounded-xl p-4 border border-neutral-100"
                                        >
                                            <h5 className="text-sm font-bold text-neutral-800 mb-2">
                                                {getColorFamilyTranslation(familyName, lang)}
                                            </h5>
                                            <div className="flex flex-wrap gap-1">
                                                {colors.slice(0, 6).map((color) => (
                                                    <span
                                                        key={color}
                                                        className="text-[10px] px-2 py-0.5 bg-neutral-100 text-neutral-600 rounded-full"
                                                    >
                                                        {color}
                                                    </span>
                                                ))}
                                                {colors.length > 6 && (
                                                    <span className="text-[10px] px-2 py-0.5 text-neutral-400">
                                                        +{colors.length - 6}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    );
                })}

                {/* Quick Overview (All Categories Mini View) */}
                <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
                    {CATEGORY_ORDER.map(({ key, label, labelKo }) => {
                        const category = trendData[key as keyof TrendData];
                        if (!category) return null;

                        const topColor = category.trending_colors[0];
                        const topHex = category.color_codes[topColor];
                        const topColorDisplay = extractColorName(topColor, lang);

                        return (
                            <motion.div
                                key={key}
                                whileHover={{ y: -4 }}
                                onClick={() => setExpandedCategory(key)}
                                className={`p-4 rounded-2xl cursor-pointer transition-all ${
                                    expandedCategory === key
                                        ? 'bg-black text-white'
                                        : 'bg-white border border-neutral-200 hover:border-neutral-400'
                                }`}
                            >
                                <div className="flex items-center gap-3 mb-3">
                                    <div
                                        className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
                                        style={{ backgroundColor: topHex }}
                                    />
                                    <span className={`text-xs font-bold ${expandedCategory === key ? 'text-white' : 'text-neutral-800'}`}>
                                        {lang === 'ko' ? labelKo : label}
                                    </span>
                                </div>
                                <p className={`text-[10px] leading-relaxed line-clamp-2 ${
                                    expandedCategory === key ? 'text-neutral-300' : 'text-neutral-500'
                                }`}>
                                    #{topColorDisplay}
                                </p>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
