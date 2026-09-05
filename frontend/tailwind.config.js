/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#17151F", // near-black - headings, body text (back to black, as requested)
        paper: "#FFFFFF", // cards, light surfaces
        cloud: "#E0FBFB", // app backdrop, pale cyan tint
        ember: "#FF69B4", // primary accent - outgoing bubbles, buttons
        "ember-dark": "#E14F9C",
        lagoon: "#00F0FF", // secondary accent
        teal: "#069494", // NEW - dark chat window / button background
        slate: "#6E6A75", // muted text
        moss: "#4CAF7D", // online indicator - status color, not a brand color
        mist: "#CBEFEF", // borders / dividers on light surfaces
      },
      fontFamily: {
        display: ["'Baloo 2'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
      },
      borderRadius: {
        bubble: "1.25rem",
      },
    },
  },
  plugins: [],
};
