let promiseStatus = 'this should be resolved';
//let promiseStatus = `this shouldn't be resolved`;
const thisIsAPromise = new Promise((resolve, reject) => {
        if (promiseStatus === 'this should be resolved') {
            let value = 'resolved value';
            resolve(value);
        } else {
            reject('Wooops!!');
        }
    })
    .then(value => console.log(value))
    .catch(value => console.log(value));