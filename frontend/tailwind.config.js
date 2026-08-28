/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "#0B0F19",
                surface: "#111827",
                "surface-card": "#1E293B",
                "surface-border": "#334155",
                primary: "#00E5FF",
                "primary-glow": "rgba(0, 229, 255, 0.15)",
                gold: "#E7C365",
                cyan: "#00E5FF",
                magenta: "#FF00FF",
                emerald: "#10B981"
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                mono: ['JetBrains Mono', 'monospace']
            }
        },
    },
    plugins: [],
}
