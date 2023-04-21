module.exports = {
  // Global ESLint Settings
  // =================================
  root: true,
  env: {
    browser: true,
    es6: true,
    node: true,
    jest: true,
  },
  ignorePatterns: ['cypress/*'],
  settings: {
    react: {
      version: 'detect',
    },
    'import/resolver': {
      typescript: {},
      'babel-module': {
        root: ['.'],
        alias: {
          '~/static': './public/static/',
          '~': './',
        },
      },
    },
  },

  // ===========================================
  // Set up ESLint for .js / .jsx files
  // ===========================================
  // .js / .jsx uses babel-eslint
  parser: '@babel/eslint-parser',
  parserOptions: {
    requireConfigFile: false,
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
    babelOptions: {
      babelrc: false,
      configFile: false,
      // your babel options
      presets: ['@babel/preset-react'],
    },
  },

  // Plugins
  // =================================
  plugins: ['jsx-a11y'],

  // Extend Other Configs
  // =================================
  extends: [
    'eslint:recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:react-hooks/recommended',
    'plugin:react/recommended',
    // Disable rules that conflict with Prettier
    // Prettier must be last to override other configs
    'prettier',
  ],
  rules: {
    'react/function-component-definition': 0,
    'react/boolean-prop-naming': 0,
    'react/prop-types': 0,
    'react-hooks/exhaustive-deps': 1,
    'react/react-in-jsx-scope': 0,
    'no-unused-vars': 1,
    'react/display-name': [0],
  },

  // =================================
  // Overrides for Specific Files
  // =================================
  overrides: [
    // Match TypeScript Files
    // =================================
    {
      files: ['**/*.{ts,tsx}'],

      // Global ESLint Settings
      // =================================
      env: {
        jest: true,
      },
      globals: {
        React: 'writable',
      },
      settings: {
        'import/parsers': {
          '@typescript-eslint/parser': ['.ts', '.tsx'],
        },
        'import/resolver': {
          typescript: {
            project: './tsconfig.json',
          },
        },
      },

      // Parser Settings
      // =================================
      // allow ESLint to understand TypeScript syntax
      // https://github.com/iamturns/eslint-config-airbnb-typescript/blob/master/lib/shared.js#L10
      parser: '@typescript-eslint/parser',
      parserOptions: {
        // Lint with Type Information
        // https://github.com/typescript-eslint/typescript-eslint/blob/master/docs/getting-started/linting/TYPED_LINTING.md
        tsconfigRootDir: __dirname,
        project: './tsconfig.json',
      },

      // Plugins
      // =================================
      plugins: ['jsx-a11y'],

      // Extend Other Configs
      // =================================
      extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
        'plugin:react/recommended',
        'plugin:import/errors',
        'plugin:import/warnings',
        'plugin:import/typescript',
        'plugin:react-hooks/recommended',
        'prettier',
      ],
      rules: {
        'react/react-in-jsx-scope': 'off',
        'react/prop-types': [0],
        // temp allowing during TS migration
        '@typescript-eslint/ban-ts-comment': [
          'error',
          {
            'ts-ignore': 'allow-with-description',
            minimumDescriptionLength: 4,
          },
        ],
      },
    },
  ],
};
