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
        secondary: '#636363ff',
        
        // Greyscale colors only
        'dark-bg': '#181818',
        'dark-card': '#1c1c1cff',
        'dark-border': '#6c6c6cff',
        'dark-gray': '#343434',
        
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
