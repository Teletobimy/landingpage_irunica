'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function StickyCTA() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;
            const triggerPoint = window.innerHeight; // ~100vh

            // Hide when LeadCaptureFlow (#contact) is in view
            const contactSection = document.getElementById('contact');
            if (contactSection) {
                const rect = contactSection.getBoundingClientRect();
                const contactInView = rect.top < window.innerHeight && rect.bottom > 0;
                if (contactInView) {
                    setVisible(false);
                    return;
                }
            }

            setVisible(scrollY > triggerPoint);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToContact = () => {
        const el = document.getElementById('contact');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <AnimatePresence>
            {visible && (
                <>
                    {/* Mobile: Full-width bottom bar */}
                    <motion.div
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 100, opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-black/95 backdrop-blur-md border-t border-white/10 py-3 px-4"
                    >
                        <div className="flex gap-2">
                            <button
                                onClick={scrollToContact}
                                className="flex-1 bg-white text-black font-bold py-3 rounded-full text-xs uppercase tracking-wider hover:bg-gray-200 transition-colors"
                            >
                                Request Samples
                            </button>
                            <button
                                onClick={scrollToContact}
                                className="flex-1 border border-white/30 text-white font-bold py-3 rounded-full text-xs uppercase tracking-wider hover:bg-white/10 transition-colors"
                            >
                                Schedule a Call
                            </button>
                        </div>
                    </motion.div>

                    {/* Desktop: Floating card bottom-right */}
                    <motion.div
                        initial={{ y: 80, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 80, opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        className="fixed bottom-6 right-6 z-40 hidden md:block"
                    >
                        <div className="bg-black/95 backdrop-blur-md border border-white/10 rounded-2xl p-5 shadow-2xl shadow-black/50 space-y-3 w-64">
                            <p className="text-white text-sm font-semibold">Ready to get started?</p>
                            <button
                                onClick={scrollToContact}
                                className="w-full bg-white text-black font-bold py-3 rounded-full text-xs uppercase tracking-wider hover:bg-gray-200 transition-colors"
                            >
                                Request Samples
                            </button>
                            <button
                                onClick={scrollToContact}
                                className="w-full border border-white/30 text-white font-bold py-3 rounded-full text-xs uppercase tracking-wider hover:bg-white/10 transition-colors"
                            >
                                Schedule a Call
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
