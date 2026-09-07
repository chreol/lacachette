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
        'black-ebony': '#171310',
        'brown-wood': '#4A2C20',
        'terra-cotta': '#9A4F32',
        'gold-aged': '#C59A4A',
        'olive-green': '#596044',
        'ivory-cream': '#E8D8B8',
        'amber': '#B86B32',
      },
    },
  },
  plugins: [],
};
export default config;
