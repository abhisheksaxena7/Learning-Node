// const buf = new Buffer('Hello', 'utf-8');
const buf = Buffer.from('Hello', 'utf-8');

// <Buffer 48 65 6c 6c 6f> Displayed in Hexadecimal for ease but actually stored in binary
console.log(buf);
console.log(buf.toString());

// { type: 'Buffer', data: [ 72, 101, 108, 108, 111 ] } data in Unicode 72 -> H, 101 -> E..
console.log(buf.toJSON());
console.log(buf[2]);

// wollo 'wo' overwrites 'he' since when we created buf it was of size 5, it stays the same size
buf.write('wo');
console.log(buf.toString());
