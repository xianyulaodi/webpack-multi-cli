#!/usr/bin/env node

const inquirer = require('../lib/inquirer');
const path = require('path');
const fs = require('fs-extra');
const ora = require('ora'); // 终端显示的转轮loading
const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');
var exec = require('promise-exec');
const currentPath = process.cwd();  // 当前目录路径
const templatePath = path.resolve(__dirname, '../template\/');

const launch = async () => {
    const config = {
        projectName: 'test',
        description: 'A webpack-multi project',
        author: '',
        isNeedVueRouter: true,
        cssPreprocessor: 'scss',
        isNeedMockjs: true,
        isNpmInstall: ''
    }
    createTemplate(config);
    // const config = await inquirer.getQuestions();

    // console.log(config);
}
launch();

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
            if (config.isNeedMockjs) {
                json.devDependencies = Object.assign(json.devDependencies, { "mockjs": "^1.0.1-beta3" });
            }
            if(config.cssPreprocessor == 'less') {
                json.devDependencies = Object.assign(json.dependencies, { 
                    "less": "^3.9.0",
                    "less-loader": "^4.1.0"
                });
            } else {
                json.devDependencies = Object.assign(json.dependencies, { 
                    "sass-loader": "^7.1.0"
                });
            }
            if (config.isNeedVueRouter) {
                json.dependencies = Object.assign(json.dependencies, { "vue-router": "^3.0.2" });
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
    const spinner = ora('正在生成...').start();
    const projectName = config.projectName;
    // if (fs.pathExistsSync(path.resolve(currentPath, `${projectName}`))) {
    //     console.log(chalk.red(`您创建的项目名:${projectName}已存在，创建失败，请修改项目名后重试`));
    //     process.exit(1);
    //     return; 
    // } else {
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
    // }
}