'use client';
import { motion } from 'framer-motion';

const COMPARISON_DATA = [
    { label: 'Minimum Order (MOQ)', traditional: '5,000+ units', irunica: '100+ units', win: 'irunica' },
    { label: 'Time to Market', traditional: '6 ~ 12 Months', irunica: '14 Days', win: 'irunica' },
    { label: 'R&D / Certification', traditional: '$10,000+ (High Risk)', irunica: '$0 (Pre-certified)', win: 'irunica' },
    { label: 'Inventory Risk', traditional: 'Extremely High', irunica: 'Managed by Irunica', win: 'irunica' },
];

export default function RiskFreeScaler() {
    return (
        <section className="py-20 bg-white text-black px-6">
            <div className="max-w-5xl mx-auto">
                <h3 className="text-3xl font-light mb-12 text-center">Your Growth, <span className="font-bold">Zero Risk.</span></h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Traditional Way */}
                    <div className="p-8 bg-neutral-50 rounded-3xl border border-neutral-200 opacity-60">
                        <h4 className="text-sm font-bold uppercase mb-6 text-neutral-400">Traditional OEM/ODM</h4>
                        <div className="space-y-6">
                            {COMPARISON_DATA.map((item) => (
                                <div key={item.label} className="flex justify-between border-b border-neutral-200 pb-2">
                                    <span className="text-xs text-neutral-500">{item.label}</span>
                                    <span className="text-sm font-medium">{item.traditional}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    {/* Irunica Way */}
                    <motion.div
                        whileHover={{ y: -5 }}
                        className="p-8 bg-black text-white rounded-3xl shadow-2xl relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-4 bg-gold-500 text-black text-[10px] font-bold">FAST TRACK</div>
                        <h4 className="text-sm font-bold uppercase mb-6 text-gold-400 font-mono">IRUNICA Private Label</h4>
                        <div className="space-y-6">
                            {COMPARISON_DATA.map((item) => (
                                <div key={item.label} className="flex justify-between border-b border-white/10 pb-2">
                                    <span className="text-xs text-gray-400">{item.label}</span>
                                    <span className="text-sm font-bold text-gold-500">{item.irunica}</span>
                                </div>
                            ))}
                        </div>
                        <p className="mt-8 text-[11px] text-gray-500 leading-relaxed">
                            *We hold pre-certified CPNP/FDA formulas. You simply define the brand equity.
                        </p>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
