const writeyaml = require('write-yaml');

var orgName = 'SIT,UAT,PROD'; //QA,SIT,UAT,Production //<%= orgs %>
var orgs = orgName.split(','); //[ 'QA', 'SIT', 'UAT', 'Production' ]

console.log(orgs);
console.log(orgs.length);

//Static jobs
let gitlabConfig = {
    "image": "appirio/dx-salesforce:latest",
    "stages": [
        "publish",
        "review",
        "refresh",
        "delete",
        "merge_request"
    ],
    "variables": {
        "CACHE_DIR": ".tmpCacheDir",
        "SCRATCH_ORG_ALIAS": "reviewApp"
    }
};
const sonarJobs = {
    "variables": {
        ...(gitlabConfig.variables),
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
    gitlabConfig = Object.assign({}, gitlabConfig, sonarJobs);
    gitlabConfig.stages.unshift('quality_scan');
}

const commonCodeForReviewJobs = {
    "cache": {
        "key": "$CI_COMMIT_REF_SLUG",
        "paths": [
            "$CACHE_DIR"
        ]
    },
    "only": [
        "/^feature\\/.*/"
    ],
    "except": [
        "tags",
        "schedules"
    ]
}

gitlabConfig = {
    ...(gitlabConfig),
    "make_review_app": {
        "stage": "review",
        "when": "manual",
        "script": [
            "adx ci:shell --script createOrUpdateScratchOrg.sh"
        ],
        "environment": {
            "name": "review-apps/$CI_COMMIT_REF_NAME",
            "on_stop": "stop_review_app"
        },
        ...commonCodeForReviewJobs
    },
    "refresh_review_app": {
        "stage": "refresh",
        "when": "manual",
        "script": [
            "adx ci:shell --script refreshAccessToScratchOrg.sh"
        ],
        "environment": {
            "name": "review-apps/$CI_COMMIT_REF_NAME"
        },
        ...commonCodeForReviewJobs
    },
    "stop_review_app": {
        "stage": "delete",
        "when": "manual",
        "script": [
            "adx ci:shell --script deleteScratchOrg.sh"
        ],
        "environment": {
            "name": "review-apps/$CI_COMMIT_REF_NAME",
            "action": "stop"
        },
        ...commonCodeForReviewJobs
    },
    "version_package": {
        "stage": "publish",
        "script": ["adx sfdx:p2:publish"],
        "only": ["master"],
        "except": ["schedules"]
    }
}

//Common code for dynamic jobs
const commonCodeJSON = {
    "only": [
        "master"
    ],
    "except": [
        "schedules"
    ]
};


installJobJSON = {};

for (var i = 0; i < orgs.length; i++) {
    deployKey = 'install_to_' + orgs[i];
    //Merge objects so that they have common code

    if (orgs[i] === 'SIT') {
        installJobJSON[deployKey] = {
            "stage": "install"
        }
        gitlabConfig.stages.push('install');
    } else if (orgs[i] === 'UAT') {
        installJobJSON[deployKey] = {
            "stage": "install-staging",
            "when": "manual"
        }
        gitlabConfig.stages.push('install-staging');
    } else if (orgs[i] === 'PROD') {
        installJobJSON[deployKey] = {
            "stage": "install-prod",
            "when": "manual"
        }
        gitlabConfig.stages.push('install-prod');
    }
    //Dynamically write out jobs based on which orgs user chose.
    installJobJSON[deployKey] = {
        ...(installJobJSON[deployKey]),
        "script": "adx sfdx:p2:install --destination " + orgs[i]
    };
    installJobJSON[deployKey] = Object.assign({}, installJobJSON[deployKey], commonCodeJSON);
    //Initialize only array with blank value
    gitlabConfig[deployKey] = installJobJSON[deployKey];
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

//console.log(JSON.stringify(gitlabConfig, null, 2));
writeyaml('.gitlab-ci-sfdx.yml', gitlabConfig, function (err) {
    // do stuff with err 
    if (err != null)
        console.log(err);
});
