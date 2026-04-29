import typography from '@tailwindcss/typography';

export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      boxShadow: {
        soft: '0 25px 60px rgba(15, 23, 42, 0.08)',
      },
      backgroundImage: {
        hero: "url('https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1600&q=80')",
      },
    },
  },
  plugins: [typography],
};
