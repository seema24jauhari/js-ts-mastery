/** 
    Takes one or more functions as arguments, or Returns a function. If it does either one, it is a higher-order function.

    1. Takes a function as an argument
    function greet(name) {
        return `Hello ${name}`;
    }

    function execute(fn, value) {
        return fn(value);
    }
s
    console.log(execute(greet, "John"));

    Here:

    greet → normal function
    execute → higher-order function (because it accepts fn)
  
    2. Returns a function
    function multiplyBy(x) {
        return function(y) {
            return x * y;
        };
    }

    const double = multiplyBy(2);

    console.log(double(5)); // 10

    multiplyBy is a higher-order function because it returns a function.
*/


const memoize = (fn) => {
    const cache = new Map();

    return (...args) => {
        const key = JSON.stringify(args);

        if (cache.has(key)) {
            return cache.get(key);
        }

        const result = fn(...args);
        cache.set(key, result);

        return result;
    };
};

function add(a, b) {
    console.log("Calculating...");
    return a + b;
}

const memoizedAdd = memoize(add);

console.log(memoizedAdd(2, 3)); // Calculating... 5
console.log(memoizedAdd(2, 3)); // 5 (from cache)
console.log(memoizedAdd(4, 5)); // Calculating... 9
console.log(memoizedAdd(4, 5)); // 9 (from cache)