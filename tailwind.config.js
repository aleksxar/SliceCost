/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#6b7280',
        'primary-hover': '#4b5563',
        secondary: '#9ca3af',
        
        // Greyscale colors only
        'dark-bg': '#181818',
        'dark-card': '#2d2d2d',
        'dark-border': '#818181',
        'dark-gray': '#383838',
        
        // Text colors
        'dark-text': '#f9fafb',
        'dark-secondary': '#9ca3af',
      },
      spacing: {
        'section': '2rem',
      },
      borderRadius: {
        'container': '0.5rem',
      },
    },
  },
  plugins: [],
}
