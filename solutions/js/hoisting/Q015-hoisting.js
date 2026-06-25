console.log(a);
//undefined
// console.log(b);
//reference error: tdz
// console.log(c);
//reference error
var a = 1;
let b = 2;
const c = 3;
console.log(foo());
function foo() { return 'hoisted'; }
/*
Because this is a function expression, not a function declaration.
JavaScript hoists it like this:

var bar;
console.log(bar()); // ?
bar = function() {
    return 'not hoisted the same way';
};
*/
console.log(bar());
var bar = function() { return 'not hoisted the same way'; };