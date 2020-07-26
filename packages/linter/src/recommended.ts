export const recommended = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  rules: {
    // Allows the namespace usage
    '@typescript-eslint/no-namespace': 0,

    // Allows blocked-scoped functions (as in namespaces)
    'no-inner-declarations': 0,

    // Allows namespace imports to not report incorrect unused error (TypeScript
    // language server will warn instead)
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': 0,

    // Ensures consistencies with blank lines
    'padding-line-between-statements': [
      'error',
      // Ensures returns have a blank line before them
      { blankLine: 'always', prev: '*', next: 'return' },
      // Ensures blocks have a blank line after declaration
      { blankLine: 'always', prev: 'block-like', next: '*' },
    ],
  },
};
