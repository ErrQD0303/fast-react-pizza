/** @type {import('tailwindcss').Config} */
// eslint-disable-next-line
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    //override the default fontFamily system of Tailwind
    fontFamily: {
      // Create a new font's class called font-sans
      sans: "Roboto Mono, monospace",
    },
    //Extend the current Tailwind class
    extend: {
      // colors: {
      //   pizza: "#123456",
      // },
      // This is just for fun
      fontSize: {
        huge: ["80rem", { lineHeight: "1" }],
      },
      // Important for mobile browser
      height: {
        screen: "100dvh",
      },
    },
  },
  plugins: [],
};
