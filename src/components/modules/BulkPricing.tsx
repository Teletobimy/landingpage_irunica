'use client';
import { motion } from 'framer-motion';
import { SupportedLanguage } from '@/config/tld-language';
import { getTranslations } from '@/locales/translations';

interface Props {
    lang?: SupportedLanguage;
    companyName?: string;
    vipId?: string;
}

export default function BulkPricing({ lang = 'en', companyName = 'Unknown', vipId }: Props) {
    const t = getTranslations(lang).bulkPricing;

    const trackClick = async (buttonName: string) => {
        try {
            await fetch('/api/track-click', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    buttonName,
                    companyName,
                    vipId: vipId || companyName,
                }),
            });
        } catch (error) {
            console.error('Track click failed:', error);
        }
    };

    const VOLUME_TIERS = [
        {
            tier: t.starter,
            units: '100-499',
            discount: null,
            features: [t.fullCustomization, t.standardPackaging, t.production30],
            highlighted: false
        },
        {
            tier: t.growth,
            units: '500-1,999',
            discount: '15%',
            features: [t.fullCustomization, t.premiumPackaging, t.production21, t.dedicatedManager],
            highlighted: true
        },
        {
            tier: t.scale,
            units: '2,000-4,999',
            discount: '25%',
            features: [t.fullCustomization, t.allPackaging, t.production14, t.prioritySupport, t.quarterlyReports],
            highlighted: false
        },
        {
            tier: t.enterprise,
            units: '5,000+',
            discount: '35%+',
            features: [t.fullCustomization, t.bespokeFormulation, t.expressProduction, t.dedicatedTeam, t.exclusiveTrends],
            highlighted: false
        },
    ];

    const handleRequestQuote = async (tierName: string) => {
        await trackClick(`Request Quote - ${tierName}`);
        const contactSection = document.getElementById('contact');
        if (contactSection) {
            contactSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <section className="py-20 bg-neutral-950 text-white px-6">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12">
                    <span className="text-[10px] text-gold-500 font-mono tracking-widest uppercase">Volume Partnership</span>
                    <h3 className="text-3xl font-light mt-4">{t.title} <span className="font-bold">{t.titleBold}</span></h3>
                    <p className="text-neutral-400 mt-4 max-w-2xl mx-auto">
                        {lang === 'ko'
                            ? '대량 주문 시 볼륨에 따른 특별 할인과 맞춤 서비스를 제공합니다.'
                            : 'Volume-based discounts and dedicated services for bulk orders.'}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {VOLUME_TIERS.map((tier, index) => (
                        <motion.div
                            key={tier.tier}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            viewport={{ once: true }}
                            whileHover={{ y: -5 }}
                            className={`p-6 rounded-2xl border relative ${
                                tier.highlighted
                                    ? 'bg-white text-black border-gold-500'
                                    : 'bg-neutral-900 border-white/10'
                            }`}
                        >
                            {tier.highlighted && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                    <span className="px-3 py-1 bg-gold-500 text-black text-[10px] font-bold rounded-full">
                                        {t.mostPopular}
                                    </span>
                                </div>
                            )}

                            <h4 className={`text-lg font-bold mb-1 ${tier.highlighted ? 'text-black' : 'text-white'}`}>
                                {tier.tier}
                            </h4>
                            <p className={`text-sm mb-4 ${tier.highlighted ? 'text-neutral-600' : 'text-neutral-500'}`}>
                                {tier.units} {t.units}
                            </p>

                            <div className="mb-4">
                                {tier.discount ? (
                                    <div className={`flex items-baseline gap-2 ${
                                        tier.highlighted ? 'text-black' : 'text-white'
                                    }`}>
                                        <span className="text-3xl font-bold">{tier.discount}</span>
                                        <span className={`text-sm ${tier.highlighted ? 'text-neutral-600' : 'text-neutral-500'}`}>
                                            {lang === 'ko' ? '할인' : 'OFF'}
                                        </span>
                                    </div>
                                ) : (
                                    <span className={`text-2xl font-bold ${tier.highlighted ? 'text-black' : 'text-white'}`}>
                                        {lang === 'ko' ? '기본가' : 'Base Price'}
                                    </span>
                                )}
                            </div>

                            <ul className="space-y-2 mb-6">
                                {tier.features.map((feature) => (
                                    <li key={feature} className={`text-xs flex items-start gap-2 ${
                                        tier.highlighted ? 'text-neutral-700' : 'text-neutral-400'
                                    }`}>
                                        <span className={tier.highlighted ? 'text-green-600' : 'text-gold-500'}>✓</span>
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            <button
                                onClick={() => handleRequestQuote(tier.tier)}
                                className={`w-full py-2 rounded-full text-xs font-medium transition-colors ${
                                    tier.highlighted
                                        ? 'bg-black text-white hover:bg-neutral-800'
                                        : 'bg-white/10 text-white hover:bg-white/20'
                                }`}
                            >
                                {lang === 'ko' ? '견적 문의' : 'Request Quote'}
                            </button>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    viewport={{ once: true }}
                    className="mt-12 text-center"
                >
                    <p className="text-sm text-neutral-500">
                        {lang === 'ko'
                            ? '10,000개 이상 대량 주문 시 추가 할인 협의 가능합니다.'
                            : 'Additional discounts available for orders over 10,000 units.'}
                        <button
                            onClick={() => handleRequestQuote('10,000+ Custom')}
                            className="text-gold-500 ml-2 hover:underline"
                        >
                            {lang === 'ko' ? '문의하기 →' : 'Contact us →'}
                        </button>
                    </p>
                </motion.div>
            </div>
        </section>
    );
}
