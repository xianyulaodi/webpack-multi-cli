const inquirer = require('inquirer');

module.exports = {

    getQuestions: () => {

        const questions = [
            {
                name: 'jsFrame',
                type: 'list',
                message: '请选择适合您的js框架:',
                choices: [
                    "vue",
                    "react"
                ],
                filter: function (val) { // 使用filter将回答变为小写
                    return val.toLowerCase();
                },
                validate: function (value) {
                    if (value.length) {
                        return true;
                    } else {
                        return 'Please enter your password.';
                    }
                }
            },
            {
                name: 'isNeedmock',
                type: 'confirm',
                message: '是否需要引入mockjs?',
                validate: function (value) {
                    if (value.length) {
                        return true;
                    } else {
                        return 'please confirm is need mockjs';
                    }
                }
            },
            {
                name: 'cssPre',
                type: 'list',
                message: '请选择适合您的css预处理器:',
                choices: [
                    "less",
                    "scss",
                    "无"
                ],
                filter: function (val) { 
                    return val.toLowerCase();
                },
                validate: function (value) {
                    if (value.length) {
                        return true;
                    } else {
                        return 'Please enter your password.';
                    }
                }
            }
        ];
        return inquirer.prompt(questions);
    },
}