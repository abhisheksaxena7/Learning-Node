const fs = require('fs');

// const myReadStream = fs.createReadStream(`${__dirname}/dataToBeRead.txt`);
const myReadStream = fs.createReadStream(`${__dirname}/dataToBeRead.txt`, 'utf-8');

const myWriteStream = fs.createWriteStream(`${__dirname}/dataToBeWritten.txt`);

myReadStream.on('data', (chunk) => {
  console.log('Received chunk');
  myWriteStream.write(chunk);
});
