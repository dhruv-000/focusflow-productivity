/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f3f8f3",
          100: "#e3f0e1",
          200: "#c7e0c3",
          300: "#9fc89b",
          400: "#78ad70",
          500: "#558f4e",
          600: "#436f3d",
          700: "#355834",
          800: "#2d462c",
          900: "#253a25",
        },
        accent: {
          50: "#fff4ea",
          100: "#ffe7d2",
          200: "#ffcaa6",
          300: "#ffa571",
          400: "#ff7f43",
          500: "#f06121",
          600: "#cf4b16",
          700: "#a73a14",
          800: "#873115",
          900: "#6f2a14",
        },
      },
      boxShadow: {
        soft: "0 15px 35px -15px rgba(17, 24, 39, 0.22)",
      },
      fontFamily: {
        display: ["Manrope", "ui-sans-serif", "system-ui", "sans-serif"],
        body: ["Plus Jakarta Sans", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
      },
      animation: {
        float: "float 5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
