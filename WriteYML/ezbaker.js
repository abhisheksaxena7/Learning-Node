const writeyaml = require('write-yaml');

var orgName = 'QA,SIT,UAT,Production'; //QA,SIT,UAT,Production //<%= orgs %>
var orgs = orgName.split(','); //[ 'QA', 'SIT', 'UAT', 'Production' ]

console.log(orgs);
console.log(orgs.length);

//Static jobs
let gitlabConfig = {
    "image": "appirio/dx-salesforce:latest",
    "stages": [
        "validate",
        "deploy",
        "merge_request"
    ]
};

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

if (true) { //true //<%= enableSonarQube %>
    if (orgs.includes('QA')) {
        sonarJobs.sonarqube_scan_publish.only.push('QA');
    }
    if (orgs.includes('SIT')) {
        sonarJobs.sonarqube_scan_publish.only.push('SIT');
    }
    gitlabConfig = Object.assign({}, gitlabConfig, sonarJobs);
    gitlabConfig.stages.unshift('quality_scan');
}


const cleanUpJob = {
    "cleanup": {
        "stage": "cleanup",
        "variables": {
            "GIT_STRATEGY": "clone"
        },
        "script": [
            "adx ci:shell --script cleanUp.sh --arguments QA master"
        ],
        "only": [
            "schedules"
        ]
    }
};
if (true) { //true // <%= cleanUpBranches %>
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
            "adx resources:build",
            "adx resources:check",
            "adx sort:check"
        ],
    };
    //Deployment jobs
    deployJobJSON[deployKey] = {
        "stage": "deploy",
        "script": [". ./config.sh",
            "adx resources:build",
            "adx resources:check",
            "adx sort:check"
        ],
    };

    //Merge objects so that they have common code
    validateJobJSON[validationKey] = Object.assign({}, validateJobJSON[validationKey], commonCodeJSON);
    deployJobJSON[deployKey] = Object.assign({}, deployJobJSON[deployKey], commonCodeJSON);

    //Dynamically write out jobs based on which orgs user chose.
    validateJobJSON[validationKey].script.push("adx package:deploy --timestamp $TIMESTAMP --target " + orgs[i]);
    deployJobJSON[deployKey].script.push("adx package:deploy --deploy.checkOnly false --timestamp $TIMESTAMP --target " + orgs[i]);

    //Initialize only array with blank value
    deployJobJSON[deployKey].only = [];
    validateJobJSON[validationKey].only = [];

    if (orgs[i] != 'UAT' && orgs[i] != 'Production') {
        deployJobJSON[deployKey].only.push("/^" + orgs[i] + "/");
    }
    if (orgs[i] === 'QA') {
        validateJobJSON[validationKey].only.push("/^feature\/.*/");
    } else if (orgs[i] === 'SIT' && !orgs.includes('QA')) {
        validateJobJSON[validationKey].only.push("/^feature\/.*/");
    } else if (orgs[i] === 'SIT') {
        validateJobJSON[validationKey].only.push("/^QA/");
    } else nestedIf: if (orgs[i] === 'UAT') {
        deployJobJSON[deployKey].only.push("master");
        if (orgs.includes('SIT')) {
            validateJobJSON[validationKey].only.push("/^SIT/");
            break nestedIf;
        }
        validateJobJSON[validationKey].only.push("/^QA/");
    } else
    if (orgs[i] === 'Production') {
        validateJobJSON[validationKey].only.push("master");
        deployJobJSON[deployKey].only.push("/^v[0-9.]+$/");
        deployJobJSON[deployKey].when = "manual";
    }
    gitlabConfig[validationKey] = validateJobJSON[validationKey];
    gitlabConfig[deployKey] = deployJobJSON[deployKey];
}

//console.log(JSON.stringify(gitlabConfig, null, 2));
writeyaml('.gitlab-ci.yml', gitlabConfig, function (err) {
    // do stuff with err 
    if (err != null)
        console.log(err);
});
