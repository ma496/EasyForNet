import type { Config } from 'tailwindcss'

const config: Config = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        container: {
            center: true,
            padding: '1rem',
        },
        screens: {
            sm: '640px',
            md: '768px',
            lg: '1024px',
            xl: '1280px',
            '2xl': '1472px',
        },
        fontFamily: {
            'plus-jakarta': ['Plus Jakarta Sans', 'sans-serif'],
        },
        colors: {
            transparent: 'transparent',
            current: 'currentColor',
            white: '#FFFFFF',
            black: '#171718',
            primary: '#335CFF',
            gray: {
                DEFAULT: '#525866',
                100: '#FAFBFC',
                200: '#F9FAFB',
                300: '#E2E8F0',
                400: '#F5F7FA',
                500: '#B9BEC6',
                600: '#9CA3AF',
                700: '#6B7280',
            },
            danger: {
                DEFAULT: '#EF4444',
                light: '#FEE2E2',
            },
            success: {
                DEFAULT: '#22C55E',
                light: '#DCFCE7',
            },
            warning: '#EAB308',
            'light-theme': '#F4F7FF',
            'light-orange': '#FFEDD5',
            'light-blue': '#E0F2FE',
            'light-purple': '#F3E8FF',
        },
        extend: {
            boxShadow: {
                '3xl': '0 1px 2px 0 rgba(95,74,46,0.08), 0 0 0 1px rgba(227,225,222,0.4)',
                sm: '0 1px 2px 0 rgba(113,116,152,0.1)',
            },

            keyframes: {
                'accordion-down': {
                    from: { height: '0' },
                    to: { height: 'var(--radix-accordion-content-height)' },
                },
                'accordion-up': {
                    from: { height: 'var(--radix-accordion-content-height)' },
                    to: { height: '0' },
                },
                'caret-blink': {
                    '0%,70%,100%': { opacity: '1' },
                    '20%,50%': { opacity: '0' },
                },
            },
            animation: {
                'accordion-down': 'accordion-down 0.3s ease-out',
                'accordion-up': 'accordion-up 0.3s ease-out',
                'caret-blink': 'caret-blink 1.25s ease-out infinite',
            },
        },
    },
    plugins: [require('tailwindcss-animate')],
}
export default config
