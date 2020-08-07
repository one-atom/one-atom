// @ts-check
/* eslint-disable */

const { Run } = require('../../../lib');

Run.production({
  parseWithBabel: true,
  root: process.cwd(),
})
  .then(() => {
    console.log('bundled worked');
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
