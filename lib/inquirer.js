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
                name: 'isNeedVueRouter',
                type: 'confirm',
                message: 'Install vue-router?'
            },
            {
                name: 'cssPreprocessor',
                type: 'list',
                message: 'Pick an css preprocessor',
                choices: [
                    "less",
                    "scss"
                ]
            },
            {
                name: 'isNeedMockjs',
                type: 'confirm',
                message: 'Install Mockjs?',
            }
        ];
        return inquirer.prompt(questions);
    },
}