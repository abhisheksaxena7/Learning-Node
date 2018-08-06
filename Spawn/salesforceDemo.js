const {
  spawnSync,
  execSync,
} = require('child_process');

// execSync("adx salesforce:demo -o DEV,QA --json", (err, stdout, stderr) => console.log(stdout));
// var r = spawnSync('ls');
// console.log(r.stdout.toString());
// console.log(r.stderr.toString());

let allOrgsOutput = spawnSync('adx', ['salesforce:demo', , '-o', 'DEV,QA', '--json'], {
  shell: true,
});


const temp = {};
allOrgsOutput = JSON.parse(allOrgsOutput.stdout.toString().split('\n')[1]).forEach((orgInfo) => {
  temp[`SF_ORG_${orgInfo.alias.replace('-ADX-DEMO', '')}__SERVERURL`] = orgInfo.instanceUrl;
  temp[`SF_ORG_${orgInfo.alias.replace('-ADX-DEMO', '')}__USERNAME`] = orgInfo.username;
  temp[`SF_ORG_${orgInfo.alias.replace('-ADX-DEMO', '')}__PASSWORD`] = orgInfo.password;
});
console.log(temp);

spawnSync('sfdx', ['force:org:delete', , '-u', 'DEV-ADX-DEMO', '-p'], {
  shell: true,
});

spawnSync('sfdx', ['force:org:delete', , '-u', 'QA-ADX-DEMO', '-p'], {
  shell: true,
});
