const writeyaml = require('write-yaml');
//Static jobs
let gitlabConfig = {
    "image": "appirio/dx-salesforce:latest",
    "stages": [
        "cleanup",
        "quality_scan",
        "validate",
        "deploy",
        "merge_request"
    ],
    "variables": {
        "SONAR_URL": "https://sonar.appirio.com"
    },
    ".cacheNodefiles": {
        "cache": {
            "key": "$CI_COMMIT_REF_SLUG",
            "paths": [
                "node"
            ]
        },
        "except": [
            "schedules"
        ]
    },
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
            "master",
            "QA"
        ],
        "except": [
            "tags",
            "schedules"
        ]
    }
};

var answers = {
    "orgs": [
        "QA",
        "SIT",
        "UAT",
        "Production"
    ]
};

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
    ],
    "only": [

    ]
};

validateJobJSON = {};
deployJobJSON = {};

for (var i = 0; i < answers.orgs.length; i++) {
    validationKey = 'validate_against_' + answers.orgs[i];
    deployKey = 'deploy_to_' + answers.orgs[i];

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

    //Dynamically write out jobs based on which answers.orgs user chose.
    validateJobJSON[validationKey].script[4] = "adx package:deploy --timestamp $TIMESTAMP --target " + answers.orgs[i];
    deployJobJSON[deployKey].script.push("adx package:deploy --deploy.checkOnly false --timestamp $TIMESTAMP --target " + answers.orgs[i]);

    if (answers.orgs[i] != 'UAT' && answers.orgs[i] != 'Production') {
        deployJobJSON[deployKey].only = "/^" + answers.orgs[i] + "/";
    }
    if (answers.orgs[i] === 'QA') {
        validateJobJSON[validationKey].only = "/^feature\/.*/";
    } else if (answers.orgs[i] === 'SIT' && !answers.orgs.includes('QA')) {
        validateJobJSON[validationKey].only = "/^feature\/.*/";
    } else if (answers.orgs[i] === 'SIT') {
        validateJobJSON[validationKey].only = "/^QA/";
    } else nestedIf: if (answers.orgs[i] === 'UAT') {
        deployJobJSON[deployKey].only = "master";
        if (answers.orgs.includes('SIT')) {
            validateJobJSON[validationKey].only = "/^SIT/";
            break nestedIf;
        }
        validateJobJSON[validationKey].only = "/^QA/";
    } else
    if (answers.orgs[i] === 'Production') {
        validateJobJSON[validationKey].only = "master";
        deployJobJSON[deployKey].only = "/^v[0-9.]+$/";
        deployJobJSON[deployKey].when = "manual";
    }
    gitlabConfig[validationKey] = validateJobJSON[validationKey];
    gitlabConfig[deployKey] = deployJobJSON[deployKey];
}

console.log(JSON.stringify(gitlabConfig, null, 2));

writeyaml('.gitlab-ci-writeyaml.yml', gitlabConfig, function (err) {
    // do stuff with err 
});