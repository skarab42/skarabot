module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
    node: true,
  },
  plugins: ["svelte3", "prettier"],
  extends: ["eslint:recommended", "plugin:prettier/recommended"],
  overrides: [
    {
      files: ["**/*.svelte"],
      processor: "svelte3/svelte3",
    },
  ],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: "module",
  },
  rules: {
    "no-console": "warn",
    "no-debugger": "warn",
  },
  globals: {
    Twitch: true,
    PerspectiveTransform: true,
  },
};
