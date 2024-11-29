/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        opensans: ["Open Sans", "sans-serif"],
        poppins: ["Poppins", "sans-serif"],
      },
      colors: {
        transparent: "transparent",
        current: "currentColor",
        colorPrimary: "#006A67",
        colorPrimaryHover: "#029C97FF",
        colorGray: "#F5F5F5",
        colorRed: "#C30222",
      },
    },
  },
  plugins: [],
};
