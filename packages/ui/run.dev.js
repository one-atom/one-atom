//@ts-check
/* eslint-disable */

const { Run } = require('@kira/bundler');

process.env.PORT = '8001';

Run.development({
  hmr: true,
  parseWithBabel: true,
  root: process.cwd(),
});
