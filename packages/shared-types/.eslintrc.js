/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: ['../config/eslint/index.js'],
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
  },
};
