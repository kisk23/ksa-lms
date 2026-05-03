/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: [require.resolve('@lms/config/eslint/nextjs')],
  ignorePatterns: ['.eslintrc.js', 'postcss.config.mjs'],
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
