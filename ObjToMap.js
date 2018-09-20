const obj = {
  namespace: '',
  sfdcLoginUrl: 'https://login.salesforce.com',
  sourceApiVersion: '42.0',
};

const result = new Map();
Object.keys(obj).forEach((key) => {
  return result.set(key, obj[key]);
});

console.log(result);
