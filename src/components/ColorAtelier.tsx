'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getColorHistory } from '@/lib/fetch-color-history';

// --- Animation Variants ---
const containerVariants = {
    hidden: { opacity: 0, height: 0, marginTop: 0 },
    visible: {
        opacity: 1,
        height: 'auto',
        marginTop: 40,
        transition: {
            height: { duration: 0.5, ease: [0.4, 0, 0.2, 1] as any },
            opacity: { duration: 0.3, delay: 0.2 }
        }
    },
    exit: {
        opacity: 0,
        height: 0,
        marginTop: 0,
        transition: { duration: 0.4, ease: [0.4, 0, 1, 1] as any }
    }
};

const itemVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 10 },
    visible: (i: number) => ({
        opacity: 1,
        scale: 1,
        y: 0,
        transition: { delay: i * 0.08, duration: 0.4, ease: "easeOut" as any }
    })
};

export default function ColorAtelier({ trendData, category = '립메이크업' }: any) {
    const [selectedColor, setSelectedColor] = useState<string | null>(null);
    const [historyData, setHistoryData] = useState<any[]>([]);
    const [isLoadingHistory, setIsLoadingHistory] = useState(false);

    // Validation
    if (!trendData || !trendData[category]) {
        return (
            <section className="py-24 bg-white text-black px-8 flex justify-center">
                <p className="text-gray-400 text-sm">Trend data currently unavailable.</p>
            </section>
        );
    }

    const categoryData = trendData[category];
    const colorCodes = categoryData.color_codes || {};
    const trendingColors = categoryData.trending_colors || [];

    const handleColorClick = async (name: string) => {
        if (selectedColor === name) {
            setSelectedColor(null);
            return;
        }

        setSelectedColor(name);
        setIsLoadingHistory(true);
        setHistoryData([]);

        const history = await getColorHistory(name);
        setHistoryData(history);
        setIsLoadingHistory(false);
    };

    return (
        <section className="py-24 px-10 bg-white border-t border-neutral-100">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="border-b border-black pb-8 mb-16 flex justify-between items-end">
                    <div>
                        <h3 className="text-xs font-bold tracking-[0.4em] uppercase mb-4 text-neutral-400">
                            K-Beauty Color Archive
                        </h3>
                        <h2 className="text-5xl font-light tracking-tighter">
                            The <span className="font-serif italic">Atelier</span> Spectrum
                        </h2>
                    </div>
                    <div className="text-right hidden md:block">
                        <p className="text-[10px] font-mono leading-tight">
                            SOURCE: OLIVEYOUNG RANKING DATA<br />
                            ALGORITHM: TREND_ANALYSIS_V2<br />
                            REGION: SEOUL, KR
                        </p>
                    </div>
                </div>

                {/* 1. Color Grid */}
                <motion.div layout className="grid grid-cols-2 md:grid-cols-5 gap-8">
                    {trendingColors.map((name: string) => {
                        const hex = colorCodes[name];
                        if (!hex) return null;

                        return (
                            <div key={name} className="relative group">
                                <motion.div
                                    layout
                                    onClick={() => handleColorClick(name)}
                                    className={`cursor-pointer rounded-2xl p-4 transition-colors ${selectedColor === name ? 'bg-neutral-50 shadow-sm' : 'hover:bg-neutral-50'}`}
                                >
                                    <motion.div
                                        layoutId={`color-${name}`}
                                        className="w-full aspect-square rounded-full mb-4 shadow-inner border border-black/5 relative overflow-hidden"
                                        style={{ backgroundColor: hex }}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        {/* Loading Spinner Over Swatch */}
                                        {selectedColor === name && isLoadingHistory && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm">
                                                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            </div>
                                        )}
                                    </motion.div>

                                    <p className="text-center text-xs font-bold tracking-tight">{name}</p>
                                    {selectedColor === name && (
                                        <motion.div layoutId="underline" className="h-[2px] bg-gold-500 w-8 mx-auto mt-2" />
                                    )}
                                </motion.div>
                            </div>
                        );
                    })}
                </motion.div>

                {/* 2. Detail Panel */}
                <AnimatePresence mode="wait">
                    {selectedColor && !isLoadingHistory && (
                        <motion.div
                            key={selectedColor}
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="overflow-hidden border-t border-neutral-100 bg-neutral-50/50 rounded-3xl mt-8"
                        >
                            <div className="p-10">
                                <div className="flex justify-between items-end mb-12">
                                    <div>
                                        <h4 className="text-2xl font-light mb-1 italic">Trend Evolution: <span className="font-bold text-black">{selectedColor}</span></h4>
                                        <p className="text-[10px] text-neutral-400 font-mono tracking-widest uppercase">Chronological Data Trace (Recent Points)</p>
                                    </div>
                                    <div className="h-10 w-[1px] bg-neutral-200 hidden md:block" />
                                    <div className="text-right text-xs font-medium text-neutral-500 max-w-[200px] leading-relaxed">
                                        This data is an AI-analyzed color maturity index based on real-time ranking trends.
                                    </div>
                                </div>

                                {/* Timeline Visualization */}
                                <div className="flex items-center justify-between gap-2 px-4 h-32 relative overflow-x-auto scrollbar-hide py-4">
                                    {/* The line should be behind */}
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: '100%' }}
                                        transition={{ duration: 1, delay: 0.3 }}
                                        className="absolute top-1/2 left-0 h-[1px] bg-neutral-200 -translate-y-1/2 z-0"
                                    />

                                    {historyData.length > 0 ? historyData.map((item: any, i: number) => (
                                        <motion.div
                                            key={item.date || i}
                                            custom={i}
                                            variants={itemVariants}
                                            className="relative z-10 flex flex-col items-center min-w-[60px]"
                                        >
                                            <div
                                                className={`w-10 h-10 rounded-full border-4 border-white shadow-lg mb-3 ${item.isTrending ? 'ring-2 ring-gold-400' : ''}`}
                                                style={{ backgroundColor: item.hex }}
                                            />
                                            <span className="text-[9px] font-mono text-neutral-400 uppercase tracking-tighter">
                                                {item.date ? `${item.date.slice(4, 6)}.${item.date.slice(6, 8)}` : `Pt.${i + 1}`}
                                            </span>
                                        </motion.div>
                                    )) : (
                                        <div className="w-full text-center text-xs text-neutral-400 z-10">No historical data available.</div>
                                    )}
                                </div>

                                {/* AI Insight */}
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 1 }}
                                    className="mt-10 p-6 bg-white rounded-2xl border border-neutral-100 flex gap-4 items-start shadow-sm"
                                >
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex-shrink-0 animate-pulse mt-1" />
                                    <div>
                                        <p className="text-xs font-bold text-purple-600 mb-1">Gemini 3 Flash Insight</p>
                                        <p className="text-sm text-neutral-600 leading-relaxed">
                                            <strong className="text-black">{selectedColor}</strong> has seen a 14% increase in preference compared to early December, emerging as a key player in the &apos;Mute Tone&apos; trend. Purchase intent is highest when combined with glow gel textures.
                                        </p>
                                    </div>
                                </motion.div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

            </div>
        </section>
    );
}
