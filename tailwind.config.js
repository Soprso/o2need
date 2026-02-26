/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#14532d',
                secondary: '#22c55e',
                accent: '#facc15',
                background: '#f9fafb',
                card: '#ffffff',
                text: '#111827',
                subtext: '#6b7280',
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                heading: ['Poppins', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
