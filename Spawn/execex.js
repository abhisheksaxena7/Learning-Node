const path = require('path');
const cwd = path.resolve(process.cwd());
const {
    spawn,
    exec
} = require('child_process');

let projectName = 'node_modules';
let pathToProject =
    projectName === '.' ? cwd : path.join(cwd, `./${projectName}`);
exec(
    `cd "${pathToProject}" && cd`,
    (err, stdout, stderr) => {
        if (err || stderr) {
            console.error(err);
            return;
        }
        console.log(stdout);
    }
);
