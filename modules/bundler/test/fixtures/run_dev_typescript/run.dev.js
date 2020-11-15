// @ts-check
/* eslint-disable */

const { Run } = require('../../../../../npm_target/run');

Run.development({
  root: process.cwd(),
  customEnv: 'test',
  loadConfigPathToFile: `${process.cwd()}/test.json`,
});
