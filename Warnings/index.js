const colors = require('colors');
let warningMessages = [];

warningMessages.push(
    `Sonarqube Access Token not found.
  Sonar jobs will fail if you've chosen to use Sonarqube. 
  After generating it store it in SONAR_LOGIN secret variable on GitLab for any existing projects.`);
warningMessages.push(
    `GitLab Access Token not found. 
  Unable to push your project to GitLab unless it's set.`);
warningMessages.push(
    `GitLab Username not found. 
  Validations/deployments won't run succefully unless it's set.
  After setting it store it in ROOT_USER secret variable on GitLab for any existing projects.`);

console.log('WARNING:'.yellow);
warningMessages.forEach((warningMessage) => console.log(((warningMessages.indexOf(warningMessage) + 1) + ': ' + warningMessage + '\n').yellow));
console.log(`To set them visit Services Tab on AppirioDX Desktop App.`.yellow);
