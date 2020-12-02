/* eslint-disable */

module.exports = {
  preset: 'ts-jest',
  testMatch: ['**/*.test.(ts|tsx)'],
  testPathIgnorePatterns: ['/node_modules/', '/cypress/'],
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.test.json',
    },
  },
};
