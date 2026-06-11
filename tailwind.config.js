/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ks: {
          green: '#007A43',
          'green-dark': '#005c32',
          'green-light': '#e6f3ec',
          orange: '#FF8A00',
          'orange-dark': '#cc6e00',
          'orange-light': '#fff3e0',
          'gray-light': '#F5F7F8',
          'gray-medium': '#D9D9D9',
          'gray-dark': '#4A4A4A',
          danger: '#DC3545',
          'danger-light': '#fdecea',
          warning: '#FFC107',
          success: '#28A745',
          'success-light': '#e9f7ec',
        },
      },
      borderRadius: { card: '12px' },
      boxShadow: {
        card: '0 2px 8px rgba(0,0,0,0.08)',
        'card-hover': '0 4px 16px rgba(0,0,0,0.12)',
      },
    },
  },
  plugins: [],
};

