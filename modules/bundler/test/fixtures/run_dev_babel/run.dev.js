// @ts-check
/* eslint-disable */

const { Run } = require('../../../../../target/bundler/mod');

Run.development({
  hmr: true,
  parseWithBabel: true,
  root: process.cwd(),
  customEnv: 'test',
  loadConfigPathToFile: `${process.cwd()}/test.json`,
});
