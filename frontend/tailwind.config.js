/** @type {import('tailwindcss').Config} */
// eslint-disable-next-line no-undef
const defaultTheme = require('tailwindcss/defaultTheme');

export default {
    purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
    theme: {
        screens: {
            sm: '320px',
            m: '525px',
            md: '768px',
            lg: '1366px',
            xl: '1920px',
        },
        extend: {
            fontFamily: {
                body: ['Montserrat', ...defaultTheme.fontFamily.sans],
            },
            colors: {
                inherit: 'inherit',
                'app-white': '#F4F5F8',

                // Темная тема
                'dark-bg': '#1E1E2E',      // Основной фон
                'dark-bg-secondary': '#27293D', // Вторичный фон
                'dark-text': '#F8F8F2',        // Основной текст
                'dark-text-secondary': '#C4C4C7', // Вторичный текст
                'dark-border': '#44475A',      // Границы
                'dark-accent': '#6272A4',      // Акцентный цвет
                'dark-accent-hover': '#7086D6', // Ховер для акцентов
                
                // Успех, Ошибка, Предупреждение
                'dark-success': '#50fa7b',
                'dark-error': '#ff5555',
                'dark-warning': '#f1fa8c',
            },
            fontSize: {
                '2xs': ['10px', '13px'],
            },
            maxWidth: {
                '1/2': '50%',
            },
            spacing: {
                '15': '60px',
            },
            borderRadius: {
                '2.5xl': '20px',
                2.5: '10px',
                '4xl': '32px'
            },
            gridTemplateAreas: {
                'layout': [
                    'advertisement',
                    'header',
                    'main',
                    'footer'
                ],
            },
            gridTemplateRows: {
                'aa1': 'repeat(2, auto) 1fr',
                'a1': 'auto 1fr',
                '1a': '1fr auto',
                '1a1': '1fr auto 1fr',
                'a11': 'auto 1fr 1fr',
                '11a': '1fr 1fr auto',
                'a1a': 'auto 1fr auto',
                '1aa': '1fr repeat(2, auto)',
                'a1aa': 'auto 1fr repeat(2, auto)',
                'full': '100%',
            },
            gridTemplateColumns: {
                'aa1': 'repeat(2, auto) 1fr',
                'a1': 'auto 1fr',
                '1a': '1fr auto',
                '1a1': '1fr auto 1fr',
                'a11': 'auto 1fr 1fr',
                '11a': '1fr 1fr auto',
                'a1a': 'auto 1fr auto',
                '1aa': '1fr repeat(2, auto)',
                'a1aa': 'auto 1fr repeat(2, auto)',
                'full': '100%',
            },
        },
    },
    plugins: [
        require('@savvywombat/tailwindcss-grid-areas'),
    ],
}
