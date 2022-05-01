module.exports = {
  parserOptions: {
    project: './tsconfig.json',
  },
  extends: [
    './node_modules/ts-standard/eslintrc.json',
  ],
  rules: {
    'comma-dangle': [
      2,
      'always-multiline',
    ],
  },
}