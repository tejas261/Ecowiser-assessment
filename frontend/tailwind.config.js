/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
    screens: {
      xs: "186px",
      // => @media (min-width: 1024px) { ... }

      sm: "640px",
      // => @media (min-width: 640px) { ... }

      md: "786px",
      // => @media (min-width: 1024px) { ... }

      lg: "1024px",
      // => @media (min-width: 1280px) { ... }

      xl: "1280px",
      // => @media (min-width: 1024px) { ... }
    },
  },
  plugins: [],
}