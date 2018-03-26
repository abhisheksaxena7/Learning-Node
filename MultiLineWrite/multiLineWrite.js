var inquirer = require('inquirer');
const fs = require('fs');
const path = require('path');
const cwd = path.resolve(process.cwd());
const pathToEnvFile = path.join(cwd, `.env`);

function createEnvFile(secrets) {
    let contents = Object.keys(secrets)
        .map(secretName => {
            secrets[secretName] = formatValue(secrets[secretName]);
            return `${secretName}=${secrets[secretName]}\n`;
        })
        .reduce((previous, current) => {
            return previous.concat(current);
        }, '');

    fs.writeFileSync(pathToEnvFile, contents, {
        encoding: 'utf8'
    });
    console.log(`. Wrote ${pathToEnvFile} successfully`);
}

// Method to convert the multi-line values into a quoted and single line value
const formatValue = value => {
    if (!value || typeof value !== 'string') {
        value = '';
    }
    let finalValue = value;
    const test = '(\r\n|\n|\r)';
    const re = new RegExp(test, 'gm');
    const match = value.match(re);
    if (match) {
        finalValue = '"' + value.replace(re, '\\n') + '"';
    }
    return finalValue;
};

inquirer.prompt([{
        "type": "editor",
        "name": "SF_ORG__KEY",
        "message": "What is your public SSH Key?",
    },
    {
        "type": "input",
        "name": "SF_ORG__QA__USERNAME",
        "message": "What is the username of your QA Org?",
    },
    {
        "type": "password",
        "name": "SF_ORG__QA__PASSWORD",
        "message": "Please enter the password and security token for the QA org",
    }
]).then(answers => {
    console.log(JSON.stringify(answers, null, '  '));
    //answers.SF_ORG__KEY = formatValue(answers.SF_ORG__KEY);
    createEnvFile(answers);
    //console.log(JSON.stringify(convertObjectToString(answers), null, '  '));
});