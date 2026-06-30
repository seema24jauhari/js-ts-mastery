/**
 * Lexical Scoping vs Dynamic Scoping
 *
 * JavaScript uses Lexical Scoping.
 * JavaScript does NOT use Dynamic Scoping.
 *
 * Apparent confusion comes from `this`,
 * because `this` is determined at call time.
 */

/* --------------------------------------------------
   1. Lexical Scoping
-------------------------------------------------- */

const name = 'Global';

function outer() {
    const name = 'John';

    function inner() {
        console.log(name);
    }

    return inner;
}

const fn = outer();

function another() {
    const name = 'John';

    fn();
}

another();

/*
Output:
John

Reason:
inner() was defined inside outer().
Scope is decided where function is written,
not where it is called.
*/

/* --------------------------------------------------
   2. Dynamic Scoping (Hypothetical)
-------------------------------------------------- */

/*
If JS had dynamic scoping:

another()
  -> fn()
      -> inner()

inner would find:

name = "John"

because caller is another()

Output would be:

John

But JavaScript does NOT work this way.
*/

/* --------------------------------------------------
   3. Global Scope
-------------------------------------------------- */

const globalVar = 'global';

function testGlobal() {
    console.log(globalVar);
}

testGlobal();

/*
global
*/

/* --------------------------------------------------
   4. Function Scope
-------------------------------------------------- */

function testFunctionScope() {
    var a = 10;

    console.log(a);
}

testFunctionScope();

// console.log(a); // ReferenceError

/* --------------------------------------------------
   5. Block Scope
-------------------------------------------------- */

if (true) {
    let x = 100;
    const y = 200;

    console.log(x);
    console.log(y);
}

// console.log(x); // ReferenceError
// console.log(y); // ReferenceError

/* --------------------------------------------------
   6. Module Scope
-------------------------------------------------- */


// file1.js


// file2.js

import { name as name1 } from './partials/Q011-1.js';

console.log(name1);
/*
Variables in modules are not global.
They belong to module scope.
*/

/* --------------------------------------------------
   7. Why `this` looks dynamic
-------------------------------------------------- */

const person = {
    name: 'John',

    sayName() {
        console.log(this.name);
    }
};

person.sayName();

/*
John

this depends on caller.
*/

/* --------------------------------------------------
   8. Same function, different caller
-------------------------------------------------- */

function show() {
    console.log(this);
}

show();

/*
global object (non-strict)
undefined (strict mode)
*/

const obj = {
    show
};

obj.show();

/*
obj

Same function.
Different caller.
Different this.
*/

/* --------------------------------------------------
   9. Nested Regular Function
-------------------------------------------------- */

const user = {
    name: 'John',

    greet() {
        function inner() {
            console.log(this?.name);
        }

        inner();
    }
};

user.greet();

/*
undefined

Regular function gets its own this.
*/

/* --------------------------------------------------
   10. Arrow Function
-------------------------------------------------- */

const user2 = {
    name: 'John',

    greet() {
        const inner = () => {
            console.log(this.name);
        };
        inner();
    }
};

user2.greet();

/*
John

Arrow function captures lexical this.
*/

/* --------------------------------------------------
   11. ESM (ECMAScript Modules) Top-Level this
-------------------------------------------------- */
import * as temp from './partials/Q011-2.js'


/*
undefined

ES Modules run in strict mode.
*/

/* --------------------------------------------------
   Summary
-------------------------------------------------- */

/*
Lexical Scoping:
- Scope determined where function is defined.
- JavaScript uses lexical scoping.

Dynamic Scoping:
- Scope determined where function is called.
- JavaScript does NOT use dynamic scoping.

this:
- Regular function -> determined at call time.
- Arrow function -> lexically captured.

Scopes:
1. Global Scope
2. Function Scope
3. Block Scope
4. Module Scope
*/