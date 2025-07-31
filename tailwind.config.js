/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#5E72E4",
        secondary: "#8392AB",
        accent: "#11CDEF",
        surface: "#FFFFFF",
        background: "#F4F5F7",
        success: "#2DCE89",
        warning: "#FB6340",
        error: "#F5365C",
        info: "#11CDEF"
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 2px 4px rgba(0,0,0,0.1)',
        'card': '0 4px 6px rgba(0,0,0,0.07)',
        'elevation': '0 8px 25px rgba(0,0,0,0.15)'
      }
    },
  },
  plugins: [],
}