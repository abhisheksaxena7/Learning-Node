const fs = require('fs');

// const myReadStream = fs.createReadStream(`${__dirname}/dataToBeRead.txt`);
const myReadStream = fs.createReadStream(`${__dirname}/dataToBeRead.txt`, 'utf-8');

const myWriteStream = fs.createWriteStream(`${__dirname}/dataToBeWritten.txt`);

// myReadStream.on('data', (chunk) => {
//   console.log('Received chunk');
//   myWriteStream.write(chunk);
// });

// Pipe function - takes data from a read stream and pipe it to a write stream
// So we do not have to listen to data even and don't have to manually write to
// a write stream.
myReadStream.pipe(myWriteStream);
