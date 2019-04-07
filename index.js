#!/usr/bin/env node

const inquirer = require('./lib/inquirer');

const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');

const run = async () => {
const credentials = await inquirer.getQuestions();
  console.log(credentials);
}
run();

/*
clear();
console.log(
    chalk.yellow(
        figlet.textSync('multi-cli', { horizontalLayout: 'full' })
    )
);
*/