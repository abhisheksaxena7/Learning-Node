const fs = require('fs-extra');
const path = require('path');
const { spawn, exec } = require('child_process');
const cwd = path.resolve(process.cwd());

function executeCommand(command, cmdOptions) {
    return new Promise((resolve, reject) => {
      let cmd = command[0];
      let args = command.length > 1 ? command.slice(1) : [];
      let execCmd = spawn(cmd, args, cmdOptions);
      //let execCmd = spawn('cd', [''], {shell:true, cwd: 'node_modules'});
      //let execCmd = spawn(process.env.comspec, ['/c', 'echo', '-arg1', '-arg2']);
      execCmd.stdout.on('data', data => {
        console.log(`  ${data}`);
      });
  
      execCmd.stderr.on('data', data => {
        console.log(`  ! ${data}`);
      });
  
      execCmd.on('exit', code => {
        if (code !== 0) {
          return reject(new Error(`  ! Error in command execution.`));
        }
        return resolve();
      });
    });
  }

  //executeCommand(['npm','install'],{cwd: '.ezbake/scripts'});
  executeCommand(['ezbake','prepare'],{shell: true,cwd: 'node_modules'});