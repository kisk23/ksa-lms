/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: ['@lms/config/eslint'],
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
  },
};
