#!/usr/bin/env node

const inquirer = require('../lib/inquirer');
const path = require('path');
const fs = require('fs-extra');
const ora = require('ora'); // 终端显示的转轮loading
const chalk = require('chalk');
const figlet = require('figlet');
const exec = require('promise-exec');
const currentPath = process.cwd();  // 当前目录路径
const templatePath = path.resolve(__dirname, '../template\/');

function handlePackageJson(config) {
    const spinner = ora('正在写入package.json...').start();
    const promise = new Promise((resolve, reject) => {
        const packageJsonPath = path.resolve(`${currentPath}/${config.projectName}`, 'package.json');
        fs.readJson(packageJsonPath, (err, json) => {
            if (err) {
                console.error(err);
            }
            json.name = config.projectName;
            json.description = config.description;
            json.author = config.author;
            if(config.cssPreprocessor == 'less') {
                json.devDependencies = Object.assign(json.devDependencies, { 
                    "less": "^3.9.0",
                    "less-loader": "^4.1.0"
                });
            } else {
                json.devDependencies = Object.assign(json.devDependencies, { 
                    "sass-loader": "^7.1.0",
                    "node-sass": "^4.11.0"
                });
            }
            fs.writeJSON(path.resolve(`${currentPath}/${config.projectName}/package.json`), json, err => {
                if (err) {
                    return console.error(err)
                }
                spinner.stop();
                ora(chalk.green('package.json 写入成功')).succeed();
                resolve();
            });
        });
    });
    return promise;
}

function handleWebpackBase(config) {
    const spinner = ora('正在写入webpack...').start();
    const promise = new Promise((resolve, reject) => {
        const webpackBasePath = path.resolve(`${currentPath}/${config.projectName}`, '_webpack/webpack.base.conf.js');
        fs.readFile(webpackBasePath, 'utf8', function(err, data) {
            if (err) {
                return console.error(err)
            }
            if(config.cssPreprocessor == 'scss') {
                data = data.replace("less-loader", "sass-loader");
            }
            fs.writeFile(path.resolve(`${currentPath}/${config.projectName}/_webpack/webpack.base.conf.js`), data, (err,result) => {
                if (err) {
                    return console.error(err)
                }
                spinner.stop();
                ora(chalk.green('webpack 写入成功')).succeed();
                resolve();
            })
        })
    });
    return promise;
}

function successConsole(config) {
    console.log('');
    const projectName = config.projectName;
    console.log(`${chalk.gray('项目路径：')} ${path.resolve(`${currentPath}/${projectName}`)}`);
    console.log(chalk.gray('接下来，执行：'));
    console.log('');
    console.log('      ' + chalk.green('cd ') + projectName);
    if(config.isNpmInstall != 'npm') {
        console.log('      ' + chalk.green('npm install'));
    }
    console.log('      ' + chalk.green('npm run dev --dirname=demo'));
    console.log('');
    console.log(chalk.green('enjoy coding ...'));
    console.log(
        chalk.green(figlet.textSync("webpack multi cli"))
    );
}


function createTemplate(config) {
    const projectName = config.projectName;
    const spinner = ora('正在生成...').start();
    fs.copy(path.resolve(templatePath), path.resolve(`${currentPath}/${projectName}`))
    .then(() => {
        spinner.stop();
        ora(chalk.green('目录生成成功！')).succeed();
        return handlePackageJson(config);
    })
    .then(() => {
        return handleWebpackBase(config);
    })
    .then(() => {
        if(config.isNpmInstall == 'npm') {
            const spinnerInstall = ora('安装依赖中...').start();
            if(config.cssPreprocessor == 'sass') {
                console.log('如果node-sass安装失败，请查看：https://github.com/sass/node-sass');
            }
            exec('npm install', {
                cwd: `${currentPath}/${projectName}`
            }).then(function(){
                console.log('')
                spinnerInstall.stop();
                ora(chalk.green('相赖安装成功！')).succeed();
                successConsole(config);
            }).catch(function(err) {
                console.error(err);
            });
        } else {
            successConsole(config);
        }
    })
    .catch(err => console.error(err))
}

const launch = async () => {
    const config = await inquirer.getQuestions();
    createTemplate(config);
}
launch();