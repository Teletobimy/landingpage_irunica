'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import DefaultPremiumSection from './DefaultPremiumSection';

interface VisualSectionProps {
    images: { id: string; url: string }[];
    companyName: string;
}

export default function VisualSection({ images, companyName }: VisualSectionProps) {
    const count = images.length;

    // DEBUG: Check what VisualSection is receiving
    console.log('[VisualSection] Received Images:', images);

    // 1. 이미지가 0개인 경우: 프리미엄 기본 에셋 노출 (Fallback)
    if (count === 0) {
        return <DefaultPremiumSection />;
    }

    return (
        <section className="bg-neutral-950 py-20 px-6">
            <div className="max-w-7xl mx-auto space-y-20">

                {/* --- 섹션 1: 메인 히어로 (무조건 1번째 이미지 사용) --- */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl group border border-white/10"
                >
                    <Image
                        src={images[0].url}
                        alt="Hero Product"
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-10 left-10">
                        <h3 className="text-white text-4xl font-bold tracking-tighter italic uppercase">
                            {companyName} Edition
                        </h3>
                        <p className="text-white/70 mt-2 tracking-widest uppercase text-xs">Signature Nanobanana Formula</p>
                    </div>
                </motion.div>

                {/* --- 섹션 2: 나머지 이미지 갯수에 따른 유동적 그리드 --- */}
                <div className="grid gap-6">
                    {count === 1 && (
                        <p className="text-center text-neutral-500 text-sm">Exclusive Preview for {companyName}</p>
                    )}

                    {/* 이미지 2개: 좌우 50:50 배치 (Duo Mode) */}
                    {count === 2 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[500px]">
                            <ImageSlot src={images[1].url} className="h-full" />
                            <div className="flex items-center justify-center border border-white/10 rounded-xl p-10 bg-white/5">
                                <p className="text-white font-light text-center leading-relaxed">
                                    &quot;We render your brand value <br /> in its purest form.&quot;
                                </p>
                            </div>
                        </div>
                    )}

                    {/* 이미지 3-4개: 비대칭 그리드 (Modern Grid) */}
                    {(count === 3 || count === 4) && (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                            <ImageSlot src={images[1].url} className="col-span-2 h-[400px]" />
                            <ImageSlot src={images[2].url} className="col-span-1 h-[400px]" />
                            {images[3] && <ImageSlot src={images[3].url} className="col-span-full h-[300px]" />}
                        </div>
                    )}

                    {/* 이미지 5개: 풀 컬렉션 (Premium Gallery) */}
                    {count >= 5 && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            <div className="col-span-2 row-span-2 h-[600px]">
                                <ImageSlot src={images[1].url} className="h-full" />
                            </div>
                            <ImageSlot src={images[2].url} className="h-[288px]" />
                            <ImageSlot src={images[3].url} className="h-[288px]" />
                            <div className="col-span-2 h-[288px]">
                                <ImageSlot src={images[4].url} className="h-full" />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}

// 공통 이미지 슬롯 컴포넌트
function ImageSlot({ src, className }: { src: string; className?: string }) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className={cn("relative rounded-xl overflow-hidden bg-neutral-900 border border-white/5", className)}
        >
            <Image
                src={src}
                alt="Visual"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover hover:scale-105 transition-transform duration-500"
            />
        </motion.div>
    );
}
