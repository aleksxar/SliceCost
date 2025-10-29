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
        'dark-bg': '#111827',
        'dark-card': '#1f2937',
        'dark-border': '#374151',
        'dark-gray': '#374151',
        
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
