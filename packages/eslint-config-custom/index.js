/* eslint-disable */
const project = require("tsconfig/vite.json");

module.exports = {
  env: {
    node: true,
    browser: true,
  },
  parser: "@typescript-eslint/parser",
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:jsx-a11y/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "prettier",
  ],
  parserOptions: {
    sourceType: "module",
    ecmaVersion: 2020,
    project,
  },
  plugins: ["@typescript-eslint", "jsx-a11y"],
  settings: {
    react: {
      version: "detect",
    },
  },
  rules: {
    "@typescript-eslint/no-empty-function": 1,
    "@typescript-eslint/no-non-null-assertion": "off",
    "no-plusplus": ["error", { allowForLoopAfterthoughts: true }],
    "no-restricted-exports": "off",
    "no-underscore-dangle": "warn",
    "no-await-in-loop": "warn",
    "no-param-reassign": ["error", { props: false }],
    "no-empty-function": "off",

    "react/prop-types": 0,
    "react/react-in-jsx-scope": 0,
    "react/jsx-filename-extension": [1, { extensions: [".tsx", ".jsx"] }],

    "jsx-a11y/click-events-have-key-events": "warn",
    "jsx-a11y/no-static-element-interactions": "warn",
    "jsx-a11y/no-autofocus": "warn",
    "jsx-a11y/img-redundant-alt": "warn",
  },
};
