/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        rethink: ["RethinkSans"],
        "rethink-medium": ["RethinkSans-Medium"],
        "rethink-semibold": ["RethinkSans-SemiBold"],
        "rethink-bold": ["RethinkSans-Bold"],
        "rethink-extrabold": ["RethinkSans-ExtraBold"],
      },
      colors: {
        primary: "#880000",
        secondary: "#205090",
      },
    },
  },
  plugins: [],
}

