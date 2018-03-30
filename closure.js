/*The feature— being able to reference a specific instance 
of a local binding in an enclosing scope— is called closure.A
function that closes over some local bindings is called a closure.
Think of function values as containing both the code in their body and 
the environment in which they are created. When called, the function 
body sees its original environment, not the environment in which the call is made.*/


// function wrapValue(n) {
//     let local = n;
//     return () => local;
// }

wrapValue = n => {
    let local = n;
    return () => local;
}
let wrap1 = wrapValue(1);
let wrap2 = wrapValue(2);
console.log(wrap1());
// → 1
console.log(wrap2());
// → 2



/*In the example, multiplier is called and creates an 
environment in which its factor parameter is bound to 2. 
The function value it returns, which is stored in twice, 
remembers this environment.So when that is called, 
it multiplies its argument by 2.*/


// function multiplier(factor) {
//     return number => number * factor;
// }
let multiplier = factor => number => number * factor;
let twice = multiplier(2);
console.log(twice(5));
// → 10