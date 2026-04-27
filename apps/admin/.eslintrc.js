/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: ['@lms/config/eslint/nextjs'],
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
  },
  rules: {
    // Specific overrides for the admin dashboard
    'no-console': ['warn', { allow: ['warn', 'error'] }],
  },
};
