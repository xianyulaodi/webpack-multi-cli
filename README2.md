[基于webpack4.x项目实战1-简单使用](https://juejin.im/post/5c7a9f27f265da2dca387dc9)

[基于webpack4.x项目实战2 - 配置一次,多个项目运行](https://juejin.im/post/5ca773106fb9a05e4a6037ae)

<br>
<br>

## 前言

> 之前写过webpack-multi的配置，css预处理器用的是less，今天我们继续这个系列的文章，来写一个cli工具。所以本文其实不属于webpack的范畴，而是教你写一个属于自己的cli工具，只是它是基于前面的两篇文章来写的，所以归入这个系列里。

我们参考一下vue-cli，来学习一下怎么写cli工具。

我们先来看看`vue-cli`的使用方法：

1. `npm install -g vue-cli`
2. `vue init webpack test` test为你的项目名
然后会出现一些配置的问答
```bash
Project name test： 项目名称,如果不改，就直接原来的test名称
Project description A Vue.js project： 项目描述，也可直接点击回车，使用默认名字
Author： 作者
Vue build standalone：
Install vue-router? 是否安装vue-router
Use ESLint to lint your code? 是否使用ESLint管理代码
Pick an ESLint preset Standard： 选择一个ESLint预设，编写vue项目时的代码风格
Set up unit tests Yes： 是否安装单元测试
Pick a test runner jest
Setup e2e tests with Nightwatch?  是否安装e2e测试
Should we run npm install for you after the project has been created? (recommended) npm：是否帮你`npm install`
```

参考`vue-cli`,我们的这个脚手架叫`webpack-multi-cli`,是基于[基于webpack4.x项目实战2 - 配置一次,多个项目运行](https://juejin.im/post/5ca773106fb9a05e4a6037ae)这个demo来构建的。

完成后，我们的命令也和`vue-cli`类似
1. 安装`npm install -g webpack-multi-cli`
2. 使用`npm init project-name`,然后会出现以下配置选择
```bash
Project name: 项目名称,如果不改，则为npm init时的项目名
Project description A webpack-multi project： 项目描述，也可直接点击回车，使用默认名字
Author： 作者
Pick a css preprocessor? 选择一个css预处理器，可选择是less或者是sass
Should we run npm install for you after the project has been created? (recommended) npm：是否帮你`npm install`,如果输入npm命令，则帮你执行npm install
```

## 开始构建

在开始构建之前，我们需要安装一些npm包：

`chalk` ：彩色输出    
`figlet` ：生成字符图案  
`inquirer` ：创建交互式的命令行界面,就是这些问答的界面  
`inquirer` 命令行用户界面  
`commander` 自定义命令  
`fs-extra`  文件操作  
`ora`  制作转圈效果  
`promise-exec` 执行子进程  


#### 编写package.json文件

看看我们最终的package.json文件

```javascript
{
  "name": "webpack-multi-cli",
  "version": "1.0.0",
  "description": "create webpack-multi cli",
  "main": "index.js",
  "bin": {
    "webpack-multi-cli": "bin/index.js"
  },
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/xianyulaodi/webpack-multi-cli.git"
  },
  "author": "xianyulaodi",
  "license": "MIT",
  "bugs": {
    "url": "https://github.com/xianyulaodi/webpack-multi-cli/issues"
  },
  "dependencies": {
    "chalk": "^2.4.2",
    "commander": "^2.20.0",
    "figlet": "^1.2.1",
    "fs-extra": "^7.0.1",
    "inquirer": "^5.2.0",
    "ora": "^3.4.0",
    "promise-exec": "^0.1.0"
  },
  "homepage": "https://github.com/xianyulaodi/webpack-multi-cli#readme"
}
```

我们的入口文件为`bin/index.js`,类似于`vue-cli init 项目名`，我们一开始的命令为：`webpack-multi-cli init 项目名`，因此package.json的bin需要这样写

```javascript
...
"bin": {
   "webpack-multi-cli": "bin/index.js"
}
..
```

#### 编写init命令

接下来编写自定义的init命令，依赖于commander这个库
lib/cmd.js

```javascript
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

```
如果没有传入项目名，或者传入的项目名称已经存在，则抛出异常，并结束程序，顺便把项目名称存起来,当做一个默认名称。还记得我们的命令不，
```javascript
Project name test： // 项目名称,如果不改，就直接原来的test名称
```
这个默认的项目名称就是这里来的

#### 编写交互问题

这里依赖于`inquirer`这个库

lib/inquirer.ja

```javascript
const inquirer = require('inquirer');
const cmd = require('./cmd');
const projectName = cmd.projectName;

module.exports = {

    getQuestions: () => {

        const questions = [
            {
                name: 'projectName',
                type: 'input',
                message: 'Project name',
                default: projectName
            },
            {
                name: 'description',
                type: 'input',
                message: `Project description`,
                default: 'A webpack-multi project'
            },
            {
                name: 'author',
                type: 'input',
                message: `Author`,
            },
            {
                name: 'cssPreprocessor',
                type: 'list',
                message: 'Pick an css preprocessor',
                choices: [
                    "less",
                    "sass"
                ]
            },
            {
                name: 'isNpmInstall',
                type: 'input',
                message: 'Should we run `npm install` for you after the project has been create?<recommended>',
            }
        ];
        return inquirer.prompt(questions);
    },
}
```
主要就是我们的一些交互问题，具体这个库的用法，可以google之

#### 主文件

bin/index.js

我们这边的思路是，新建一个template目录，用来存在我们的webpack配置模板，将你输入的那些问题，比如项目名，作者、描述、选择less还是sass等，写入这些配置文件中，然后再下载到你执行命令的根目录下

还有一种思路是获取你回到的交互问题，然后从github中获取文件，再下载到你执行命令的根目录下

知道这个思路后，就比较简单了

先来获取你输入命令的当前路径
```javascript
const currentPath = process.cwd();  // 当前目录路径
```

获取输入的交互问题
```javascript
const config = await inquirer.getQuestions();
```

接下来，就将获取的交互问题答案，写入我们的模板中即可

* 写入package.json
```javascript
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
```

* 写入webpack配置

webpack的交互问题比较简单，就是选择less还是sass，默认为less
```javascript
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
```

完整的主文件bin/index.js
```javascript
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
```

最后，将我们的脚手架发布到npm即可，关于npm包的发布即可，很早之前写过一篇文件，可以点击查看[如何写一个npm包](https://xianyulaodi.github.io/2018/02/25/如何写一个npm包/)

我们的包已经发布成功 https://www.npmjs.com/package/webpack-multi-cli 

接下来全局安装一下
`npm install webpack-multi-cli -g`

使用`webpack init myTest`，如下图所示：

![](https://user-gold-cdn.xitu.io/2019/4/28/16a64a50d92d6584?w=480&h=275&f=png&s=55898)

至此，我们的webpack-multi-cli脚手架就完成了，比较简单，当然跟vue-cli是没法比的，不过基本思路就在这里，如果想搞复杂一点的脚手架，其实也就是一个扩展而已。

通过这篇文章，希望你可以学习到如何写一个属于自己的脚手架，了解到类似于vue-cli的基本思路，希望你能有些许的收获









