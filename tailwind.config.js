/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      slideUp: {
        "0%": { transform: "translateY(100%)", opacity: "0" },
        "100%": { transform: "translateY(0)", opacity: "1" },
      },
      scaleIn: {
        "0%": { transform: "scale(0.5)", opacity: "0" },
        "80%": { transform: "scale(1.1)" },
        "100%": { transform: "scale(1)", opacity: "1" },
      },
      fadeIn: {
        "0%": { opacity: "0" },
        "100%": { opacity: "1" },
      },
    },
    animation: {
      slideUp: "slideUp 0.4s ease-out",
      scaleIn: "scaleIn 0.3s ease-out",
      fadeIn: "fadeIn 0.3s ease-out forwards",
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
