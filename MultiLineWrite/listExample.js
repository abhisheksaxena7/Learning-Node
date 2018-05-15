var inquirer = require('inquirer');
inquirer.prompt([{
        type: 'list',
        message: 'Which set of orgs will you be using for your project?',
        name: 'orgs',
        choices: [{
                name: 'QA, SIT, UAT, Production',
                value: 'QA,SIT,UAT,PROD'
            },
            {
                name: 'SIT, UAT, Production',
                value: 'SIT,UAT,PROD'
            },
            {
                name: 'QA, UAT, Production',
                value: 'QA,UAT,PROD'
            },
            {
                name: 'UAT, Production',
                value: 'UAT,PROD'
            },
            {
                name: 'Production',
                value: 'PROD',
                checked: true
            }
        ],
        validate: function (answer) {
            if (answer.length < 1) {
                return 'You must choose at least one org.';
            }
            return true;
        }
    },
    {
        "type": "input",
        "name": "SF_ORG__QA__URL",
        "message": "What is the URL of your QA Org?",
        when: function (answers) {
            return answers.orgs.includes('QA');
        },
        default: 'https://test.salesforce.com'
    }, {
        "type": "input",
        "name": "SF_ORG__QA__USERNAME",
        "message": "What is the username of your QA Org?",
        when: function (answers) {
            return answers.orgs.includes('QA');
        }
    }, {
        "type": "password",
        "name": "SF_ORG__QA__PASSWORD",
        "message": "Please enter the password and security token for the QA org",
        when: function (answers) {
            return answers.orgs.includes('QA');
        }
    }, {
        "type": "input",
        "name": "SF_ORG__UAT__URL",
        "message": "What is the URL of your UAT Org?",
        when: function (answers) {
            return answers.orgs.includes('UAT');
        },
        default: 'https://test.salesforce.com'
    }, {
        "type": "input",
        "name": "SF_ORG__UAT__USERNAME",
        "message": "What is the username of your UAT Org?",
        when: function (answers) {
            return answers.orgs.includes('UAT');
        }
    }, {
        "type": "password",
        "name": "SF_ORG__UAT__PASSWORD",
        "message": "Please enter the password and security token for the UAT org?",
        when: function (answers) {
            return answers.orgs.includes('UAT');
        }
    }, {
        "type": "input",
        "name": "SF_ORG__SIT__URL",
        "message": "What is the URL of your SIT Org?",
        when: function (answers) {
            return answers.orgs.includes('SIT');
        },
        default: 'https://test.salesforce.com'
    }, {
        "type": "input",
        "name": "SF_ORG__SIT__USERNAME",
        "message": "What is the username of your SIT Org?",
        when: function (answers) {
            return answers.orgs.includes('SIT');
        }
    }, {
        "type": "password",
        "name": "SF_ORG__SIT__PASSWORD",
        "message": "Please enter the password and security token for the SIT org?",
        when: function (answers) {
            return answers.orgs.includes('SIT');
        }
    }, {
        "type": "input",
        "name": "SF_ORG__PROD__URL",
        "message": "What is the URL of your PROD Org?",
        when: function (answers) {
            return answers.orgs.includes('PROD');
        },
        default: 'https://login.salesforce.com'
    }, {
        "type": "input",
        "name": "SF_ORG__PROD__USERNAME",
        "message": "What is the username of your PROD Org?",
        when: function (answers) {
            return answers.orgs.includes('PROD');
        }
    }, {
        "type": "password",
        "name": "SF_ORG__PROD__PASSWORD",
        "message": "Please enter the password and security token for the PROD org?",
        when: function (answers) {
            return answers.orgs.includes('PROD');
        }
    }
]).then(answers => console.log(JSON.stringify(answers, null, '  ')));
