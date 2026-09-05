/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#17151F",       // near-black, chat window background
        paper: "#FFFFFF",     // cards, light surfaces
        cloud: "#F1ECE1",     // app backdrop, warm neutral
        ember: "#F0703B",     // primary accent - outgoing bubbles, buttons
        "ember-dark": "#D9592A",
        lagoon: "#BFE1F0",    // secondary accent - incoming bubbles
        slate: "#6E6A75",     // muted text
        moss: "#4CAF7D",      // online indicator
        mist: "#E5E1D6",      // borders / dividers on light surfaces
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
}
