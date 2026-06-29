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
        if (args.length >= fn.length) {
            return fn(...args);
        }

        return function (...nextArgs) {
            return curried(...args, ...nextArgs);
        };
    };
}

function add(a, b, c) {
    return a + b + c;
}

const curried = curry(add);
const add10 = curried(10);     // bake in 10
const add10and5 = add10(5);    // bake in 5
console.log(add10and5(3));     // 18 ✅
console.log(add10and5(20));    // 35 ✅
console.log(add10and5(100));   // 115 ✅

/*
curried(10)(2)(3)    // 1 fixed, 2 vary one at a time
curried(10)(2, 3)    // 1 fixed, pass 2 at once
curried(10, 2)(3)    // 2 fixed, 1 varies
curried(10, 2, 3)    // all 3 at once, no currying benefit


OR 

const add10 = curried(10);  // only 10 fixed
add10(2, 3);  // add(10, 2, 3) → 15 ✅
add10(5, 6);  // add(10, 5, 6) → 21 ✅
add10(1, 9);  // add(10, 1, 9) → 20 ✅

*/