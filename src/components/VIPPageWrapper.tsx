'use client';

import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { AnimatePresence } from 'framer-motion';
import CinematicIntro from './CinematicIntro';
import { SupportedLanguage } from '@/config/tld-language';

// Context to signal when content is ready
const ContentReadyContext = createContext<{
    isContentReady: boolean;
    setContentReady: () => void;
}>({
    isContentReady: false,
    setContentReady: () => {},
});

export function useContentReady() {
    return useContext(ContentReadyContext);
}

// Component to signal content ready when it mounts
export function ContentReadySignal() {
    const { setContentReady } = useContentReady();

    useEffect(() => {
        setContentReady();
    }, [setContentReady]);

    return null;
}

// Main wrapper that coordinates CinematicIntro with content loading
interface VIPPageWrapperProps {
    children: ReactNode;
    lang?: SupportedLanguage;
}

export function VIPPageWrapper({ children, lang = 'en' }: VIPPageWrapperProps) {
    const [isContentReady, setIsContentReady] = useState(false);
    const [showIntro, setShowIntro] = useState(true);

    const setContentReady = React.useCallback(() => {
        setIsContentReady(true);
    }, []);

    const handleIntroDismiss = React.useCallback(() => {
        setShowIntro(false);
    }, []);

    return (
        <ContentReadyContext.Provider value={{ isContentReady, setContentReady }}>
            <AnimatePresence>
                {showIntro && (
                    <CinematicIntro
                        isContentReady={isContentReady}
                        minDuration={3000}
                        lang={lang}
                        onDismiss={handleIntroDismiss}
                    />
                )}
            </AnimatePresence>
            {children}
        </ContentReadyContext.Provider>
    );
}
