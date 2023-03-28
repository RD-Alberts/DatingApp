/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {},
  },
  daisyui: {
    themes: [
        {
          mytheme: {
            "primary": "#FAC800",

            "secondary": "#F7D54D",

            "accent": "#EBEBEB",

            "neutral": "#44403c",

            "base-100": "#FFFFFF",

            "info": "#f59e0b",

            "success": "#16a34a",

            "warning": "#FAC800",

            "error": "#E60400",
          },
        },
        {
          dark: {
            "primary": "#FAC800",

            "secondary": "#F7D54D",

            "accent": "#EBEBEB",

            "neutral": "#44403c",

            "base-100": "#1f1f1f",

            "info": "#f59e0b",

            "success": "#16a34a",

            "warning": "#FAC800",

            "error": "#E60400",
          }
        },
    ],
  },
  plugins: [require("daisyui")],
}
