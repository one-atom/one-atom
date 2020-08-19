export const recommended_prettier = {
  trailingComma: 'all',
  semi: true,
  singleQuote: true,
  printWidth: 135,
  useTabs: false,
  endOfLine: 'crlf',
};

export const recommended_eslint = {
  root: true,
  parser: '@typescript-eslint/parser', // Specifies the ESLint parser
  plugins: ['@typescript-eslint'],
  parserOptions: {
    ecmaVersion: 2020, // Allows for the parsing of modern ECMAScript features
    sourceType: 'module', // Allows for the use of imports
  },
  extends: [
    'eslint:recommended', // Basic config
    'plugin:@typescript-eslint/recommended', // Uses the recommended rules from @typescript-eslint/eslint-plugin
    'prettier/@typescript-eslint', // Uses eslint-config-prettier to disable ESLint rules from @typescript-eslint/eslint-plugin that would conflict with prettier
    'plugin:prettier/recommended', // Enables eslint-plugin-prettier and eslint-config-prettier. This will display prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.
  ],
  rules: {
    // Place to specify ESLint rules. Can be used to overwrite rules specified from the extended configs
    // ↓ ↓ ↓
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
