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
      // Bumped every named size up a notch from Tailwind's defaults, so
      // text-sm, text-base, text-xl etc. all render slightly bigger
      // everywhere they're already used - no per-component edits needed.
      fontSize: {
        xs: ["0.8125rem", { lineHeight: "1.25rem" }],
        sm: ["0.9375rem", { lineHeight: "1.5rem" }],
        base: ["1.0625rem", { lineHeight: "1.75rem" }],
        lg: ["1.1875rem", { lineHeight: "1.75rem" }],
        xl: ["1.3125rem", { lineHeight: "1.875rem" }],
        "2xl": ["1.625rem", { lineHeight: "2.1rem" }],
        "3xl": ["2rem", { lineHeight: "2.4rem" }],
      },
      borderRadius: {
        bubble: "1.25rem",
      },
    },
  },
  plugins: [],
};
