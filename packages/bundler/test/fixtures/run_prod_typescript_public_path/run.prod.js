// @ts-check

const { Run } = require('../../../lib');

Run.production({
  root: process.cwd(),
})
  .then(() => {
    console.log('bundled worked');
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
