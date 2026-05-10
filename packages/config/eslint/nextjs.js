const base = require('./index.js');

/** @type {import("eslint").Linter.Config} */
const config = {
  ...base,
  extends: [
    ...base.extends.filter((item) => !item.startsWith('plugin:import/')),
    'plugin:react/recommended',
    'next/core-web-vitals',
  ],
  plugins: [...base.plugins, 'react'],
  env: {
    ...base.env,
    browser: true,
  },
  settings: {
    ...base.settings,
    react: {
      version: 'detect',
    },
  },
  rules: {
    ...base.rules,
    // ─── React ───────────────────────────────────
    'react/react-in-jsx-scope': 'off', // Not needed with React 17+ JSX transform
    'react/prop-types': 'off', // We use TypeScript for prop validation
    'react/display-name': 'warn',
    'react/no-unescaped-entities': 'warn',
    'react/jsx-curly-brace-presence': ['error', { props: 'never', children: 'never' }],
    'react/self-closing-comp': 'error',
    // ─── React Hooks ─────────────────────────────
    // ─── Next.js ─────────────────────────────────
    '@next/next/no-html-link-for-pages': 'error',
  },
};

module.exports = config;
