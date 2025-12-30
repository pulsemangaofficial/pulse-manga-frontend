/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "#0f0f1a", // Deep dark blue/black
                surface: "#1a1a2e",    // Slightly lighter for cards
                primary: "#00e5ff",    // Cyan/Blue Request
                "primary-dark": "#00b8cc",
                secondary: "#ffaa00",  // Gold/Orange accent (if needed)
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
            boxShadow: {
                'glow': '0 0 15px rgba(0, 229, 255, 0.3)',
                'glow-strong': '0 0 25px rgba(0, 229, 255, 0.6)',
            },
            scale: {
                '102': '1.02',
            }
        },
    },
    plugins: [],
}
