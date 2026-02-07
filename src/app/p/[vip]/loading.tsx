'use client';

import { motion } from 'framer-motion';
import CherryBlossom from '@/components/effects/CherryBlossom';

export default function Loading() {
    return (
        <div className="fixed inset-0 bg-black z-[10000] overflow-hidden">
            {/* Cherry Blossom Effect */}
            <CherryBlossom />

            {/* Hanji Texture Overlay */}
            <div
                className="absolute inset-0 opacity-5 pointer-events-none"
                style={{
                    backgroundImage: 'url(/assets/textures/hanji-texture.png)',
                    backgroundSize: '400px 400px',
                    backgroundRepeat: 'repeat'
                }}
            />

            {/* Aura Effect */}
            <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-3xl opacity-20"
                style={{
                    background: 'radial-gradient(circle, rgba(255,215,0,0.3) 0%, transparent 70%)'
                }}
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.2, 0.3, 0.2]
                }}
                transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: 'easeInOut'
                }}
            />

            {/* Main Content Container */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                {/* Logo Animation */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    className="mb-12"
                >
                    <img
                        src="/assets/animations/logo-animation.gif"
                        alt="Irunica Logo"
                        className="w-32 h-32 object-contain"
                    />
                </motion.div>

                {/* Rotating Spinner */}
                <motion.div
                    className="relative w-16 h-16 mb-8"
                    animate={{ rotate: 360 }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: 'linear'
                    }}
                >
                    <div className="absolute inset-0 border-4 border-transparent border-t-gold-400 rounded-full" />
                    <div className="absolute inset-2 border-4 border-transparent border-b-gold-500 rounded-full" />
                </motion.div>

                {/* Status Text */}
                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="text-gold-300 text-lg font-light tracking-wider mb-8"
                >
                    Creating your personalized experience...
                </motion.p>

                {/* Progress Bar Container */}
                <div className="w-80 max-w-[90vw]">
                    <motion.div
                        className="h-1 bg-gray-800 rounded-full overflow-hidden"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                    >
                        {/* Progress Fill - 30 second animation */}
                        <motion.div
                            className="h-full bg-gradient-to-r from-gold-600 via-gold-400 to-gold-600 rounded-full"
                            initial={{ width: '0%' }}
                            animate={{ width: '100%' }}
                            transition={{
                                duration: 30,
                                ease: 'linear'
                            }}
                        />
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
