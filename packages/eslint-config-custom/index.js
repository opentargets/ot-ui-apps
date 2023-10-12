module.exports = {
  env: {
    node: true,
    browser: true,
  },
  parser: "@typescript-eslint/parser",
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier",
  ],
  plugins: ["@typescript-eslint"],
  parserOptions: {
    sourceType: "module",
    ecmaVersion: 2020,
  },
  settings: {
    react: {
      version: "detect",
    },
  },
  rules: {
    "@typescript-eslint/no-non-null-assertion": "off",
    "no-plusplus": ["error", { allowForLoopAfterthoughts: true }],
    "no-restricted-exports": "off",
    "no-underscore-dangle": "warn",
    "no-await-in-loop": "warn",
    "no-param-reassign": ["error", { props: false }],
    "no-empty-function": "off",
    "@typescript-eslint/no-empty-function": 1,

    "react/prop-types": 0,
    "react/react-in-jsx-scope": 0,
    "react/jsx-filename-extension": [1, { extensions: [".tsx", ".jsx"] }],
  },
};
