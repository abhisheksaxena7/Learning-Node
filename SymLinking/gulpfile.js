// Sample command run:
// gulp update:symlink
// -d /Users/appirio-13524/Documents/work-repos/node-dx/
// -a /Users/appirio-13524/Documents/work-repos/node-appirio/
// -s /Users/appirio-13524/Documents/work-repos/node-salesforce

const gulp = require('gulp');
const {
    argv,
} = require('yargs');
const index = require('./index');

const nodeDx = argv.d;
const nodeAppirio = argv.a;
const nodeSalesforce = argv.s;
const arrayNode = [nodeDx, nodeAppirio, nodeSalesforce];

gulp.task('symlink', () => {
    index.npmLink(arrayNode);
});

// This task updates the 3 Node-repositories
// and creates updated symlinks.
gulp.task('update:symlink', () => {
    index.updateRepos(arrayNode);
    index.deleteExistingDirs(arrayNode);
    index.installNodeModules(arrayNode);
    index.linkNodes(nodeSalesforce, nodeDx);
});

gulp.task('create:symlink', ['symlink', 'update:symlink']);
