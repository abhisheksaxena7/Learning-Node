const functions = require('../functions');

// const initDatabase = () => console.log('Database Initialized...');
// const closeDatabase = () => console.log('Database Closed...');

// beforeEach(() => initDatabase());
// afterEach(() => closeDatabase());

// beforeAll(() => initDatabase());
// afterAll(() => closeDatabase());

const nameCheck = () => console.log('Checking Name...');
describe('Checking Names', () => {
  beforeEach(() => nameCheck());

  test('User is Jeff', () => {
    const user = 'Jeff';
    expect(user).toBe('Jeff');
  });

  test('User is Karen', () => {
    const user = 'Karen';
    expect(user).toBe('Karen');
  });
});

test('Adds 2 + 2 to equal 4', () => {
  expect(functions.add(2, 2)).toBe(4);
});

test('Adds 2 + 2 to not equal 5', () => {
  expect(functions.add(2, 2)).not.toBe(5);
});

// CHECK FOR THRUTHY & FALSY VALUES
// toBeNull matches only Null
// toBeUndefined matches only undefined
// toBeDefined is the opposite of toBeUndefined
// toBeTruthy matches anything that an if statement treats as true
// toBeFalsy matches anything that an if statement treats as false

test('Should be null', () => {
  expect(functions.isNull()).toBeNull();
});

test('Should be falsy', () => {
  expect(functions.checkValue(null)).toBeFalsy();
  expect(functions.checkValue(0)).toBeFalsy();
  expect(functions.checkValue(undefined)).toBeFalsy();
  expect(functions.checkValue(false)).toBeFalsy();
});

test('User should be Abhishek Saxena', () => {
  // expect(functions.createUser()).toBe({   ----- This WILL FAIL since Objects are reference type.
  expect(functions.createUser()).toEqual({
    firstName: 'Abhishek',
    lastName: 'Saxena',
  });
});

test('Should be under 1600', () => {
  const num1 = 800;
  const num2 = 700;
  expect(num1 + num2).toBeLessThanOrEqual(1600);
});

// Regex
test('There is no I in team', () => {
  expect('team').not.toMatch(/I/);
});

// Arrays
test('Admin should be in usernames', () => {
  const usernames = ['Andrew', 'Ashna', 'Saurabh'];
  expect(usernames).toContain('Andrew');
});

// Working with async data

// Promise
test('User fetched name should be Leanne Graham', () => {
  expect.assertions(1);
  return functions.fetchUser()
    .then(data => expect(data.name).toEqual(
      'Leanne Graham',
    ));
});

// async await
test('User fetched name should be Leanne Graham', async () => {
  expect.assertions(1);
  const data = await functions.fetchUser();
  expect(data.name).toEqual(
    'Leanne Graham',
  );
});
