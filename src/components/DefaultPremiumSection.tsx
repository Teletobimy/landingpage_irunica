import Image from 'next/image';

export default function DefaultPremiumSection() {
    return (
        <section className="bg-neutral-950 py-32 px-6">
            <div className="max-w-7xl mx-auto text-center">
                <div className="relative aspect-[21/9] w-full max-w-5xl mx-auto overflow-hidden rounded-sm border border-white/5 bg-black flex items-center justify-center">
                    <div className="text-center space-y-4">
                        <h3 className="text-2xl font-light text-white/80 tracking-[0.2em] uppercase">
                            Visuals Coming Soon
                        </h3>
                        <p className="text-white/40 text-sm font-mono tracking-widest">
                            Awaiting High-Fidelity Renders
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
