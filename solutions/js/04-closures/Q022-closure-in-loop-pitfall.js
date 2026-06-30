/**
 * Callback → A function passed to another function to be called later.
 * Closure → A function that captures variables from its enclosing scope.
 */

const funcs = [];
for (var i = 0; i < 3; i++) {
  funcs.push(function() { return i; });
}
console.log(funcs.map(f => f()));

//fix 1: scope

const funcs1 = [];
for (let i = 0; i < 3; i++) {
  funcs1.push(function() { return i; });
}
console.log(funcs1.map(f => f()));

//fix 2: IIFE (Immediately Invoked Function Expression)

const funcs2 = [];

for (var i = 0; i < 3; i++) {
  funcs2.push(
    (function(i) {      
        return i;
    })(i)
  );
}

console.log(funcs2.map(f => f)); // [0, 1, 2]

//fix 3: closure

let funcs3 = []
function createClosure(value) {
    return function () {
        return value;
    };
}

for (var i = 0; i < 3; i++) {
    funcs3.push(createClosure(i));
}
console.log(funcs3.map(f => f())); // [0, 1, 2]