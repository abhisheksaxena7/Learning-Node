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


allOrgsOutput = JSON.parse(allOrgsOutput.stdout.toString().split('\n')[1]).map((orgInfo) => {
  return {
    alias: orgInfo.alias,
    instanceUrl: orgInfo.instanceUrl,
    password: orgInfo.password,
    username: orgInfo.username,
    authURL: orgInfo.sfdxAuthUrl,
  };
});

console.log(JSON.stringify(output, null, 2));

spawnSync('sfdx', ['force:org:delete', , '-u', 'DEV-ADX-DEMO', '-p'], {
  shell: true,
});

spawnSync('sfdx', ['force:org:delete', , '-u', 'QA-ADX-DEMO', '-p'], {
  shell: true,
});
