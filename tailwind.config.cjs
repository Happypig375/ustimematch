/** @type {import('tailwindcss').Config} */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  future: {
    hoverOnlyWhenSupported: true,
  },
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-ibm-plex-sans)", defaultTheme.fontFamily.sans],
      },
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
        // Dark mode template
        // brand: "#0066CC",
        // bg: {
        //   "light-500": "#060606",
        //   "light-400": "#080808",
        //   "light-300": "#181818",
        //   "light-200": "#161616",
        //   "light-100": "#121212",
        // },
        // text: {
        //   "black-200": "#dddddd",
        //   "black-100": "#aaaaaa",
        // },
        // border: {
        //   "gray-200": "#363636",
        //   "gray-100": "#323232",
        // },
      },
      boxShadow: {
        "tree-item":
          "0 2px 8px 4px rgba(0,0,0,0.01), 0 2px 12px 6px rgba(0,0,0,0.01)",
        "color-chip":
          "inset 0 0 0 1px rgba(0,0,0,0.1), 0 0 4px 2px rgba(0,0,0,0.01)",
        drawer: "0 0 8px 4px rgba(0,0,0,0.04), 0 0 32px 16px rgba(0,0,0,0.02)",
      },
    },
  },
  plugins: [],
};
