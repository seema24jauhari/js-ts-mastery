/*

| Currying                                      | 
| --------------------------------------------- | 
| Converts a function into a chain of functions | 
| Used to supply arguments gradually            | 
| Uses closures                                 |
| Does **not** require self-calls               | 

*/

function curry(fn) {
    return function curried(...args) {
        if (args.length == fn.length) {
            return fn(...args);
        }

        return function (...nextArgs) {
                    console.log(...nextArgs)
            return curried(...args, ...nextArgs);
        };
    };
}

function add(a, b, c) {
    return a + b + c;
}

const curried = curry(add);

console.log(curried(1)(2)(3)); // 6