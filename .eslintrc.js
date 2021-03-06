module.exports = {
  env: {
    browser: false,
    node: true,
    es2020: true,
  },
  extends: ['airbnb-typescript/base'],
  rules: {
    'import/no-unresolved': 'off',
    'import/prefer-default-export': 'off',
    'import/no-cycle': 'warn',
    'import/extensions': 'off',
    '@typescript-eslint/no-unused-vars': 'warn',
    'arrow-parens': ['error', 'as-needed'],
    'no-console': 'off',
    'max-len': 'warn',
    'no-underscore-dangle': 'off',
    '@typescript-eslint/no-unused-vars': 'off'
  },
  parserOptions: {
    project: './tsconfig.json'
  }
};