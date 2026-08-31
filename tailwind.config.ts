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
        alat: {
          purple: "#6B2D8B",
          "purple-dark": "#4A1D66",
          "purple-light": "#9B59B6",
          pink: "#E91E8C",
          orange: "#FF6B35",
          gold: "#F5A623",
          navy: "#0F0A1A",
          surface: "#1A1225",
          muted: "#8B7A9E",
        },
      },
      backgroundImage: {
        "alat-gradient": "linear-gradient(135deg, #6B2D8B 0%, #E91E8C 50%, #FF6B35 100%)",
        "alat-radial": "radial-gradient(ellipse at top, #6B2D8B33 0%, transparent 60%)",
        "hero-glow": "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(233,30,140,0.35), transparent)",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      animation: {
        "float": "float 6s ease-in-out infinite",
        "pulse-glow": "pulse-glow 3s ease-in-out infinite",
        "slide-up": "slide-up 0.6s ease-out",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "0.6" },
          "50%": { opacity: "1" },
        },
        "slide-up": {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
