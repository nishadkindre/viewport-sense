module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'prettier', 'react-hooks'],
  extends: [
    'eslint:recommended',
    'prettier',
  ],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  env: {
    browser: true,
    es6: true,
    node: true,
    jest: true,
  },
  globals: {
    IntersectionObserverInit: 'readonly',
    IntersectionObserver: 'readonly',
    NodeListOf: 'readonly',
    ScrollToOptions: 'readonly',
    ScrollIntoViewOptions: 'readonly',
  },
  rules: {
    'prettier/prettier': 'error',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    'no-unused-vars': 'off',
  },
  overrides: [
    {
      files: ['**/react.ts', '**/react.tsx'],
      rules: {
        'react-hooks/rules-of-hooks': 'error',
        'react-hooks/exhaustive-deps': 'warn',
      },
    },
  ],
  ignorePatterns: ['dist/', 'node_modules/', '*.js'],
};