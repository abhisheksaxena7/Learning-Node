const fs = require('fs');
const os = require('os');
const writeyaml = require('write-yaml');
var orgName = 'QA,SIT,UAT,PROD'; //QA,SIT,UAT,PROD //<%= orgs %>
var orgs = orgName.split(','); //[ 'QA', 'SIT', 'UAT', 'PROD' ]

console.log(orgs);
console.log(orgs.length);

let errorInOrder =
    `Valid choices are:
        1) QA, SIT, UAT, PROD
        2) SIT, UAT, PROD
        3) QA, UAT, PROD
        4) UAT, PROD
        5) PROD `;
if (orgs.length < 1) {
    console.log('You must choose at least one org.');
}
if (!orgs.includes('PROD') && orgs.length) {
    console.log(errorInOrder);
}
if (!orgs.includes('UAT') && orgs.length > 1) {
    console.log(errorInOrder);
}

//Static jobs
let gitlabConfig = {
    "image": "appirio/dx-salesforce:latest",
    "stages": [
        "deploy",
        "validate",
        "merge_request"
    ]
};

if (true) { //true //<%= enableSonarQube %>
    const sonarJobs = {
        "variables": {
            "SONAR_URL": "<%= sonarUrl %>"
        },
        "sonarqube_scan": {
            "stage": "quality_scan",
            "script": [
                "adx sonar:config",
                "sonar-scanner -Dsonar.sources=. -Dsonar.host.url=$SONAR_URL -Dsonar.login=$SONAR_LOGIN -Dsonar.gitlab.project_id=$CI_PROJECT_ID -Dsonar.gitlab.commit_sha=$CI_COMMIT_SHA -Dsonar.gitlab.ref_name=$CI_COMMIT_REF_NAME -Dsonar.analysis.mode=preview"
            ],
            "only": [
                "/^feature\\/.*/"
            ],
            "except": [
                "tags",
                "schedules"
            ]
        },
        "sonarqube_scan_publish": {
            "stage": "quality_scan",
            "script": [
                "adx sonar:config",
                "sonar-scanner -Dsonar.sources=. -Dsonar.host.url=$SONAR_URL -Dsonar.login=$SONAR_LOGIN -Dsonar.projectVersion=$CI_COMMIT_TAG -Dsonar.analysis.mode=publish"
            ],
            "only": [
                "master"
            ],
            "except": [
                "tags",
                "schedules"
            ]
        }
    };

    if (orgs.includes('QA')) {
        sonarJobs.sonarqube_scan_publish.only.push('QA');
    }
    if (orgs.includes('SIT')) {
        sonarJobs.sonarqube_scan_publish.only.push('SIT');
    }
    gitlabConfig = Object.assign({}, gitlabConfig, sonarJobs);
    gitlabConfig.stages.unshift('quality_scan');
}

if (true) { //true // <%= cleanUpBranches %>
    const cleanUpJob = {
        "cleanup": {
            "stage": "cleanup",
            "variables": {
                "GIT_STRATEGY": "clone"
            },
            "script": [
                "adx ci:shell --script cleanUp.sh --arguments master"
            ],
            "only": [
                "schedules"
            ]
        }
    };

    gitlabConfig = Object.assign({}, gitlabConfig, cleanUpJob);
    gitlabConfig.stages.unshift('cleanup');
}

//Common code for dynamic jobs
const commonCodeJSON = {
    "cache": {
        "key": "$CI_COMMIT_REF_SLUG",
        "paths": [
            "node"
        ]
    },
    "except": [
        "schedules"
    ]
};

validateJobJSON = {};
deployJobJSON = {};

for (var i = 0; i < orgs.length; i++) {
    validationKey = 'validate_against_' + orgs[i];
    deployKey = 'deploy_to_' + orgs[i];

    //Validation jobs
    validateJobJSON[validationKey] = {
        "stage": "validate",
        "script": [". ./config.sh",
            "adx sort:check"
        ],
    };
    //Deployment jobs
    deployJobJSON[deployKey] = {
        "stage": "deploy",
        "script": [". ./config.sh",
            "adx sort:check"
        ],
    };

    //Merge objects so that they have common code
    validateJobJSON[validationKey] = Object.assign({}, validateJobJSON[validationKey], commonCodeJSON);
    deployJobJSON[deployKey] = Object.assign({}, deployJobJSON[deployKey], commonCodeJSON);

    //Dynamically write out jobs based on which orgs user chose.
    validateJobJSON[validationKey].script.push("adx package:deploy --target " + orgs[i]);
    deployJobJSON[deployKey].script.push("adx package:deploy --deploy.checkOnly false --target " + orgs[i]);

    //Initialize only array with blank value
    deployJobJSON[deployKey].only = [];
    validateJobJSON[validationKey].only = [];

    if (orgs[i] != 'UAT' && orgs[i] != 'PROD') {
        deployJobJSON[deployKey].only.push("/^" + orgs[i] + "/");
    }

    if (orgs[i] === 'QA') {
        validateJobJSON[validationKey].only.push("/^feature\/.*/");
    }

    if (orgs[i] === 'SIT') {
        if (!orgs.includes('QA'))
            validateJobJSON[validationKey].only.push("/^feature\/.*/");
        else
            validateJobJSON[validationKey].only.push("/^QA/");
    }

    if (orgs[i] === 'UAT') {
        if (orgs.includes('SIT')) {
            validateJobJSON[validationKey].only.push("/^SIT/");
        } else if (orgs.includes('QA')) {
            validateJobJSON[validationKey].only.push("/^QA/");
        } else
            validateJobJSON[validationKey].only.push("/^feature\/.*/");
        deployJobJSON[deployKey].only.push("master");
    }

    if (orgs[i] === 'PROD') {
        if (orgs.includes('QA') || orgs.includes('SIT') || orgs.includes('UAT'))
            validateJobJSON[validationKey].only.push("master");
        else
            validateJobJSON[validationKey].only.push("/^feature\/.*/");
        deployJobJSON[deployKey].only.push("/^v[0-9.]+$/");
        deployJobJSON[deployKey].when = "manual";
    }

    gitlabConfig[validationKey] = validateJobJSON[validationKey];
    gitlabConfig[deployKey] = deployJobJSON[deployKey];
}

//console.log(JSON.stringify(gitlabConfig, null, 2));
const writeGitLabCiYaml = () => {
    const gitlabYMLFile = '.gitlab-ci.yml';
    const convertLineFeed = (src) => {
        return src.toString().split('\n').join(os.EOL);
    }

    writeyaml(gitlabYMLFile, gitlabConfig, function (err) {
        // do stuff with err
        if (err != null) {
            console.log(err);
        } else {
            if (os.EOL !== '\n') {
                const newYAML = convertLineFeed(fs.readFileSync(gitlabYMLFile));
                fs.writeFileSync(gitlabYMLFile, newYAML, 'utf8');
            }
        }
    });
};

writeGitLabCiYaml();
