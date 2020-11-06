import { recommended_eslint, recommended_prettier } from './recommended';

export const react_prettier = {
  ...recommended_prettier,
  // jsx specific
  jsxBracketSameLine: false,
  jsxSingleQuote: true,
};

export const react_eslint = {
  ...recommended_eslint,
  settings: {
    react: {
      version: 'detect', // Tells eslint-plugin-react to automatically detect the version of React to use
    },
  },
  parserOptions: {
    ...recommended_eslint.parserOptions,
    ecmaFeatures: {
      jsx: true, // Allows for the parsing of JSX
    },
  },
  extends: ['plugin:react/recommended', 'plugin:react-hooks/recommended', 'plugin:jsx-a11y/strict', ...recommended_eslint.extends],
  rules: {
    ...recommended_eslint.rules,
    'react/prop-types': 0, // Disabled since TypeScript will validate these
  },
};
