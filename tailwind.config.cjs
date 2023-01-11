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
        bg: {
          100: "rgb(var(--bg-100) / <alpha-value>)",
          200: "rgb(var(--bg-200) / <alpha-value>)",
          300: "rgb(var(--bg-300) / <alpha-value>)",
        },
        fg: {
          100: "rgb(var(--fg-100) / <alpha-value>)",
          200: "rgb(var(--fg-200) / <alpha-value>)",
        },
        border: {
          100: "rgb(var(--border-100) / <alpha-value>)",
          200: "rgb(var(--border-200) / <alpha-value>)",
        },
        brand: "rgb(var(--brand) / <alpha-value>)",
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
