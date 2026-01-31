'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const Petal = ({ delay, scale }: { delay: number; scale: number }) => {
    // Randomize sway direction
    const randomX = Math.random() * 50 - 25;

    return (
        <motion.div
            initial={{
                y: -50,
                x: `${Math.random() * 100}vw`,
                opacity: 0,
                rotate: Math.random() * 360,
                scale: scale
            }}
            animate={{
                y: ['-5vh', '105vh'], // Full vertical fall
                x: [`${Math.random() * 100}vw`, `${(Math.random() * 100) + randomX}vw`], // Drifting
                opacity: [0, 1, 1, 0], // Fade in/out
                rotateX: [0, 360], // 3D Tumble
                rotateY: [0, 180],
                rotateZ: [0, Math.random() * 360]
            }}
            transition={{
                duration: Math.random() * 5 + 10, // 10-15s slow fall
                delay: delay,
                repeat: Infinity,
                ease: "linear",
                times: [0, 1]
            }}
            className="absolute top-0 z-[50]"
        >
            {/* Realistic Cherry Blossom Petal Shape */}
            <svg width="18" height="18" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-90 drop-shadow-sm">
                <path d="M15,0 C12,0 10,6 15,12 C20,6 18,0 15,0 Z M15,0 C15,0 8,2 4,8 C0,14 2,22 8,24 C14,26 15,20 15,20 C15,20 16,26 22,24 C28,22 30,14 26,8 C22,2 15,0 15,0 Z" fill="#FFC0CB" />
                {/* Inner Gradient or Detail could go here, but simple pink fill is cleaner */}
                <path d="M15,12 C15,12 18,6 23,8 C27,10 28,16 26,20 C24,24 16,24 15,20 C14,24 6,24 4,20 C2,16 3,10 7,8 C12,6 15,12 15,12 Z" fill="#FFB7C5" opacity="0.6" />
            </svg>
        </motion.div>
    );
};

export default function CherryBlossom() {
    const [petals, setPetals] = useState<{ id: number; delay: number; scale: number }[]>([]);

    useEffect(() => {
        // Increase density for "scattering" effect
        setPetals(Array.from({ length: 40 }, (_, i) => ({
            id: i,
            delay: Math.random() * 10,
            scale: Math.random() * 0.5 + 0.5 // 0.5 to 1.0 size
        })));
    }, []);

    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-[10]">
            {petals.map((p) => (
                <Petal key={p.id} delay={p.delay} scale={p.scale} />
            ))}
        </div>
    );
}
