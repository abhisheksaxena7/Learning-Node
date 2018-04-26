const os = require('os');
const path = require('path');

const userConfigPath = path.join(os.homedir(), '.appirio', 'userConfig.json');
let userConfig;
try {
    userConfig = require(userConfigPath);
    //console.log(JSON.stringify(userConfig));
    console.log('DX_GITLAB_TOKEN = ' + userConfig.gitlab.personal_token);
    console.log('SONAR_LOGIN = ' + userConfig.sonarqube.access_token);
    console.log('ROOT_USER = ' + userConfig.gitlab.personal_token);
} catch (e) {
    userConfig = {};
}
