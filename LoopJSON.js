var answers = {
    "orgs": [
        "QA",
        "SIT",
        "UAT",
        "Production"
    ]
};

commonCode = ' script:\n';
commonCode += '      - . ./config.sh\n';
commonCode += '      - adx resources:build\n';
commonCode += '      - adx resources:check\n';
commonCode += '      - adx sort:check\n';
commonCode += '      - adx package:deploy --timestamp $TIMESTAMP ';

validateJob = [];
deployJob = [];
finalJobList = [''];

for (var i = 0; i < answers.orgs.length; i++) {
    //Validation jobs
    validateJob[i] = 'validate_against_' + answers.orgs[i] + ':\n';
    validateJob[i] += ' stage: validate\n';
    validateJob[i] += commonCode;
    validateJob[i] += '--target ' + answers.orgs[i] + '\n';
    validateJob[i] += ' <<: *nodeConfiguration\n';
    validateJob[i] += ' only:\n';

    //Deploy Jobs
    deployJob[i] = 'deploy_to_' + answers.orgs[i] + ':\n';
    deployJob[i] += ' stage: deploy\n';
    if (answers.orgs[i] === 'Production') {
        deployJob[i] += ' when: manual\n';
    }
    deployJob[i] += commonCode;
    deployJob[i] += '--target ' + answers.orgs[i] + '\n';
    deployJob[i] += ' <<: *nodeConfiguration\n';
    deployJob[i] += ' only:\n';
    if (answers.orgs[i] != 'UAT' && answers.orgs[i] != 'Production')
        deployJob[i] += '    - /^' + answers.orgs[i] + '/\n';

    if (answers.orgs[i] === 'QA')
        validateJob[i] += '    - /^feature\/.*/\n';
    else if (answers.orgs[i] === 'SIT' && !answers.orgs.includes('QA'))
        validateJob[i] += '    - /^feature\/.*/\n';
    else if (answers.orgs[i] === 'SIT')
        validateJob[i] += '    - /^SIT/\n';
    else nestedIf: if (answers.orgs[i] === 'UAT') {
        deployJob[i] += '    - master\n';
        if (answers.orgs.includes('SIT')) {
            validateJob[i] += '    - /^SIT/\n';
            break nestedIf;
        }
        validateJob[i] += '    - /^QA/\n';
    } else
    if (answers.orgs[i] === 'Production') {
        validateJob[i] += '    - master\n';
        deployJob[i] += '   - /^v[0-9.]+$/\n';
    }
    validateJob[i] += '\n\n';
    deployJob[i] += '\n\n';
    finalJobList[i] = validateJob[i];
    finalJobList[i] += deployJob[i];
}

console.log(finalJobList.join(''));
console.log(JSON.stringify(answers));