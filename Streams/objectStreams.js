/* eslint-disable func-names */
// https://nodesource.com/blog/understanding-object-streams/

const through2 = require('through2');

const objectStream = through2.obj(function (chunk, encoding, callback) {
  chunk.timestamp = new Date();
  this.push(chunk);
  callback();
});

const jsonStream = through2.obj(function (chunk, encoding, callback) {
  this.push(`${JSON.stringify(chunk, null, 4)}\n`);
  callback();
});

// objectStream.pipe(process.stdout);
objectStream
  .pipe(jsonStream)
  .pipe(process.stdout);

objectStream.write({
  status: 404,
  message: 'Not found',
});
objectStream.write({
  status: 500,
  message: 'Internal server error',
});
