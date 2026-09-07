/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "rgb(var(--color-ink) / <alpha-value>)",
        paper: "rgb(var(--color-paper) / <alpha-value>)",
        cloud: "rgb(var(--color-cloud) / <alpha-value>)",
        ember: "rgb(var(--color-ember) / <alpha-value>)",
        "ember-dark": "rgb(var(--color-ember-dark) / <alpha-value>)",
        lagoon: "rgb(var(--color-lagoon) / <alpha-value>)",
        teal: "rgb(var(--color-teal) / <alpha-value>)",
        slate: "rgb(var(--color-slate) / <alpha-value>)",
        moss: "rgb(var(--color-moss) / <alpha-value>)",
        mist: "rgb(var(--color-mist) / <alpha-value>)",
      },
      fontFamily: {
        display: ["'Baloo 2'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
      },
      fontSize: {
        xs: ["0.9rem", { lineHeight: "1.4rem" }],
        sm: ["1rem", { lineHeight: "1.6rem" }],
        base: ["1.125rem", { lineHeight: "1.85rem" }],
        lg: ["1.25rem", { lineHeight: "1.9rem" }],
        xl: ["1.4rem", { lineHeight: "2rem" }],
        "2xl": ["1.75rem", { lineHeight: "2.25rem" }],
        "3xl": ["2.125rem", { lineHeight: "2.5rem" }],
      },
      borderRadius: {
        bubble: "1.25rem",
      },
    },
  },
  plugins: [],
};
