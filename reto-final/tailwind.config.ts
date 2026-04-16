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
        platzi: {
          green: "#0AE88A",
          "green-hover": "#4FF7AD",
          "green-strong": "#05824D",
          bg: "#141414",
          "bg-secondary": "#1C1C1C",
          "bg-tertiary": "#292929",
          text: "#F7FAF7",
          "text-secondary": "#919996",
          "text-on-button": "#141414",
          error: "#E63357",
          info: "#0AB5E8",
          warning: "#F5D400",
        },
      },
    },
  },
  plugins: [],
};

export default config;
