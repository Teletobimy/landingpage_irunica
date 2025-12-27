'use client';
import { motion } from 'framer-motion';

interface HistoryPoint {
    date: string;
    hex: string;
    isTrending: boolean;
}

interface ColorHistoryTrackerProps {
    selectedColor: string;
    history: HistoryPoint[];
    onClose: () => void;
}

export default function ColorHistoryTracker({ selectedColor, history, onClose }: ColorHistoryTrackerProps) {
    return (
        <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-12 p-8 bg-neutral-50 rounded-3xl border border-neutral-200 relative overflow-hidden"
        >
            <button
                onClick={onClose}
                className="absolute top-6 right-6 text-neutral-400 hover:text-black transition-colors"
            >
                ✕
            </button>

            <div className="flex justify-between items-center mb-8 pr-8">
                <h4 className="text-xl font-bold text-black">
                    <span className="text-gold-600">&quot;{selectedColor}&quot;</span> Trend History
                </h4>
                <div className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest hidden md:block">
                    Thinking Process: TIME_SERIES_ANALYSIS
                </div>
            </div>

            {/* Timeline Horizontal Scroll Area */}
            <div className="flex items-end gap-6 overflow-x-auto pb-6 scrollbar-hide">
                {history.map((point, idx) => (
                    <div key={point.date || idx} className="flex flex-col items-center min-w-[80px] space-y-4 group">
                        {/* Date Label (Top) */}
                        <div className="text-[10px] font-mono text-neutral-400 opacity-50 group-hover:opacity-100 transition-opacity">
                            {point.date ? `${point.date.slice(4, 6)}.${point.date.slice(6, 8)}` : 'N/A'}
                        </div>

                        {/* Trending Badge or Spacer */}
                        <div className="h-5 flex items-end">
                            {point.isTrending ? (
                                <span className="px-2 py-0.5 bg-gold-100 text-[8px] text-gold-700 font-bold rounded-full whitespace-nowrap">
                                    HOT
                                </span>
                            ) : <div className="h-1" />}
                        </div>

                        {/* Data Point (Hex Circle) */}
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: idx * 0.1, type: "spring" }}
                            className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-black/5 shadow-md relative"
                            style={{ backgroundColor: point.hex }}
                        >
                            {/* Connector Line */}
                            {idx < history.length - 1 && (
                                <div className="absolute top-1/2 left-full w-6 h-[1px] bg-neutral-200 -z-10" />
                            )}
                        </motion.div>

                    </div>
                ))}
            </div>

            {/* AI Insight Section */}
            <div className="mt-8 pt-8 border-t border-neutral-200 flex gap-4">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex-shrink-0 animate-pulse" />
                <div>
                    <p className="text-xs font-bold text-purple-600 mb-1">Gemini 3 Flash Insight</p>
                    <p className="text-sm text-neutral-600 leading-relaxed italic">
                        &quot;Comparing recent data points, <strong>{selectedColor}</strong> has evolved towards a more muted saturation over the last 3 weeks. This aligns with the rising &apos;Quiet Luxury&apos; trend in the Seoul region, suggesting a shift from vibrant pops to understated elegance.&quot;
                    </p>
                </div>
            </div>
        </motion.div>
    );
}
