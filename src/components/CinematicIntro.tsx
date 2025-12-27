'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const STEPS = [
    { label: "THE INVITATION", detail: "We invite you to a journey beyond the ordinary..." },
    { label: "ESSENCE DISCOVERY", detail: "Uncovering the hidden potential within your brand..." },
    { label: "PURE ALCHEMY", detail: "Fusing your unique identity with our innovation..." },
    { label: "THE REVELATION", detail: "Preparing to unveil the future of your product..." },
];

export default function CinematicIntro() {
    const [currentStep, setCurrentStep] = useState(0);
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        // Step timer: 2.5s per step
        const stepTimer = setInterval(() => {
            setCurrentStep((prev) => {
                if (prev < STEPS.length - 1) return prev + 1;
                return prev;
            });
        }, 2200);

        // Total duration: Steps * Time + buffer
        const totalDuration = STEPS.length * 2200 + 1000;
        const dismissTimer = setTimeout(() => {
            setIsVisible(false);
        }, totalDuration);

        return () => {
            clearInterval(stepTimer);
            clearTimeout(dismissTimer);
        };
    }, []);

    if (!isVisible) return null;

    return (
        <motion.div
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="fixed inset-0 bg-black flex flex-col items-center justify-center z-[9999] overflow-hidden"
        >
            {/* 1. CSS Aura Effect */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 90, 180, 270, 360],
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-[20%] -left-[20%] w-[140%] h-[140%] bg-[radial-gradient(circle_at_center,_rgba(212,175,55,0.15)_0%,_transparent_50%)]"
                />
            </div>

            <div className="relative z-10 w-full max-w-lg px-10 text-center">
                {/* 2. Top Brand Logo (Force Visible) */}
                <div className="mb-20">
                    <span className="text-[10px] tracking-[0.8em] text-gold-500 font-bold uppercase block">Irunica Intelligence</span>
                </div>

                {/* 3. Main Text Interaction */}
                <div className="space-y-4 mb-12 min-h-[100px]">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentStep}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.5 }}
                        >
                            <div className="flex items-center justify-center gap-3 mb-4">
                                <span className="w-1.5 h-1.5 bg-gold-500 rounded-full animate-pulse" />
                                <span className="text-[10px] font-mono text-gold-500 tracking-widest uppercase">
                                    Step 0{currentStep + 1}
                                </span>
                            </div>
                            <h2 className="text-3xl font-light text-white tracking-tighter mb-2">
                                {STEPS[currentStep].label}
                            </h2>
                            <p className="text-sm text-neutral-400 font-mono italic">
                                {STEPS[currentStep].detail}
                            </p>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* 4. Progress Bar (Removed) */}

            </div>
        </motion.div>
    );
}
