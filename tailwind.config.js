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
        primary: '#3b82f6',
        'primary-hover': '#2563eb',
        secondary: '#6b7280',
        
        // Dark mode specific colors
        'dark-primary': '#8ea5ff',
        'dark-primary-hover': '#5a79ff',
        
        // Backgrounds
        'dark-bg': '#1a1a1a',
        'dark-card': '#242424',
        'dark-border': '#333',
        'dark-gray': '#333',
        
        // Text colors
        'dark-text': '#f0f0f0',
        'dark-secondary': '#a0a0a0',
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
+++++++
REPLACE
