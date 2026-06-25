/**
 * Strict Mode ("use strict")
 * JavaScript treats 'use strict' as a normal string here because it is not at the beginning of the file or function body. otherwise it will be ignored.
 */


// Without strict mode
function nonStrictExample() {
  accidentalGlobal = 'I became global!';
}

nonStrictExample();
console.log(accidentalGlobal); // "I became global!"

// With strict mode
function strictExample() {
  'use strict';

  // accidentalGlobal2 = 'Error'; // ReferenceError
}

strictExample();

/* --------------------------------------------------
   Difference #1: Undeclared variables
-------------------------------------------------- */

// Without strict mode:
// name = 'John'; // Creates global variable

// With strict mode:
// 'use strict';
// name = 'John'; // ReferenceError

/* --------------------------------------------------
   Difference #2: this in plain functions
-------------------------------------------------- */

function normalThis() {
  console.log(this);
}

normalThis(); // global object (non-strict)

function strictThis() {
  'use strict';
  console.log(this);
}

strictThis(); // undefined

/* --------------------------------------------------
   Difference #3: Duplicate parameter names
-------------------------------------------------- */

// Non-strict (allowed in older JS)
// function sum(a, a) {
//   return a;
// }

// Strict mode:
// 'use strict';
// function sum(a, a) {} // SyntaxError

/* --------------------------------------------------
   Difference #4: Cannot delete variables/functions
-------------------------------------------------- */

'use strict';
let x = 10;
delete x; // SyntaxError

// /* --------------------------------------------------
//    Difference #5: Assignment to read-only property
// -------------------------------------------------- */

// const obj = {};

// Object.defineProperty(obj, 'id', {
//   value: 1,
//   writable: false,
// });

// // Non-strict: silently ignored
// // Strict: TypeError

// /* --------------------------------------------------
//    Difference #6: Octal literals not allowed
// -------------------------------------------------- */

// // Non-strict:
// // const num = 010; // old octal syntax

// // Strict:
// // 'use strict';
// // const num = 010; // SyntaxError

// /* --------------------------------------------------
//    Difference #7: arguments no longer linked
// -------------------------------------------------- */

// // Non-strict
// function nonStrictArguments(a) {
//   arguments[0] = 100;
//   console.log(a); // 100
// }

// nonStrictArguments(10);

// // Strict
// function strictArguments(a) {
//   'use strict';

//   arguments[0] = 100;
//   console.log(a); // 10
// }

// strictArguments(10);

// /* --------------------------------------------------
//    Why ES6 Modules are strict by default?
// -------------------------------------------------- */

// /*
// ES6 modules use strict mode automatically because:

// 1. Modules should behave consistently across environments.
// 2. Prevent accidental global variables.
// 3. Enable better optimization by JavaScript engines.
// 4. Catch bugs earlier.
// */

// /* --------------------------------------------------
//    Why Classes are strict by default?
// -------------------------------------------------- */

// /*
// Classes are always strict because:

// 1. Class methods should behave predictably.
// 2. Prevent unsafe 'this' behavior.
// 3. Avoid legacy JavaScript quirks.
// 4. Improve reliability and maintainability.
// */

// /* --------------------------------------------------
//    Interview Summary
// -------------------------------------------------- */

// /*
// Strict Mode Effects:

// 1. No accidental global variables
// 2. this = undefined in plain functions
// 3. No duplicate parameter names
// 4. Cannot delete variables/functions
// 5. Read-only assignments throw errors
// 6. Old octal literals disallowed
// 7. arguments object decoupled from parameters

// ES6 Modules -> strict by default
// Classes      -> strict by default
// */