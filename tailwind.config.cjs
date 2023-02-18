// eslint-disable-next-line @typescript-eslint/no-var-requires
const defaultTheme = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
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
        // Inner border for color chip and week view period
        outline: "var(--shadow-outline)",
        // Shadow for light mode, highlight for dark mode
        elevation: "var(--shadow-elevation)",
      },
      transitionProperty: {
        // For buttons, inputs, anchors
        focusable:
          "box-shadow, color, background-color, border-color, text-decoration-color, fill, stroke",
      },
      // Skeleton shimmer effect
      backgroundImage: {
        shimmer:
          "linear-gradient(to right, transparent 0%, rgb(var(--fg-100) / 0.05) 50%, transparent 100%)",
      },
      keyframes: {
        shimmer: {
          "0%": {
            transform: "translateX(-100%)",
          },
          "100%": {
            transform: "translateX(100%)",
          },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
