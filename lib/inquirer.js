const inquirer   = require('inquirer');

module.exports = {

  getQuestions: () => {

    const questions = [
      {
        name: 'isNeedmock',
        type: 'confirm',
        message: 'is need mockjs?',
        validate: function( value ) {
          if (value.length) {
            return true;
          } else {
            return 'please confirm is need mockjs';
          }
        }
      },
      {
        name: 'password',
        type: 'password',
        message: 'Enter your password:',
        validate: function(value) {
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