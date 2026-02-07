import { SupportedLanguage } from '@/config/tld-language';
import { getTranslations } from '@/locales/translations';

interface Props {
    lang?: SupportedLanguage;
}

export default function DefaultPremiumSection({ lang = 'en' }: Props) {
    const t = getTranslations(lang).defaultPremium;

    return (
        <section className="bg-neutral-950 py-32 px-6">
            <div className="max-w-7xl mx-auto text-center">
                <div className="relative aspect-[21/9] w-full max-w-5xl mx-auto overflow-hidden rounded-sm border border-white/5 bg-black flex items-center justify-center">
                    <div className="text-center space-y-4">
                        <h3 className="text-2xl font-light text-white/80 tracking-[0.2em] uppercase">
                            {t.visualsComingSoon}
                        </h3>
                        <p className="text-white/40 text-sm font-mono tracking-widest">
                            {t.awaitingRenders}
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
