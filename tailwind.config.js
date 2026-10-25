/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        charcoal: "#171715",
        "deep-black": "#10100F",
        "warm-ivory": "#F6F1E8",
        "warm-ivory-dark": "#ECE4D6",
        gold: {
          DEFAULT: "#B99A61",
          light: "#D8BF89",
          dark: "#967B46",
          subtle: "rgba(185, 154, 97, 0.12)",
        },
        "secondary-gray": "#77746E",
        "muted-gray": "#44423E",
        "card-dark": "#1D1C19",
        "card-darker": "#141413",
        "border-dark": "#2A2925",
        "border-light": "#E5DDD0",
      },
      fontFamily: {
        serif: ["Cinzel", "Playfair Display", "Georgia", "serif"],
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
      },
    },
  },
  plugins: [],
};
