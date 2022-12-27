/** @type {import('tailwindcss').Config} */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: "#003366",
        bg: {
          "light-500": "#dcdcdc",
          "light-400": "#efefef",
          "light-300": "#f7f9fa",
          "light-200": "#fafafa",
          "light-100": "#ffffff",
        },
        text: {
          "black-200": "#161616",
          "black-100": "#484848",
        },
        border: {
          "gray-200": "#d4d4d4",
          "gray-100": "#e4e4e4",
        },
      },
      fontFamily: {
        sans: ["Inter", ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [],
};
