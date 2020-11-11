// @ts-check
/* eslint-disable */

const { Run } = require('../../../../../target/bundler/mod');

Run.development({
  root: process.cwd(),
  customEnv: 'test',
  loadConfigPathToFile: `${process.cwd()}/test.json`,
});
