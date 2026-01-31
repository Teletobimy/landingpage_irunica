'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SupportedLanguage } from '@/config/tld-language';
import { getTranslations } from '@/locales/translations';
import CherryBlossom from './effects/CherryBlossom';
import Image from 'next/image';

interface CinematicIntroProps {
    isContentReady?: boolean;
    minDuration?: number; // Minimum display time in ms
    lang?: SupportedLanguage;
    onDismiss?: () => void;
}

export default function CinematicIntro({
    isContentReady = false,
    minDuration = 3000,
    lang = 'en',
    onDismiss
}: CinematicIntroProps) {
    const t = getTranslations(lang).loading;

    const STEPS = [
        { label: t.step1Label, detail: t.step1Detail },
        { label: t.step2Label, detail: t.step2Detail },
        { label: t.step3Label, detail: t.step3Detail },
        { label: t.step4Label, detail: t.step4Detail },
    ];

    // Phase 1: Logo GIF (3.5s) → Phase 2: Step text animation
    const [phase, setPhase] = useState<1 | 2>(1);
    const [currentStep, setCurrentStep] = useState(0);
    const [minTimeElapsed, setMinTimeElapsed] = useState(false);

    // Phase 1 → Phase 2 transition after 3.5 seconds
    useEffect(() => {
        const phaseTimer = setTimeout(() => {
            setPhase(2);
        }, 3500);
        return () => clearTimeout(phaseTimer);
    }, []);

    // Step progression timer (only in Phase 2)
    useEffect(() => {
        if (phase !== 2) return;

        const stepTimer = setInterval(() => {
            setCurrentStep((prev) => {
                if (prev < STEPS.length - 1) return prev + 1;
                return prev;
            });
        }, 550);

        return () => clearInterval(stepTimer);
    }, [phase]);

    // Minimum duration timer (starts from Phase 2)
    useEffect(() => {
        if (phase !== 2) return;

        const timer = setTimeout(() => setMinTimeElapsed(true), minDuration);
        return () => clearTimeout(timer);
    }, [phase, minDuration]);

    // Fallback: Auto-dismiss after max duration
    useEffect(() => {
        if (phase !== 2) return;

        const maxDuration = STEPS.length * 550 + 1000;
        const fallbackTimer = setTimeout(() => {
            onDismiss?.();
        }, maxDuration);
        return () => clearTimeout(fallbackTimer);
    }, [phase, onDismiss]);

    // Dismiss when minimum time elapsed AND content is ready
    useEffect(() => {
        if (minTimeElapsed && isContentReady) {
            onDismiss?.();
        }
    }, [minTimeElapsed, isContentReady, onDismiss]);

    return (
        <motion.div
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="fixed inset-0 bg-neutral-900 flex flex-col items-center justify-center z-[9999] overflow-hidden"
        >
            <CherryBlossom />

            {/* Dark Hanji Overlay for Texture */}
            <div className="absolute inset-0 bg-hanji opacity-10 pointer-events-none mix-blend-overlay" />

            {/* Night Aura Effect (Deep Purple/Navy/Gold) */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 5, 0],
                        opacity: [0.2, 0.4, 0.2]
                    }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -top-[15%] -left-[10%] w-[130%] h-[130%] bg-[radial-gradient(circle_at_center,_#4B0082_0%,_transparent_60%)]"
                />
            </div>

            <AnimatePresence mode="wait">
                {/* Phase 1: Logo GIF Animation */}
                {phase === 1 && (
                    <motion.div
                        key="phase1"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.05 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="relative z-10 flex items-center justify-center"
                    >
                        <Image
                            src="/logo-animation.gif"
                            alt="Irunica"
                            width={600}
                            height={338}
                            priority
                            unoptimized
                            className="w-[70vw] max-w-[600px] h-auto"
                        />
                    </motion.div>
                )}

                {/* Phase 2: Step Text Animation */}
                {phase === 2 && (
                    <motion.div
                        key="phase2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="relative z-10 w-full max-w-lg px-10 text-center"
                    >
                        {/* Brand Logo Text */}
                        <div className="mb-16">
                            <span className="text-[10px] tracking-[0.8em] text-gold-500 font-bold uppercase block mb-3">
                                Irunica Intelligence
                            </span>
                            <div className="w-[1px] h-10 bg-gradient-to-b from-transparent via-gold-400 to-transparent mx-auto" />
                        </div>

                        {/* Step Text Interaction */}
                        <div className="space-y-4 mb-12 min-h-[140px]">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentStep}
                                    initial={{ opacity: 0, filter: "blur(10px)", y: 10 }}
                                    animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                                    exit={{ opacity: 0, filter: "blur(5px)", y: -10 }}
                                    transition={{ duration: 0.15, ease: "easeOut" }}
                                >
                                    <div className="flex items-center justify-center gap-2 mb-6 opacity-90">
                                        <span className="w-1.5 h-1.5 bg-gold-400 rounded-full" />
                                        <span className="text-[10px] font-medium text-gold-300 tracking-[0.2em] uppercase">
                                            Step 0{currentStep + 1}
                                        </span>
                                    </div>
                                    <h2 className="text-4xl font-light text-white tracking-tighter mb-4 leading-tight drop-shadow-lg">
                                        {STEPS[currentStep].label}
                                    </h2>
                                    <p className="text-sm text-neutral-300 font-medium max-w-xs mx-auto leading-relaxed">
                                        {STEPS[currentStep].detail}
                                    </p>
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
