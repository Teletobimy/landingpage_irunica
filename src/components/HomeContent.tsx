'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function HomeContent() {
    const searchParams = useSearchParams();
    const router = useRouter();

    useEffect(() => {
        const vip = searchParams.get('vip');
        if (vip) {
            router.push(`/${vip}`);
        }
    }, [searchParams, router]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-8 text-center relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-800/20 via-black to-black z-0 pointer-events-none" />

            <div className="relative z-10 max-w-2xl">
                <h1 className="text-sm font-bold tracking-[0.5em] text-gold-500 mb-8 uppercase">
                    Private Labeling Expert
                </h1>
                <h2 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/50">
                    IRUNICA
                </h2>
                <p className="text-gray-400 text-lg mb-12 leading-relaxed">
                    Premium cosmetic manufacturing solutions powered by advanced AI.
                    <br />
                    <span className="text-sm opacity-50 mt-4 block">To access your private proposal, please use the VIP link provided to you.</span>
                </p>

                <a href="mailto:contact@irunica.com" className="px-8 py-3 border border-zinc-700 rounded-full hover:bg-white hover:text-black transition-all text-sm tracking-widest">
                    CONTACT US
                </a>
            </div>
        </div>
    );
}
