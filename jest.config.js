/* eslint-disable */

module.exports = {
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  transform: {
    '\\.jsx?$': 'babel-jest',
    '\\.tsx?$': 'ts-jest',
  },
  testMatch: ['**/__tests__/**/*.test.*', '**/test/**/*.test.*'],
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.test.json',
    },
  },
  transformIgnorePatterns: ['node_modules/(?!@ngrx|(?!deck.gl)|ng-dynamic)'],
};
