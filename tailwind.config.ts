import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
                // K-Beauty 2025 Trend Palette
                gold: {
                    // Re-mapped to "Luminous Champagne" (Less Orange, More Ethereal)
                    DEFAULT: '#E3C89B',
                    50: '#FAF7F2',
                    100: '#F4EBD9',
                    200: '#EADBC1', // Bisque-like
                    300: '#E3C89B', // Key Champagne Gold
                    400: '#D4B47D',
                    500: '#C19D60', // Richer Gold
                    600: '#9E7E44',
                    700: '#7D6132',
                    800: '#5F4824', // Mocha Like
                    900: '#433217',
                },
                kbeauty: {
                    base: '#FFFFFF', // Pure White
                    sofly: '#F9F9F9', // Soft background
                    peach: '#FFD1C9', // Soft Pastel Accent
                    lavender: '#E6E6FA', // Ethereal Accent
                    mint: '#D8F3DC', // Clean Accent
                    mocha: '#8D7B68', // Warm Text
                    charcoal: '#2D2D2D', // Sharp Text
                }
            },
        },
    },
    plugins: [],
};
export default config;
