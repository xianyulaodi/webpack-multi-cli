#!/usr/bin/env node

const inquirer = require('../lib/inquirer');
const path = require('path');
const fs = require('fs-extra');

const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');
const currentPath = process.cwd();  // 当前目录路径
const templatePath = path.resolve(__dirname, '../template\/');

console.log(111, currentPath);

const launch = async () => {
    const config = await inquirer.getQuestions();
    console.log(config);
}
launch();

/*
思路：
1. 其实需要改的就几个文件： package.json
2. webpack.base.conf.js
3. demo
所以先读这几个文件，再进行修改
*/
function handlePackageJson(config) {
    const packageJsonPath = `${templatePath}/package.json`;
    fs.readJson(packageJsonPath, (err, json) => {
        if (err) {
            console.error(err);
        } 
        json.name = config.projectName;
        json.description = config.description;
        json.author = config.author;
        if(config.isNeedMockjs) {
            
        }
        fs.writeJson(path.resolve(`${currentPath}/${config.projectName}/package.json`), {name: 'fs-extra'}, err => {
            if (err) { 
                return console.error(err) 
            }
            console.log('success!')
        })
    })
}

function createTemplate(config) {
    const projectName = config.projectName;
    if (fs.pathExistsSync(path.resolve(currentPath, `/${projectName}`))) {
        throw console.error('您创建的文件名已存在');
    }
    fs.copy('/tmp/myfile', '/tmp/mynewfile')
        .then(() => console.log('success!'))
        .catch(err => console.error(err))
    //   const copyFiles = fs
}

/*
clear();
console.log(
    chalk.yellow(
        figlet.textSync('multi-cli', { horizontalLayout: 'full' })
    )
);
*/