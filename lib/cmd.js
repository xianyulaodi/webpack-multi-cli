#!/usr/bin/env node

const program = require("commander");
let projectName = null;

// 定义指令
program
  .version(require('../package.json').version)
  .command('init <name>')
  .action(function (name) {
    projectName = name;
  });
  program.parse(process.argv);
  program.projectName = projectName;

  if (!projectName) {
    console.error('no project name was given, eg: webpack-multi-cli init myProject');
    process.exit(1);
 }

  module.exports = program;
