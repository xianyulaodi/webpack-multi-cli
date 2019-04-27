# webpack-multi-cli

[基于webpack4.x项目实战1-简单使用](https://juejin.im/post/5c7a9f27f265da2dca387dc9)

[基于webpack4.x项目实战2 - 配置一次,多个项目运行](https://juejin.im/post/5ca773106fb9a05e4a6037ae)

<br>
<br>

## 前言

之前写过webpack-multi的配置，css预处理器用的是less，今天我们继续这个系列的文章，来写一个cli工具。所以本文其实不属于webpack的范畴，而是教你写一个属于自己的cli工具，只是它是基于前面的两篇文章来写的，所以归入这个系列里。

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

参考`vue-cli`,我们的这个cli叫`webpack-multi-cli`,是基于[基于webpack4.x项目实战2 - 配置一次,多个项目运行](https://juejin.im/post/5ca773106fb9a05e4a6037ae)这个demo来构建的。

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










参考：
1. https://www.jianshu.com/p/095c968d406f 手把手教你使用nodejs编写cli(命令行)
2. https://www.jianshu.com/p/1c5d086c68fa  手把手教你写一个 Node.js CLI
3. https://github.com/allanguys/tg-cli
4. https://blog.csdn.net/qq_26733915/article/details/80461257
5. https://juejin.im/post/5c94fef7f265da60fd0c15e8 仿 vue-cli 搭建属于自己的脚手架
6. https://juejin.im/post/5b2872516fb9a00e8626e34f#heading-12
