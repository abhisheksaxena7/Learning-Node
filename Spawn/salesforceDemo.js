const {
  spawnSync,
  execSync,
} = require('child_process');

// execSync("adx salesforce:demo -o DEV,QA --json", (err, stdout, stderr) => console.log(stdout));
// var r = spawnSync('ls');
// console.log(r.stdout.toString());
// console.log(r.stderr.toString());

const allOrgsOutput = spawnSync('adx', ['salesforce:demo', , '-o', 'DEV,QA', '--json'], {
  shell: true,
});

console.log(JSON.parse(allOrgsOutput.stdout.toString().split('\n')[1]));

JSON.parse(allOrgsOutput.stdout.toString().split('\n')[1]).forEach((orgInfo) => {
  console.log(`Alias: ${orgInfo.alias}`);
  console.log(`Instance URL: ${orgInfo.instanceUrl}`);
  console.log(`Username: ${orgInfo.username}`);
  console.log(`Password: ${orgInfo.password}`);
  console.log(`authURL: ${orgInfo.sfdxAuthUrl}`);

});


spawnSync('sfdx', ['force:org:delete', , '-u', 'DEV-ADX-DEMO', '-p'], {
  shell: true,
});

spawnSync('sfdx', ['force:org:delete', , '-u', 'QA-ADX-DEMO', '-p'], {
  shell: true,
});
