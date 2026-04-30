/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,

  extends: ['./packages/config/eslint/index.js'],

  rules: {
    // 🔥 FORCE disable (overrides everything below)
    '@typescript-eslint/prefer-nullish-coalescing': 'off',
    '@typescript-eslint/prefer-optional-chain': 'off',

    // 🔥 Kill Next.js rule globally
    '@next/next/no-html-link-for-pages': 'off',
  },

  ignorePatterns: [
    '**/node_modules/**',
    '**/dist/**',
    '**/.next/**',
    '**/.turbo/**',
    '**/coverage/**',
    '**/*.min.js',
  ],
};
