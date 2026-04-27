/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  // Only runs on files not covered by app-level configs
  extends: ['@lms/config/eslint'],
  ignorePatterns: [
    '**/node_modules/**',
    '**/dist/**',
    '**/.next/**',
    '**/.turbo/**',
    '**/coverage/**',
    '**/*.min.js',
  ],
};
