const fs = require('fs');
const path = require('path');
const webpack = require('webpack')
const htmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const devMode = process.env.NODE_ENV == 'development'; // 是否是开发环境

module.exports = (cwd, dirname = null, outputPath = null) => {

    let entryFilePath = path.resolve(cwd, `${dirname}/src/main.js`);
    if (!fs.existsSync(entryFilePath)) {
        entryFilePath = path.resolve(cwd, 'common/src/main.js');
    }
    return {

        entry: {
            lib: ['vue', 'vuex'],
            main: ['webpack-hot-middleware/client?noInfo=true&reload=true', entryFilePath]
        }, // 入口文件

        output: {
            filename: 'js/[name].js',    // 打包后的文件名称
            path: path.resolve(cwd, `${dirname}/dist`)  // 打包后的目录
        },
        module: {
            rules: [
                {
                    test: /\.vue$/,
                    loader: 'vue-loader'
                },
                {
                    test: /\.(le|c)ss$/,
                    use: [
                        devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
                        'css-loader',
                        'postcss-loader',
                        'less-loader'
                    ],
                },
                {
                    test: /\.(png|svg|jpg|gif)$/, // 加载图片
                    use: [{
                        loader: 'url-loader',
                        options: {
                            limit: 8192,  // 小于8k的图片自动转成base64格式
                            name: 'images/[name].[ext]?[hash]', // 图片打包后的目录
                            publicPath: '../'  // css图片引用地址
                        },
                    }]
                },
                {
                    test: /\.(woff|woff2|eot|ttf|otf)$/, // 加载字体文件
                    use: [
                        'file-loader'
                    ]
                },
                // 转义es6
                {
                    test: /\.js$/,
                    loader: 'babel-loader',
                    include: /src/,          // 只转化src目录下的js
                    exclude: /node_modules/, // 忽略掉node_modules下的js
                }
            ]
        },
        resolve: {
            // 创建import别名
            alias: {
                $common: path.resolve(cwd, 'common/src'),
                $components: path.resolve(cwd, `${dirname}/src/components`),
                'vue$': 'vue/dist/vue.esm.js',
            },
            extensions: ['.js', '.json'], // 忽略文件后缀
            modules: [  
                // 引入模块的话，先从node_modules中查找，其次是当前产品的src下，最后是common的src下
                path.resolve(cwd, 'node_modules'),
                path.resolve(cwd, `${dirname}/src`),
                path.resolve(cwd, 'common/src')
            ]
        },
        plugins: [
            new VueLoaderPlugin(),
            new htmlWebpackPlugin({
                template: path.resolve(cwd, `${dirname}/index.html`),
                filename: "index.html",
                inject: true,
                hash: true,
                minify: {
                    removeComments: devMode ? false : true, // 删除html中的注释代码
                    collapseWhitespace: devMode ? false : true, // 删除html中的空白符
                    removeAttributeQuotes: devMode ? false : true // 删除html元素中属性的引号
                },
                chunksSortMode: 'dependency' // 按dependency的顺序引入
            }),
            new MiniCssExtractPlugin({
                filename: 'css/[name].css',
                chunkFilename: '[id].css'
            }),

            // 优化css
            new OptimizeCssAssetsPlugin({ 
                ssetNameRegExp: /\.css\.*(?!.*map)/g,
                cssProcessor: require('cssnano'), // 引入cssnano配置压缩选项
                cssProcessorOptions: { // 用postcss添加前缀，这里关掉
                    autoprefixer: { 
                        disable: true 
                    },
                    discardComments: {  // 移除注释
                        removeAll: true
                    }
                },
                canPrint: true // 是否将插件信息打印到控制台
            }),

            // 页面不用每次都引入这些变量
            new webpack.ProvidePlugin({
                Vue: ['vue', 'default'],
                Vuex: ['vuex', 'default']
            })
        ]
    }
};