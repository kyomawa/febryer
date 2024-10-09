import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        montserrat: ["var(--font-montserrat)"],
        roboto: ["var(--font-roboto)"],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          "50": "#f2f5fb",
          "100": "#e7eef8",
          "200": "#d4def1",
          "300": "#b9c8e8",
          "400": "#9cacdd",
          "500": "#8491d0",
          "600": "#6a72c1",
          "700": "#6066ac",
          "800": "#4a5089",
          "900": "#41466e",
          "950": "#262840",
          "1000": "#151624",
          "1050": "#0A0B12",
        },
      },
      screens: {
        xs: "400px",
        "3xl": "1700px",
        "2k": "1921px",
        "4k": "2561px",
        "8k": "3841px",
        "10k": "5121px",
        "12k": "6401px",
        "14k": "7681px",
        "16k": "10241px",
      },
      keyframes: {
        loading: {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
      },
      animation: {
        loading: "loading 4.25s linear infinite",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
