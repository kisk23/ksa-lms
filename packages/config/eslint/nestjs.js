const base = require('./index.js');

/** @type {import("eslint").Linter.Config} */
const config = {
  ...base,
  env: {
    ...base.env,
    node: true,
  },
  rules: {
    ...base.rules,
    // ─── NestJS / Node ───────────────────────────
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
    // Allow decorators to use classes with side effects
    '@typescript-eslint/no-extraneous-class': 'off',
    // NestJS uses constructor injection which requires this
    '@typescript-eslint/no-useless-constructor': 'off',
    // Allow console in Node/backend context
    'no-console': 'off',
    // Enforce no floating promises (important in async NestJS services)
    '@typescript-eslint/no-floating-promises': 'warn',
    '@typescript-eslint/await-thenable': 'error',
  },
  parserOptions: {
    project: ['./tsconfig.json'],
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
};

module.exports = config;
