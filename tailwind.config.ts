import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
                "teal-300": "var(--purity-teal)",
                "teal-400": "var(--purity-teal-hover)",
                "gray-700": "#2D3748",
                "purity-700": "var(--purity-gray-dark)",
            },
            fontFamily: {
                sans: ["Avenir", "sans-serif"],
            },
        },
    },
    plugins: [],
};
export default config;
