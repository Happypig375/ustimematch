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
        // Inner darken border
        "color-chip":
          "inset 0 0 0 1px hsla(0,0%,0%,0.1), 0 0 4px 2px hsla(0,0%,0%,0.01)",
        // For light mode
        elevation: "var(--shadow-elevation)",
        // For dark mode
        highlight: "var(--shadow-highlight)",
      },
    },
  },
  plugins: [],
};
