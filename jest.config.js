/* eslint-disable */

module.exports = {
  preset: 'ts-jest',
  testPathIgnorePatterns: ['/node_modules/', '/cypress/'],
  testMatch: ['<rootDir>/modules/**/*.test.{ts,tsx}'],
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.test.json',
    },
  },
};
