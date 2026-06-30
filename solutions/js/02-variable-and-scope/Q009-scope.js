/**
 * var vs let vs const
 */

/* --------------------------------------------------
   Scope
-------------------------------------------------- */

if (true) {
  var a = 10;
  let b = 20;
  const c = 30;
}

console.log(a); // 10
console.log(b); // ReferenceError
// console.log(c); // ReferenceError

/*
var   -> function scoped
let   -> block scoped
const -> block scoped
*/

/* --------------------------------------------------
   Hoisting: During the creation phase, JavaScript moves variable and function declarations to the top of their scope before executing the code.
-------------------------------------------------- */

console.log(x); // undefined
var x = 100;

// console.log(y); // ReferenceError (TDZ)
let y = 200;

// console.log(z); // ReferenceError (TDZ)
const z = 300;

/*
All are hoisted.

var   -> initialized with undefined
let   -> uninitialized (TDZ)
const -> uninitialized (TDZ)    
*/

/* --------------------------------------------------
   Redeclaration
-------------------------------------------------- */

var p = 1;
var p = 2; // Allowed

let q = 1;
// let q = 2; // SyntaxError

const r = 1;
// const r = 2; // SyntaxError

/* --------------------------------------------------
   Reassignment
-------------------------------------------------- */

let count = 10;
count = 20; // Allowed

const PI = 3.14;
// PI = 3.14159; // TypeError

/* --------------------------------------------------
   const Object Mutation
-------------------------------------------------- */

const user = {
  name: 'John',
};

user.name = 'John'; // Allowed

console.log(user);

// user = {}; // TypeError

/*
const prevents reassignment,
NOT object mutation.
*/

/* --------------------------------------------------
   Temporal Dead Zone (TDZ)
-------------------------------------------------- */

{
  // TDZ starts

  // console.log(score); // ReferenceError

  let score = 100;

  console.log(score); // 100

  // TDZ ends
}

/*
TDZ = Time between entering scope
and declaration line.
*/

/* --------------------------------------------------
   let inside Loop
-------------------------------------------------- */

for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0);
}

// Output:
// 0
// 1
// 2

/*
Each iteration gets its own i.
*/

/* --------------------------------------------------
   Summary
-------------------------------------------------- */

/*
var:
- Function scoped
- Hoisted as undefined
- Can redeclare
- Can reassign

let:
- Block scoped
- Hoisted but in TDZ
- Cannot redeclare
- Can reassign

const:
- Block scoped
- Hoisted but in TDZ
- Cannot redeclare
- Cannot reassign
- Object properties can still mutate
*/