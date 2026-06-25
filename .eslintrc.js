module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: "module",
    project: "./tsconfig.json",
  },
  plugins: ["@typescript-eslint"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
  ],
  rules: {
    // Allow unused vars prefixed with _ (useful for DSA solutions)
    "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    // Allow explicit any in solutions where intentional
    "@typescript-eslint/no-explicit-any": "warn",
    // Allow non-null assertions in solutions (sometimes intentional)
    "@typescript-eslint/no-non-null-assertion": "warn",
    // Keep console.log allowed (used in output-prediction questions)
    "no-console": "off",
  },
  env: {
    node: true,
    es2022: true,
  },
  ignorePatterns: ["dist/", "node_modules/", "*.js", "!.eslintrc.js", "!jest.config.js"],
};
