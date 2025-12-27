'use client';
import { motion } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';

interface AnalysisSectionProps {
    companyName: string;
    analysisData: {
        headline: string;
        description: string;
    };
}

export default function AnalysisSection({ companyName, analysisData }: AnalysisSectionProps) {
    return (
        <section className="min-h-[60vh] bg-black text-white p-10 flex flex-col justify-center border-b border-white/10">
            <div className="max-w-4xl mx-auto w-full space-y-12">

                {/* Module 1: AI Analysis Status */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {['Brand Match', 'Global Trend', 'Formula Opt', 'Market Fit'].map((label, i) => (
                        <motion.div
                            key={label}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: i * 0.5 }}
                            className="bg-neutral-900 p-4 rounded-lg border border-white/5"
                        >
                            <p className="text-[10px] text-gray-500 uppercase tracking-tighter">{label}</p>
                            <p className="text-xl font-bold text-gold-400">98.{i} %</p>
                        </motion.div>
                    ))}
                </div>

                {/* Module 2: Typing Manifesto */}
                <div className="space-y-4">
                    <h2 className="text-3xl md:text-5xl font-thin leading-tight">
                        {companyName} & IRUNICA <br />
                        <span className="text-gold-500 font-bold italic">Rendering New Future.</span>
                    </h2>

                    <div className="text-gray-400 text-lg md:text-xl font-light leading-relaxed min-h-[100px]">
                        {/* Render typing animation only if description is present */}
                        {analysisData.description && (
                            <TypeAnimation
                                sequence={[
                                    analysisData.description,
                                    1000,
                                ]}
                                speed={50}
                                cursor={true}
                                repeat={0}
                            />
                        )}
                    </div>
                </div>

                {/* Bottom Arrow */}
                <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="flex justify-center pt-10"
                >
                    <span className="text-[10px] tracking-[0.5em] text-gray-600">SCROLL TO VIEW VISUALS</span>
                </motion.div>
            </div>
        </section>
    );
}
