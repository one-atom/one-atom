// @ts-check
/* eslint-disable */

try {
  const { Run } = require('../../npm_target/run');

  Run.development({
    hmr: true,
    root: process.cwd(),
  });
} catch (error) {
  if (error.code === 'MODULE_NOT_FOUND') {
    console.error(`
You'll need to build One Atom first, run the npm build script at root.
    `);
  } else {
    console.error(error);
  }
}
