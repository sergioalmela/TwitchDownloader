const typescript = require("@typescript-eslint/eslint-plugin")
const parser = require("@typescript-eslint/parser")

module.exports = [
  {
    files: ["src/**/*.ts", "src/**/*.tsx"],
    languageOptions: {
      parser: parser,
      ecmaVersion: 2022,
      sourceType: "module",
    },
    plugins: {
      "@typescript-eslint": typescript,
    },
    rules: {
      ...typescript.configs.recommended.rules,
      ...typescript.configs["eslint-recommended"].rules,
    },
    linterOptions: {
      reportUnusedDisableDirectives: "warn",
    },
    ignores: ["**/node_modules/*"],
  },
]