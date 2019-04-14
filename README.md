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
Install vue-router? 是否安装vue-router
Pick a css preprocessor? 选择一个css预处理器
Install Mockjs? 是否引入mockjs
Should we run npm install for you after the project has been created? (recommended) npm：是否帮你`npm install`
```

## 开始构建

在开始构建之前，我们需要安装一些npm包：

`chalk` ：彩色输出
`clear` ： 清空命令行屏幕
`clui` ：绘制命令行中的表格、仪表盘、加载指示器等。 
`figlet` ：生成字符图案
`inquirer` ：创建交互式的命令行界面
`minimist` ：解析参数
`configstore`：轻松加载和保存配置
`inquirer.js` 命令行用户界面


参考：
1. https://www.jianshu.com/p/095c968d406f 手把手教你使用nodejs编写cli(命令行)
2. https://www.jianshu.com/p/1c5d086c68fa  手把手教你写一个 Node.js CLI
3. https://github.com/allanguys/tg-cli
4. https://blog.csdn.net/qq_26733915/article/details/80461257
5. https://juejin.im/post/5c94fef7f265da60fd0c15e8 仿 vue-cli 搭建属于自己的脚手架
6. https://juejin.im/post/5b2872516fb9a00e8626e34f#heading-12
