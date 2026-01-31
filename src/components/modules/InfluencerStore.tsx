'use client';
import { motion } from 'framer-motion';

interface Props {
    companyName: string;
    productImages?: { url: string }[];
    vipId?: string;
}

export default function InfluencerStore({ companyName, productImages, vipId }: Props) {
    const displayImage = productImages?.[0]?.url || '/assets/images/default-premium-product.jpg';

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

    const handleStartLineup = async () => {
        await trackClick('Start Your Lineup');
        const contactSection = document.getElementById('contact');
        if (contactSection) {
            contactSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <section className="py-20 bg-white overflow-hidden">
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center px-6">
                <div className="order-2 md:order-1">
                    <h3 className="text-4xl font-light leading-tight mb-6">
                        From Curator to <br /><span className="font-bold underline decoration-gold-500 underline-offset-8">Brand Owner.</span>
                    </h3>
                    <p className="text-neutral-500 mb-8 leading-relaxed">
                        Stop promoting other brands. {companyName}&apos;s vision meets Irunica&apos;s technology. Your perfect lineup is ready. Launch your first drop.
                    </p>
                    <button
                        onClick={handleStartLineup}
                        className="px-8 py-4 bg-black text-white rounded-full font-bold hover:bg-gold-600 transition-colors"
                    >
                        Start Your Lineup
                    </button>
                </div>

                {/* Mobile Phone Mockup */}
                <div className="order-1 md:order-2 relative flex justify-center">
                    <div className="relative w-72 h-[580px] bg-neutral-900 rounded-[3rem] border-[8px] border-neutral-800 shadow-2xl overflow-hidden ring-1 ring-white/10 transform rotate-[-5deg] hover:rotate-0 transition-transform duration-700">
                        {/* Store Content */}
                        <div className="h-full bg-white flex flex-col">
                            <div className="p-6 border-b border-neutral-100 flex justify-between items-center">
                                <span className="text-xs font-black italic">{companyName}</span>
                                <div className="w-4 h-4 rounded-full bg-black/5" />
                            </div>
                            <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
                                {/* Product Image */}
                                <div className="w-full aspect-[4/5] bg-neutral-100 rounded-2xl overflow-hidden relative">
                                    <img src={displayImage} alt="Customized product" className="object-cover w-full h-full" />
                                    <div className="absolute top-2 right-2 bg-black text-white text-[10px] px-2 py-1 rounded-full">
                                        Best Seller
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] text-neutral-400 uppercase">New Arrival</p>
                                    <p className="text-sm font-bold tracking-tight">Signature Glow Toner</p>
                                    <p className="text-xs text-gold-600">$48.00</p>
                                </div>
                                <button className="w-full py-3 bg-black text-white text-[10px] font-bold uppercase rounded-lg hover:bg-neutral-800 transition-colors">
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                    </div>
                    {/* Decorative Background */}
                    <div className="absolute -z-10 w-96 h-96 bg-gold-200 blur-[100px] rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-40 animate-pulse" />
                </div>
            </div>
        </section>
    );
}
