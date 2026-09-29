//Closure: A function that remembers and can access variables from its outer scope even after the outer function has finished executing.

function makeAdder(x) {
    return function (y) {
        return x + y;
    };
}

const add5 = makeAdder(5);

console.log(add5(10)); // 15
console.log(add5(20)); // 25