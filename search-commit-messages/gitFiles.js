/**
 * Searching individual file commit histories
 * one by one, reading the latest commit message
 * and performing actions if it doesn't match some
 * specified commit messages
 *  */
const simplegit = require('simple-git');
const git = simplegit();
let gitStage = [];

const getDiff = async () => {
  const files = await git.diff(['--name-only', '--', 'force-app/main/']);
  filesArray = files.split('\n');

  filesArray.forEach(async element => {
    if (element) {
      // console.log('00', element);
      const obj = await git.log(['-p', element]);
      if (obj.latest.message !== 'first baseline' &&
        obj.latest.message !== 'final baseline' &&
        obj.latest.message !== 'New Baseline after refresh' &&
        obj.latest.message !== 'Baselining shared SIT env' &&
        obj.latest.message !== 'Baseline GSDP components from production' &&
        obj.latest.message !== 'Baselined Shared Metadata to be deployed from Production.') {
        console.log('11', element, '22', obj.latest.message);
        gitStage.push(element);
        await git.add([element]);

      }
      // else {
      //   console.log('00', element);
      //   await git.checkout(['HEAD', '--', element]);
      // }
    }

  });
  console.log('---')
  return console.log(gitStage);
};

getDiff();
