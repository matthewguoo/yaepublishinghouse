/** @type {import('eslint').Linter.Config} */
module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'airbnb',
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:@next/next/recommended',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },

  // Only needed if you lint config files themselves:
  overrides: [
    {
      files: ['*.cjs', '.eslintrc.js'],
      env: { node: true },
      parserOptions: { sourceType: 'script' },
    },
  ],

  plugins: ['react'],

  rules: {
    /* ---------- stylistic rules relaxed ---------- */
    'arrow-parens': 'warn',
    'operator-linebreak': 'warn',
    'max-len': ['warn', { code: 120 }],
    'object-curly-newline': 'warn',
    'comma-dangle': 'warn',
    'react/jsx-one-expression-per-line': 'off',
    'react/jsx-indent': 'warn',
    'react/jsx-closing-tag-location' : 'warn',
    'no-multi-spaces': 'warn',
    'indent': ['warn', 2, { SwitchCase: 1 }],
    'lines-around-directive': 'warn',
    'react/jsx-filename-extension': ['warn', { extensions: ['.js', '.jsx'] }],
    'react/jsx-props-no-spreading': ['warn', { custom: 'ignore' }],
    'no-unused-vars': 'warn',
    'react/jsx-key' : 'warn',
    'react/self-closing-comp' : 'warn',
    'react/prop-types': 'off',
    'no-undef': 'error',
    'react/button-has-type': 'error',
    '@next/next/no-img-element': 'error',
    'import/prefer-default-export' : 'warn',
    'brace-style' : 'warn'
  },
};
