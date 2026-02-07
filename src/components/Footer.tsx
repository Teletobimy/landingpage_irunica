'use client';

import { SupportedLanguage } from '@/config/tld-language';
import { getTranslations } from '@/locales/translations';

interface FooterProps {
    lang?: SupportedLanguage;
}

export default function Footer({ lang = 'en' }: FooterProps) {
    const t = getTranslations(lang).footer;
    const year = new Date().getFullYear();

    return (
        <footer className="bg-neutral-950 border-t border-white/10 text-neutral-400 py-16 px-6">
            <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
                    {/* Distribution */}
                    <div>
                        <h4 className="text-white text-sm font-bold mb-4">{t.distribution}</h4>
                        <a
                            href="https://k-beautybrand.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm hover:text-gold-500 transition-colors block mb-1"
                        >
                            k-beautybrand.com
                        </a>
                        <p className="text-xs text-neutral-500">{t.distributionDesc}</p>
                    </div>

                    {/* Private Label */}
                    <div>
                        <h4 className="text-white text-sm font-bold mb-4">{t.privateLabel}</h4>
                        <a
                            href="https://irunica.co.kr"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm hover:text-gold-500 transition-colors block mb-1"
                        >
                            irunica.co.kr
                        </a>
                        <p className="text-xs text-neutral-500">{t.privateLabelDesc}</p>
                    </div>

                    {/* Legal */}
                    <div>
                        <h4 className="text-white text-sm font-bold mb-4">{t.legal}</h4>
                        <a
                            href="/privacy"
                            className="text-sm hover:text-gold-500 transition-colors block mb-2"
                        >
                            {t.privacyPolicy}
                        </a>
                        <a
                            href="/terms"
                            className="text-sm hover:text-gold-500 transition-colors block"
                        >
                            {t.terms}
                        </a>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-white text-sm font-bold mb-4">{t.contact}</h4>
                        <a
                            href="mailto:sales@irunica.co.kr"
                            className="text-sm hover:text-gold-500 transition-colors block mb-2"
                        >
                            sales@irunica.co.kr
                        </a>
                        <p className="text-xs text-neutral-500">Seoul, South Korea</p>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-xs text-neutral-500">
                        &copy; {year} IRUNICA. {t.copyright}
                    </p>
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-neutral-600 tracking-widest uppercase">K-Beauty Innovation</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
