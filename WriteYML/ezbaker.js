const writeyaml = require('write-yaml');

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
    //Validation jobs
    validateJobJSON[`validate_against_${answers.orgs[i]}`] = {
        "stage": "validate",
        "script": [". ./config.sh",
            "adx resources:build",
            "adx resources:check",
            "adx sort:check"
        ],
    };
    deployJobJSON[`deploy_to_${answers.orgs[i]}`] = {
        "stage": "deploy",
        "script": [". ./config.sh",
            "adx resources:build",
            "adx resources:check",
            "adx sort:check"
        ],
    }
    //validateJobJSON[`validate_against_${answers.orgs[i]}`] += commonCodeJSON;
    //deployJobJSON[`deploy_to_${answers.orgs[i]}`] = commonCodeJSON;
    validateJobJSON[`validate_against_${answers.orgs[i]}`] = {
        ...validateJobJSON[`validate_against_${answers.orgs[i]}`],
        ...commonCodeJSON
    }
    //validateJobJSON[`validate_against_${answers.orgs[i]}`] = Object.assign({}, validateJobJSON[`validate_against_${answers.orgs[i]}`], commonCodeJSON);
    deployJobJSON[`deploy_to_${answers.orgs[i]}`] = Object.assign({}, deployJobJSON[`deploy_to_${answers.orgs[i]}`], commonCodeJSON);
    validateJobJSON[`validate_against_${answers.orgs[i]}`]["script"][4] = "adx package:deploy --timestamp $TIMESTAMP --target " + answers.orgs[i];
    deployJobJSON[`deploy_to_${answers.orgs[i]}`]["script"].push("adx package:deploy --deploy.checkOnly false --timestamp $TIMESTAMP --target " + answers.orgs[i]);

    if (answers.orgs[i] != 'UAT' && answers.orgs[i] != 'Production') {
        deployJobJSON[`deploy_to_${answers.orgs[i]}`]["only"] = "/^" + answers.orgs[i] + "/";
    }
    if (answers.orgs[i] === 'QA') {
        validateJobJSON[`validate_against_${answers.orgs[i]}`]["only"] = "/^feature\/.*/";
    } else if (answers.orgs[i] === 'SIT' && !answers.orgs.includes('QA')) {
        validateJobJSON[`validate_against_${answers.orgs[i]}`]["only"] = "/^feature\/.*/";
    } else if (answers.orgs[i] === 'SIT') {
        validateJobJSON[`validate_against_${answers.orgs[i]}`]["only"] = "/^QA/";
    } else nestedIf: if (answers.orgs[i] === 'UAT') {
        deployJobJSON[`deploy_to_${answers.orgs[i]}`]["only"] = "master";
        if (answers.orgs.includes('SIT')) {
            validateJobJSON[`validate_against_${answers.orgs[i]}`]["only"] = "/^SIT/";
            break nestedIf;
        }
        validateJobJSON[`validate_against_${answers.orgs[i]}`]["only"] = "/^QA/";
    } else
    if (answers.orgs[i] === 'Production') {
        validateJobJSON[`validate_against_${answers.orgs[i]}`]["only"] = "master";
        deployJobJSON[`deploy_to_${answers.orgs[i]}`]["only"] = "/^v[0-9.]+$/";
        deployJobJSON[`deploy_to_${answers.orgs[i]}`]["when"] = "manual";
    }
    gitlabConfig[`validate_against_${answers.orgs[i]}`] = validateJobJSON[`validate_against_${answers.orgs[i]}`];
    gitlabConfig[`deploy_to_${answers.orgs[i]}`] = deployJobJSON[`deploy_to_${answers.orgs[i]}`];
}

console.log(JSON.stringify(validateJobJSON, null, 2));
console.log(JSON.stringify(deployJobJSON, null, 2));

writeyaml('.gitlab-ci-writeyaml.yml', gitlabConfig, function (err) {
    // do stuff with err 
});