'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { SupportedLanguage } from '@/config/tld-language';
import { getTranslations } from '@/locales/translations';

interface Props {
    lang?: SupportedLanguage;
    companyName?: string;
}

interface Brand {
    name: string;
    imageUrl: string;
    description: string;
}

function SkeletonGrid() {
    return (
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-4 mb-12">
            {Array.from({ length: 12 }).map((_, i) => (
                <div
                    key={i}
                    className="aspect-square rounded-2xl bg-neutral-800 animate-pulse"
                />
            ))}
        </div>
    );
}

export default function BrandPortfolio({ lang = 'en' }: Props) {
    const t = getTranslations(lang).brandPortfolio;
    const [brands, setBrands] = useState<Brand[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        fetch('/api/brands')
            .then((res) => {
                if (!res.ok) throw new Error('fetch failed');
                return res.json();
            })
            .then((data: Brand[]) => {
                setBrands(data);
                setLoading(false);
            })
            .catch(() => {
                setError(true);
                setLoading(false);
            });
    }, []);

    const handleCTAClick = () => {
        const contactSection = document.getElementById('contact');
        if (contactSection) {
            contactSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const brandCount = brands.length > 0 ? `${brands.length}+` : '47+';

    const stats = [
        { value: brands.length > 0 ? `${brandCount} ${t.statBrands.replace(/[\d+]+\s*/, '')}` : t.statBrands, icon: '◆' },
        { value: t.statSKUs, icon: '◆' },
        { value: t.statCountries, icon: '◆' },
    ];

    return (
        <section className="py-20 bg-neutral-950 text-white px-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <span className="text-[10px] text-gold-500 font-mono tracking-widest uppercase">
                        Brand Portfolio
                    </span>
                    <h3 className="text-3xl font-light mt-4">
                        {t.title} <span className="font-bold">{t.titleBold}</span>
                    </h3>
                    <p className="text-neutral-400 mt-4 max-w-2xl mx-auto">
                        {t.subtitle}
                    </p>
                </div>

                {/* Brand Grid */}
                {loading ? (
                    <SkeletonGrid />
                ) : error ? (
                    <div className="text-center text-neutral-500 mb-12 py-12">
                        <p className="text-sm">Could not load brand data.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-4 mb-12">
                        {brands.map((brand, index) => (
                            <motion.a
                                key={brand.name}
                                href="https://k-beautybrand.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: Math.min(index * 0.03, 0.6), duration: 0.4 }}
                                viewport={{ once: true }}
                                whileHover={{ scale: 1.05, boxShadow: '0 8px 24px rgba(0,0,0,0.4)' }}
                                className="aspect-square rounded-2xl border border-white/10 bg-white flex items-center justify-center p-4 cursor-pointer transition-shadow"
                            >
                                <Image
                                    src={brand.imageUrl}
                                    alt={brand.name}
                                    width={120}
                                    height={120}
                                    className="object-contain w-full h-full"
                                    unoptimized
                                />
                            </motion.a>
                        ))}
                    </div>
                )}

                {/* Stats Bar */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    viewport={{ once: true }}
                    className="flex justify-center items-center gap-8 sm:gap-16 mb-12 py-6 border-t border-b border-white/10"
                >
                    {stats.map((stat, index) => (
                        <div key={index} className="text-center">
                            <span className="text-gold-500 text-[10px] block mb-1">{stat.icon}</span>
                            <span className="text-lg sm:text-xl font-bold text-white">{stat.value}</span>
                        </div>
                    ))}
                </motion.div>

                {/* CTA */}
                <div className="text-center">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleCTAClick}
                        className="px-8 py-3 bg-gold-500 text-black font-medium rounded-full text-sm hover:bg-gold-400 transition-colors shadow-[0_0_20px_rgba(212,175,55,0.3)]"
                    >
                        {t.cta}
                    </motion.button>
                </div>
            </div>
        </section>
    );
}
