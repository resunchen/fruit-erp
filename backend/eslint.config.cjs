const js = require('@eslint/js');
const tseslint = require('typescript-eslint');

module.exports = [
  {
    ignores: ['node_modules', 'dist'],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      'no-console': 'warn',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
        },
      ],
      indent: ['error', 2],
      'linebreak-style': ['error', 'unix'],
      quotes: [
        'error',
        'single',
        {
          avoidEscape: true,
        },
      ],
      semi: ['error', 'always'],
    },
  },
];
