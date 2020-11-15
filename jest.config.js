/* eslint-disable */

module.exports = {
  preset: 'ts-jest',
  transform: {
    '\\.tsx?$': 'ts-jest',
  },
  testMatch: ['**/*.test.(ts|tsx)'],
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.test.json',
    },
  },
};
