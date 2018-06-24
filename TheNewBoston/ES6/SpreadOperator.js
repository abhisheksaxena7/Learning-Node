const addNumbers = (a, b, c) => console.log(a + b + c);
const nums = [1, 2, 3];

addNumbers(...nums);

const meats = ['bacon', 'ham'];
const foods = ['apples', ...meats, 'rice', 'kiwi'];

console.log(foods);
