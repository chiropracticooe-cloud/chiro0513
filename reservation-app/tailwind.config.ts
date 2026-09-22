import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./lib/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f4f6f1",
          100: "#e6ebdd",
          200: "#cdd8bc",
          300: "#adc093",
          400: "#8ba76d",
          500: "#6f8f52",
          600: "#57713f",
          700: "#445834",
          800: "#39482c",
          900: "#313d28",
        },
      },
    },
  },
  plugins: [],
};

export default config;
