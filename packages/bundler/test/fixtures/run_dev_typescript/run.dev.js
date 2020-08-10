// @ts-check
/* eslint-disable */

const { Run } = require('../../../lib');

Run.development({
  root: process.cwd(),
  customEnv: 'test',
  loadConfigPathToFile: `${process.cwd()}/test.json`,
});
