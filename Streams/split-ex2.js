const through2 = require('through2');
const split2 = require('split2');
const fs = require('fs');

const myReadStream = fs.createReadStream(`${__dirname}/dataToBeRead.txt`, 'utf-8');

const stream = through2({
  objectMode: true,
  // eslint-disable-next-line func-names
}, function (chunk, enc, callback) {
  const string = chunk.toString();
  const result = string.replace(/\n/, '').toUpperCase().split(/[ \t]/);

  this.push(result);
  callback();
});

stream.on('data', (data) => {
  const toString = Object.prototype.toString.call(data);
  console.log('type of data:', toString);
  console.log('data:', data, '\n');
});

// process.stdin
//   .pipe(split2())
//   .pipe(stream)

myReadStream
  .pipe(split2())
  .pipe(stream);
