var inquirer = require('inquirer');
const {
    spawnSync
} = require('child_process');

const ezBakeTemplates = {
    'Salesforce DX': 'https://gitlab.appirio.com/appirio-dx/templates/salesforce.git',
    'Legacy Salesforce': 'https://gitlab.appirio.com/appirio-dx/templates/legacy-salesforce.git',
    'Google': 'https://gitlab.appirio.com/appirio-dx/templates/google.git',
    'Commerce Cloud': 'https://gitlab.appirio.com/appirio-dx/templates/commerce-cloud.git',
    'Data Management': 'https://gitlab.appirio.com/appirio-dx/templates/data-management.git',
    'Digital - Baseline Web App': 'https://github.com/appirio-digital/ads-baseline-webapp',
    'Digital - Baseline Node.js': 'https://github.com/appirio-digital/ads-baseline-nodejs',
    'Digital - Create React App': 'https://github.com/appirio-digital/create-react-app-sfdc-canvas',
    'Digital - Universal React and Node': 'https://github.com/appirio-digital/ezbake-universal-js'
};

var questions = [{
    "type": "list",
    "name": "projectType",
    "message": "What type of project will you be developing?",
    "choices": Object.keys(ezBakeTemplates),
    filter: (choice) => {
        return ezBakeTemplates[choice];
    }
}];

const askQuestions = () => {
    return new Promise((resolve, reject) => {
        inquirer.prompt(questions).then(answers => {
            console.log(JSON.stringify(answers, null, '  '));
            // execFileSync(/^win/.test(process.platform) ? 'ezbake.cmd' : 'ezbake', ['prepare', '-r', answers.projectType, '-b', 'ezbake'], {
            //     stdio: 'inherit'
            // });
            let execCmd = spawnSync('abc', {
                shell: true,
                stdio: 'inherit'
            });
        }).catch(err => {
            reject(err);
        });
    });


}
askQuestions();
module.exports = {
    askQuestions
}
