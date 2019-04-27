#!/usr/bin/env node

const program = require("commander");
const path = require('path');
const currentPath = process.cwd();  // 当前目录路径
const fs = require('fs-extra');
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

if (fs.pathExistsSync(path.resolve(currentPath, `${projectName}`))) {
  console.error(`您创建的项目名:${projectName}已存在，创建失败，请修改项目名后重试`);
  process.exit(1);
}

module.exports = program;
