module.exports = {
  root: false,
  env: {
    node: true
  },
  'extends': [
    'plugin:vue/recommended',
    '@vue/airbnb'
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'semi': 0,
    'object-curly-newline': 0,
    'comma-dangle': 0
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
};
