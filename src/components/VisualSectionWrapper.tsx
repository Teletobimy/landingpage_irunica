'use client';

import React, { use } from 'react';
import VisualSection from './VisualSection';
import DefaultPremiumSection from './DefaultPremiumSection';

interface VisualSectionWrapperProps {
    imagesPromise: Promise<{ id: string; url: string }[]>;
    companyName: string;
}

export default function VisualSectionWrapper({ imagesPromise, companyName }: VisualSectionWrapperProps) {
    // React 19 / Next.js 15: Use `use` to unwrap promises in Client Components
    // or pass to a server component that awaits?
    // Actually, `use` hook is preferred for promise unwrapping in render.
    const images = use(imagesPromise);

    return <VisualSection images={images} companyName={companyName} />;
}
