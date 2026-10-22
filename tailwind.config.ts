import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "#050505",
        foreground: "#f5f5f5",
        primary: {
          DEFAULT: "#e63946",
          dark: "#b71c1c",
          glow: "#ff4d5a",
        },
        surface: {
          DEFAULT: "#0f0f11",
          subtle: "#161619",
          border: "#232328",
        },
        accent: {
          blue: "#38bdf8",
          amber: "#f59e0b",
        },
      },
      fontFamily: {
        mono: ["var(--font-mono)", "JetBrains Mono", "monospace"],
        heading: ["var(--font-heading)", "Inter", "sans-serif"],
        sans: ["var(--font-sans)", "Inter", "sans-serif"],
      },
      screens: {
        wide: "1440px",
        ultrawide: "1920px",
      },
    },
  },
  plugins: [],
};

export default config;
