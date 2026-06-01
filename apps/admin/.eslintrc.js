/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,

  extends: ['../../packages/config/eslint/nextjs.js'],

  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
  },
  settings: {
    'import/resolver': {
      typescript: {
        project: './tsconfig.json',
      },
    },
    next: {
      rootDir: __dirname,
    },
  },
  rules: {
    // Specific overrides for the admin dashboard
    'no-console': ['warn', { allow: ['warn', 'error'] }],
  },
};
