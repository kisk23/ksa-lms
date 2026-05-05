/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: ['../../packages/config/eslint/nestjs.js'],
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  settings: {
    'import/resolver': {
      typescript: {
        project: './tsconfig.json',
      },
    },
  },
  rules: {
    // Prisma-generated files use named exports heavily
    'import/no-cycle': 'off',
  },
};
