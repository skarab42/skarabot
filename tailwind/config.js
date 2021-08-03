module.exports = {
  purge: {
    enabled: true,
    content: ["./client/**/*.{js,svelte}", "./public/**/*.{html,svg}"],
  },
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
