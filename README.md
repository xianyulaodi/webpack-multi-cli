# webpack-multi-cli

[基于webpack4.x项目实战1-简单使用](https://juejin.im/post/5c7a9f27f265da2dca387dc9)

[基于webpack4.x项目实战2 - 配置一次,多个项目运行](https://juejin.im/post/5ca773106fb9a05e4a6037ae)

<br>
<br>

之前写过webpack-multi的配置，不过这个配置是基于Vue的，而且css预处理器用的是less，今天我们继续这个系列的文章，来写一个cli工具，让我们可以生成是基于Vue还是react，CSS预处理器用less还是scss，主要目的不是学webpack，而且学习如何写自己的cli工具。

一些npm包
chalk ：彩色输出
clear ： 清空命令行屏幕
clui ：绘制命令行中的表格、仪表盘、加载指示器等。
figlet ：生成字符图案
inquirer ：创建交互式的命令行界面
minimist ：解析参数
configstore：轻松加载和保存配置
inquirer.js — 命令行用户界面


参考：
1. https://www.jianshu.com/p/095c968d406f 手把手教你使用nodejs编写cli(命令行)
2. https://www.jianshu.com/p/1c5d086c68fa  手把手教你写一个 Node.js CLI
3. https://github.com/allanguys/tg-cli
4. https://blog.csdn.net/qq_26733915/article/details/80461257
5. https://juejin.im/post/5c94fef7f265da60fd0c15e8 仿 vue-cli 搭建属于自己的脚手架
6. https://juejin.im/post/5b2872516fb9a00e8626e34f#heading-12
