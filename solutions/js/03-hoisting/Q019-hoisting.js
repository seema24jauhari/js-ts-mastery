/*

In the creation phase, JavaScript hoists var, let, const, and class declarations into memory. var is initialized with undefined, while let, const, and class remain uninitialized, creating the Temporal Dead Zone (TDZ).

In the execution phase, the TDZ ends when the declaration statement is executed and the variable gets initialized; accessing it before that throws a ReferenceError.

- var → hoisted + initialized → undefined
- let/const/class → hoisted + NOT initialized → TDZ → ReferenceError
- Both are hoisted, but only let/const/class remain unusable until initialization.

JavaScript has two phases:
Creation Phase
Creates variables and functions in memory.
var is initialized to undefined.
let, const, and class are hoisted but remain uninitialized (TDZ).
Execution Phase
Runs the code from top to bottom.
Assigns values to variables.
Executes function calls, loops, conditions, etc.
*/

function example() {
  console.log(typeof value);
  console.log(value);
  let value = 'hello';
}
example();