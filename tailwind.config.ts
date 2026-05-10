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
        duo: {
          bg: "#1a1a2e",
          surface: "#252542",
          surface2: "#2d2d4a",
          green: "#58CC02",
          "green-dark": "#46a302",
          blue: "#1CB0F6",
          "blue-dark": "#1899d6",
          ink: "#e8e8ef",
          muted: "#9b9bb8",
          warning: "#ffc800",
        },
      },
      fontFamily: {
        sans: ["var(--font-nunito)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        duo: "0 4px 0 0 rgba(0,0,0,0.35)",
        "duo-sm": "0 2px 0 0 rgba(0,0,0,0.35)",
      },
    },
  },
  plugins: [],
};
export default config;
