const fs = require('fs');
const split2 = require('split2');

// const myReadStream = fs.createReadStream(`${__dirname}/dataToBeRead.txt`);
const myReadStream = fs.createReadStream(`${__dirname}/dataToBeRead.txt`, 'utf-8');

let i = 0;
myReadStream
  .pipe(split2())
  .on('data', (line) => {
    // each chunk now is a separate line!
    console.log('Received chunk');
    console.log(line);
    console.log(i++);
  });
