/* eslint-disable */

module.exports = {
  preset: 'ts-jest',
  testMatch: ['**/*.test.(ts|tsx)'],
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.test.json',
    },
  },
};
