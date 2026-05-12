const tseslint = require("typescript-eslint");

module.exports = tseslint.config(
  {
    ignores: ["dist/**", "node_modules/**", "examples/**", "src/**/*.js"],
  },
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      parserOptions: {
        project: "./tsconfig.json",
      },
    },
  }
);
