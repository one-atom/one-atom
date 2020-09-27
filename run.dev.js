/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */

//@ts-check
'use strict';
const inquirer = require('inquirer');
const { Run } = require('./packages/bundler/lib');

const package_choices = [
  {
    name: 'ui',
    value: 'ui',
  },
  {
    name: 'ui-std',
    value: 'ui-std',
  },
];

inquirer
  .prompt([
    {
      type: 'list',
      loop: false,
      name: 'pkg',
      message: 'Chose which package to run',
      choices: package_choices,
    },
  ])
  .then((answers) => {
    const run_path = `${process.cwd()}/packages/${answers.pkg}`;

    Run.development({
      hmr: true,
      parseWithBabel: true,
      root: run_path,
      customEnv: 'dev_env',
      loadConfigPathToFile: `${run_path}/env.json`,
    });
  });
