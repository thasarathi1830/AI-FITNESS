/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                // Dark mode colors
                'dark-bg': '#0a0e1a',
                'dark-card': '#141824',
                'dark-sidebar': '#0f1219',
                'dark-border': '#1e2433',
                'dark-text': '#e5e7eb',
                'dark-text-secondary': '#9ca3af',

                // Light mode colors
                'light-bg': '#f9fafb',
                'light-card': '#ffffff',
                'light-sidebar': '#ffffff',
                'light-border': '#e5e7eb',
                'light-text': '#111827',
                'light-text-secondary': '#6b7280',

                // Brand colors
                'primary': '#10b981',
                'secondary': '#3b82f6',
                'accent': '#a855f7',
            },
        },
    },
    plugins: [],
}
