# JavaScript/TypeScript Mastery Curriculum — 300 Questions
### For Senior Web Developers Targeting FAANG+/Top-Tier Engineering Roles

**Format per question:** Question Number | Difficulty | Topic | Problem Statement | Expected Time Complexity | Expected Space Complexity | Hints | Edge Cases

**Note:** Solutions are NOT included. Ask for solutions one at a time by question number (e.g., "Solve Q47").

---

## SECTION 1: JavaScript Fundamentals (Q1–Q8)

### Q1
- **Difficulty:** Easy
- **Topic:** JavaScript Fundamentals
- **Problem Statement:** Explain the difference between `==` and `===` in JavaScript. Then, given the array `[0, '0', false, null, undefined, NaN, '', '  ', []]`, predict the output of comparing every pair using both operators and explain the coercion rules that produce each result.
- **Expected Time Complexity:** O(n²) for pairwise comparison (n = array length)
- **Expected Space Complexity:** O(1)
- **Hints:** Review the Abstract Equality Comparison Algorithm (ToNumber, ToPrimitive); `NaN !== NaN`; empty array is truthy but loosely-equal to `false` via `ToPrimitive`.
- **Edge Cases:** `null == undefined` is true but `null === undefined` is false; `[] == false`; `'  ' == 0`.

### Q2
- **Difficulty:** Easy
- **Topic:** JavaScript Fundamentals
- **Problem Statement:** Predict the output of the following code and explain why:
```js
console.log(typeof typeof 1);
console.log(typeof NaN);
console.log(typeof null);
console.log(typeof function(){});
console.log(typeof Symbol());
console.log(typeof 10n);
```
- **Expected Time Complexity:** O(1)
- **Expected Space Complexity:** O(1)
- **Hints:** `typeof` always returns a string; nested `typeof` calls return `"string"`; `null` is a historical bug in the language.
- **Edge Cases:** BigInt type, Symbol type, function vs object distinction.

### Q3
- **Difficulty:** Medium
- **Topic:** JavaScript Fundamentals
- **Problem Statement:** Write a robust `deepEqual(a, b)` function that correctly compares two values for deep structural equality, supporting primitives, objects, arrays, `Date`, `RegExp`, `Map`, `Set`, and circular references.
- **Expected Time Complexity:** O(n) where n is total number of properties/elements
- **Expected Space Complexity:** O(d) where d is max depth (recursion stack) plus O(n) for cycle-tracking structure
- **Hints:** Use a `WeakMap` to track visited object pairs for circular reference detection; handle `NaN === NaN` case explicitly; compare `Object.keys` lengths first.
- **Edge Cases:** Circular references, `NaN` values, `Map`/`Set` with different insertion order but same contents, objects with different prototypes, `Date` objects representing the same time.

### Q4
- **Difficulty:** Hard
- **Topic:** JavaScript Fundamentals
- **Problem Statement:** Explain JavaScript's type coercion rules in depth (`ToPrimitive`, `ToNumber`, `ToString`, `ToBoolean`) and write a function `predictCoercion(a, op, b)` that, given two values and an operator (`+`, `-`, `==`, `<`), returns the coerced result without using `eval`.
- **Expected Time Complexity:** O(1)
- **Expected Space Complexity:** O(1)
- **Hints:** `+` operator triggers `ToPrimitive` with `"default"` hint; `valueOf` vs `toString` precedence; `Symbol.toPrimitive`.
- **Edge Cases:** Objects with custom `Symbol.toPrimitive`, arrays in arithmetic context, `Date` objects with `+`.

### Q5
- **Difficulty:** Medium
- **Topic:** JavaScript Fundamentals
- **Problem Statement:** Debug the following code. It is supposed to create 5 buttons, each logging its own index when clicked, but all buttons log `5`. Identify the bug and provide two different fixes.
```js
for (var i = 0; i < 5; i++) {
  document.getElementById('btn' + i).addEventListener('click', function() {
    console.log(i);
  });
}
```
- **Expected Time Complexity:** O(n) for setup
- **Expected Space Complexity:** O(n) for closures
- **Hints:** `var` is function-scoped; consider `let` vs an IIFE vs `bind`.
- **Edge Cases:** What if the loop variable is mutated after listener registration but before click?

### Q6
- **Difficulty:** Hard
- **Topic:** JavaScript Fundamentals
- **Problem Statement:** Explain the difference between primitive values and reference values in JavaScript with respect to memory allocation (stack vs heap), copying semantics, and equality comparison. Then write code demonstrating a subtle bug caused by shallow-copying an object containing nested reference types, and fix it.
- **Expected Time Complexity:** O(n) for deep copy where n is total nested properties
- **Expected Space Complexity:** O(n)
- **Hints:** `Object.assign` and spread perform shallow copies; `structuredClone` for deep copies; primitives are immutable and compared by value.
- **Edge Cases:** Functions and `Symbol` properties are not cloned by `structuredClone`; copying objects containing `Date`, `Map`, `Set`.

### Q7
- **Difficulty:** Easy
- **Topic:** JavaScript Fundamentals
- **Problem Statement:** Predict the output:
```js
console.log(1 + '2' + 3);
console.log(1 + 2 + '3');
console.log('5' - 2);
console.log('5' + 2);
console.log(true + true);
console.log([] + []);
console.log([] + {});
console.log({} + []);
```
- **Expected Time Complexity:** O(1)
- **Expected Space Complexity:** O(1)
- **Hints:** `+` is left-associative; string presence forces concatenation; `{}` and `[]` are converted via `ToPrimitive`.
- **Edge Cases:** Behavior of `{} + []` differs in statement vs expression context.

### Q8
- **Difficulty:** Hard
- **Topic:** JavaScript Fundamentals
- **Problem Statement:** Explain "strict mode" (`"use strict"`) in JavaScript: list at least 6 behavioral differences it introduces, and explain why ES6 modules and classes are strict mode by default. Demonstrate one example where code behaves differently with and without strict mode.
- **Expected Time Complexity:** O(1)
- **Expected Space Complexity:** O(1)
- **Hints:** Silent failures become thrown errors; `this` in functions; octal literals; duplicate parameter names; `arguments` object behavior.
- **Edge Cases:** Assigning to a non-writable property, deleting an undeletable property, `this` being `undefined` vs global object in a plain function call.

---

## SECTION 2: Variables and Scope (Q9–Q14)

### Q9
- **Difficulty:** Easy
- **Topic:** Variables and Scope
- **Problem Statement:** Explain the differences between `var`, `let`, and `const` in terms of scope, hoisting behavior, redeclaration rules, and the Temporal Dead Zone (TDZ). Provide a code example that throws a `ReferenceError` due to TDZ.
- **Expected Time Complexity:** O(1)
- **Expected Space Complexity:** O(1)
- **Hints:** All three are hoisted, but `let`/`const` are not initialized until their declaration line; `var` is initialized to `undefined`.
- **Edge Cases:** `const` object mutation vs reassignment; redeclaring `var` in the same scope; block-scoped `let` inside a loop.

### Q10
- **Difficulty:** Medium
- **Topic:** Variables and Scope
- **Problem Statement:** Implement a function `createCounter()` using lexical scoping (without classes) that returns an object with `increment`, `decrement`, and `getValue` methods, where the internal counter state is fully private and cannot be accessed or mutated from outside except via these methods.
- **Expected Time Complexity:** O(1) per method call
- **Expected Space Complexity:** O(1)
- **Hints:** Use a closure over a local variable; consider how this differs from using a private class field.
- **Edge Cases:** Multiple independent counters created from the same factory must not share state; attempting `counter.count = 100` should not affect internal state.

### Q11
- **Difficulty:** Medium
- **Topic:** Variables and Scope
- **Problem Statement:** Explain lexical scoping vs dynamic scoping. JavaScript uses lexical scoping for variable resolution but `this` behaves "dynamically" in regular functions. Reconcile this apparent contradiction with examples covering global, function, block, and module scope.
- **Expected Time Complexity:** O(1)
- **Expected Space Complexity:** O(1)
- **Hints:** Scope chain is determined at definition time; `this` binding is determined at call time (except arrow functions, which lexically capture `this`).
- **Edge Cases:** `this` inside a nested regular function vs arrow function inside a method; `this` in a module's top level (`undefined` in strict ESM).

### Q12
- **Difficulty:** Hard
- **Topic:** Variables and Scope
- **Problem Statement:** Given the following code, predict the output and explain the scope chain resolution at each `console.log`:
```js
let x = 'global';
function outer() {
  let x = 'outer';
  function inner() {
    console.log(x);
    let x = 'inner';
    console.log(x);
  }
  inner();
}
outer();
```
- **Expected Time Complexity:** O(1)
- **Expected Space Complexity:** O(1)
- **Hints:** TDZ applies per-scope; the `let x` inside `inner` shadows the outer `x` for the *entire* function body, even before its declaration line.
- **Edge Cases:** What error is thrown, and at which line exactly?

### Q13
- **Difficulty:** Medium
- **Topic:** Variables and Scope
- **Problem Statement:** Implement a module pattern (using an IIFE, no ES modules) that exposes a public API for a `BankAccount` with `deposit`, `withdraw`, and `getBalance`, while keeping the balance variable completely inaccessible from the global scope. Demonstrate that `withdraw` cannot overdraw the account.
- **Expected Time Complexity:** O(1) per operation
- **Expected Space Complexity:** O(1)
- **Hints:** IIFE returning an object literal; closure captures `balance`.
- **Edge Cases:** Negative deposit amounts, withdrawing more than the balance, concurrent calls (conceptually — JS is single-threaded but discuss reentrancy via async operations).

### Q14
- **Difficulty:** Hard
- **Topic:** Variables and Scope
- **Problem Statement:** Explain global scope pollution and its risks in large applications. Then refactor the following script (which declares 10 global variables and functions) into a properly scoped module using ES modules, ensuring no symbol leaks to the global object.
```js
var apiUrl = 'https://api.example.com';
var cache = {};
function fetchData(id) { /* uses apiUrl, cache */ }
function clearCache() { cache = {}; }
// ... 7 more globals
```
- **Expected Time Complexity:** O(1)
- **Expected Space Complexity:** O(1)
- **Hints:** ES modules have their own scope by default; use named/default exports; consider a singleton module pattern for shared state like `cache`.
- **Edge Cases:** Circular module dependencies, mutable exported state being imported in multiple places (live binding behavior).

---

## SECTION 3: Hoisting (Q15–Q19)

### Q15
- **Difficulty:** Easy
- **Topic:** Hoisting
- **Problem Statement:** Predict the output of the following code and explain the hoisting behavior for each declaration type:
```js
console.log(a);
console.log(b);
console.log(c);
var a = 1;
let b = 2;
const c = 3;
console.log(foo());
function foo() { return 'hoisted'; }
console.log(bar());
var bar = function() { return 'not hoisted the same way'; };
```
- **Expected Time Complexity:** O(1)
- **Expected Space Complexity:** O(1)
- **Hints:** Function declarations are fully hoisted (including body); function expressions assigned to `var` only hoist the variable declaration.
- **Edge Cases:** Calling `bar()` before its assignment throws `TypeError`, not `ReferenceError` — explain why.

### Q16
- **Difficulty:** Medium
- **Topic:** Hoisting
- **Problem Statement:** Explain how hoisting interacts with `class` declarations. Predict the output:
```js
console.log(typeof MyClass);
class MyClass {
  constructor() { this.value = 42; }
}
const instance = new MyClass();
console.log(instance.value);
```
What happens if you try to access `MyClass` before the declaration line (e.g., `new MyClass()` before the class definition)?
- **Expected Time Complexity:** O(1)
- **Expected Space Complexity:** O(1)
- **Hints:** Classes are hoisted but remain in the TDZ until evaluated, similar to `let`/`const`.
- **Edge Cases:** `class` expressions vs `class` declarations; extending a class before it's defined.

### Q17
- **Difficulty:** Hard
- **Topic:** Hoisting
- **Problem Statement:** Given nested function declarations with the same name at different scopes, predict the output and explain the "function declaration hoisting" resolution order, including how it interacts with conditional blocks (a historically inconsistent area across engines):
```js
function test() {
  console.log(typeof foo);
  if (true) {
    function foo() { return 'block'; }
  }
  console.log(typeof foo);
}
test();
```
- **Expected Time Complexity:** O(1)
- **Expected Space Complexity:** O(1)
- **Hints:** In strict mode (and ES2015+ "Annex B" semantics), block-scoped function declarations behave like `let` for TDZ purposes at the block level but are also hoisted to the function scope as `var`-like with `undefined` initial value.
- **Edge Cases:** Behavior differences between strict and non-strict mode; differences between Node.js versions/engines historically.

### Q18
- **Difficulty:** Medium
- **Topic:** Hoisting
- **Problem Statement:** Write a small "hoisting linter" function `analyzeHoisting(sourceCode: string)` (you may use a simple regex/heuristic approach, not a full parser) that scans a JS code string and reports all `var` declarations that are used before their declaration line, flagging them as potential bugs.
- **Expected Time Complexity:** O(n) where n is source code length
- **Expected Space Complexity:** O(v) where v is number of var declarations
- **Hints:** Track line numbers of declarations vs usages; this is a heuristic tool, not a full static analyzer — state assumptions clearly.
- **Edge Cases:** Variable names inside string literals or comments should not be flagged; variables shadowed in nested functions.

### Q19
- **Difficulty:** Hard
- **Topic:** Hoisting
- **Problem Statement:** Explain the relationship between hoisting and the Temporal Dead Zone for `let`/`const`/`class` in terms of the JavaScript execution model (creation phase vs execution phase of the execution context). Then predict the output:
```js
function example() {
  console.log(typeof value);
  console.log(value);
  let value = 'hello';
}
example();
```
What is the precise error and at which `console.log`?
- **Expected Time Complexity:** O(1)
- **Expected Space Complexity:** O(1)
- **Hints:** `typeof` on a TDZ variable throws, unlike `typeof` on a truly undeclared variable.
- **Edge Cases:** Difference between `typeof undeclaredVar` (no error) and `typeof tdzVar` (ReferenceError).

---

## SECTION 4: Closures (Q20–Q26)

### Q20
- **Difficulty:** Easy
- **Topic:** Closures
- **Problem Statement:** Define a closure precisely. Then write a function `makeAdder(x)` that returns a function adding `x` to its argument. Explain what is captured in the closure and when it is garbage collected.
- **Expected Time Complexity:** O(1)
- **Expected Space Complexity:** O(1) per closure instance
- **Hints:** Closures capture variables by reference, not by value, at the time of the inner function's creation.
- **Edge Cases:** What happens to the closure if `x` is reassigned after `makeAdder` returns but the returned function hasn't been called yet?

### Q21
- **Difficulty:** Medium
- **Topic:** Closures
- **Problem Statement:** Implement a `memoize(fn)` higher-order function that caches results of expensive pure function calls based on their arguments, using closures for the cache storage. Support functions with multiple primitive arguments.
- **Expected Time Complexity:** O(1) amortized for cached lookups (excluding key serialization cost); O(f(n)) for cache misses where f is the original function's complexity
- **Expected Space Complexity:** O(c) where c is number of unique argument combinations cached
- **Hints:** Use `JSON.stringify` or a `Map` with composite keys for caching; consider cache key collisions.
- **Edge Cases:** Functions with object/array arguments (reference vs value equality), `NaN` as an argument, functions with side effects, unbounded cache growth (memory leak).

### Q22
- **Difficulty:** Hard
- **Topic:** Closures
- **Problem Statement:** Explain how closures can cause memory leaks in long-running applications (e.g., SPAs). Provide a concrete example involving event listeners and closures over large objects, and refactor it to prevent the leak.
- **Expected Time Complexity:** O(1)
- **Expected Space Complexity:** O(n) leaked vs O(1) fixed
- **Hints:** A closure retains references to its entire enclosing scope, not just the variables it uses; detached DOM nodes referenced by closures cannot be garbage collected.
- **Edge Cases:** `removeEventListener` requires the exact same function reference; closures inside `setInterval` that are never cleared.

### Q23
- **Difficulty:** Medium
- **Topic:** Closures
- **Problem Statement:** Predict the output of the following code, which is a classic closure-in-loop pitfall, and provide three distinct fixes (using `let`, an IIFE, and `bind`):
```js
const funcs = [];
for (var i = 0; i < 3; i++) {
  funcs.push(function() { return i; });
}
console.log(funcs.map(f => f()));
```
- **Expected Time Complexity:** O(n)
- **Expected Space Complexity:** O(n)
- **Hints:** All closures share the same `i` binding when using `var`.
- **Edge Cases:** What if `funcs.push` is replaced with `funcs.push(() => i)` — does the result change?

### Q24
- **Difficulty:** Hard
- **Topic:** Closures
- **Problem Statement:** Implement a `once(fn)` higher-order function that ensures `fn` is executed at most once, regardless of how many times the returned function is called, and caches/returns the result of the first call on all subsequent calls. Additionally, implement a variant `onceAsync(fn)` that handles async functions correctly, ensuring concurrent calls before resolution all receive the same promise (avoiding duplicate in-flight requests).
- **Expected Time Complexity:** O(1) per call after first invocation
- **Expected Space Complexity:** O(1)
- **Hints:** For `onceAsync`, store the promise itself (not just the resolved value) in the closure to handle race conditions.
- **Edge Cases:** First call throws an error — should subsequent calls retry or return the cached error? Specify and justify your design choice.

### Q25
- **Difficulty:** Hard
- **Topic:** Closures
- **Problem Statement:** Implement a private "event emitter" using closures (no classes) supporting `on(event, handler)`, `off(event, handler)`, `emit(event, ...args)`, and `once(event, handler)`. Ensure handlers cannot be accessed or enumerated from outside the emitter.
- **Expected Time Complexity:** O(h) for `emit` where h = number of handlers for that event; O(1) average for `on`/`off` with proper data structures
- **Expected Space Complexity:** O(h) total handlers registered
- **Hints:** Use a `Map<string, Set<Function>>` inside the closure; `off` must remove the exact function reference.
- **Edge Cases:** Emitting an event with no handlers, calling `off` with a handler that was never registered, a handler that throws (should it stop other handlers from running?), recursive `emit` calls from within a handler.

### Q26
- **Difficulty:** Hard
- **Topic:** Closures
- **Problem Statement:** Explain the difference between closures and the module pattern, and the difference between closures and currying/partial application. Then implement `curry(fn)` that converts a function of arity N into a series of unary functions, using closures to accumulate arguments, supporting both `curry(add)(1)(2)(3)` and `curry(add)(1, 2)(3)` styles.
- **Expected Time Complexity:** O(1) per partial application
- **Expected Space Complexity:** O(n) where n is total arguments accumulated
- **Hints:** Use `fn.length` to determine arity; accumulate arguments in an array captured by closure across nested returned functions.
- **Edge Cases:** Functions with default parameters or rest parameters (where `fn.length` is unreliable), variadic functions, calling with more arguments than arity.

---

## SECTION 5: Prototype & Inheritance (Q27–Q33)

### Q27
- **Difficulty:** Easy
- **Topic:** Prototype & Inheritance
- **Problem Statement:** Explain the prototype chain. Given `const arr = [1,2,3]`, trace the full prototype chain from `arr` up to `null`, naming each object in the chain and one method/property contributed by each.
- **Expected Time Complexity:** O(d) where d is chain depth
- **Expected Space Complexity:** O(1)
- **Hints:** `arr.__proto__ === Array.prototype`; `Array.prototype.__proto__ === Object.prototype`; `Object.prototype.__proto__ === null`.
- **Edge Cases:** Objects created with `Object.create(null)` have no prototype chain.

### Q28
- **Difficulty:** Medium
- **Topic:** Prototype & Inheritance
- **Problem Statement:** Implement classical (pre-ES6) inheritance manually using constructor functions and `Object.create`: create a `Shape` constructor with a `getArea` method on its prototype, and a `Circle` constructor that inherits from `Shape`, overriding `getArea`, and correctly setting up the prototype chain including the `constructor` property.
- **Expected Time Complexity:** O(1) for setup, O(1) per method call
- **Expected Space Complexity:** O(1)
- **Hints:** `Circle.prototype = Object.create(Shape.prototype)`; remember to reset `Circle.prototype.constructor = Circle`; call `Shape.call(this, ...)` inside `Circle`.
- **Edge Cases:** `instanceof` checks for both `Circle` and `Shape`; forgetting to reset the `constructor` property; using `Circle.prototype = Shape.prototype` (a common bug — explain why it's wrong).

### Q29
- **Difficulty:** Hard
- **Topic:** Prototype & Inheritance
- **Problem Statement:** Explain the difference between `Object.create(proto)`, `Object.setPrototypeOf(obj, proto)`, and the `class ... extends` syntax in terms of performance, prototype chain mutation timing, and engine optimizability. Why is mutating an object's prototype after creation (via `setPrototypeOf` or `__proto__` assignment) considered an anti-pattern in performance-critical code?
- **Expected Time Complexity:** O(1) for each operation, but discuss hidden class/shape invalidation costs
- **Expected Space Complexity:** O(1)
- **Hints:** V8 and other engines use "hidden classes"/"shapes" for object layout optimization; changing the prototype invalidates these optimizations and can deoptimize all code paths using that object.
- **Edge Cases:** Polymorphic vs monomorphic function calls when prototypes are changed dynamically.

### Q30
- **Difficulty:** Medium
- **Topic:** Prototype & Inheritance
- **Problem Statement:** Implement your own version of `Object.create` (call it `myObjectCreate(proto, propertiesObject)`) without using the built-in `Object.create`, supporting the optional second argument for defining properties via `Object.defineProperties`.
- **Expected Time Complexity:** O(1) plus O(p) for p properties defined
- **Expected Space Complexity:** O(1)
- **Hints:** Use a temporary constructor function whose `prototype` is set to `proto`, then `new` it; handle `proto === null` specially.
- **Edge Cases:** `proto` is `null` (cannot use the constructor trick directly — explain workaround or limitation), `proto` is not an object or `null` (should throw `TypeError`).

### Q31
- **Difficulty:** Hard
- **Topic:** Prototype & Inheritance
- **Problem Statement:** Predict the output and explain the mechanism:
```js
function Animal(name) { this.name = name; }
Animal.prototype.speak = function() { return `${this.name} makes a sound.`; };

function Dog(name) { Animal.call(this, name); }
Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.speak = function() { return `${this.name} barks.`; };

const d = new Dog('Rex');
console.log(d.speak());
console.log(d instanceof Animal);
console.log(d instanceof Dog);
console.log(Dog.prototype.constructor === Dog);
console.log(Object.getPrototypeOf(d) === Dog.prototype);
delete Dog.prototype.speak;
console.log(d.speak());
```
- **Expected Time Complexity:** O(1)
- **Expected Space Complexity:** O(1)
- **Hints:** After deleting `Dog.prototype.speak`, lookup falls through to `Animal.prototype.speak`.
- **Edge Cases:** `Dog.prototype.constructor` was never explicitly reset — what does it equal, and what's the consequence?

### Q32
- **Difficulty:** Hard
- **Topic:** Prototype & Inheritance
- **Problem Statement:** Implement a mixin system in JavaScript that allows composing multiple behaviors into a class without using multiple inheritance, e.g., `class Player extends mix(Serializable, Loggable, EventEmitter) {}`. Each mixin should be a function that takes a superclass and returns a new class extending it.
- **Expected Time Complexity:** O(m) for m mixins applied
- **Expected Space Complexity:** O(m) for the resulting prototype chain depth
- **Hints:** Each mixin is `(Base) => class extends Base { ... }`; `mix` reduces over the list of mixins.
- **Edge Cases:** Method name collisions between mixins (later mixin wins — discuss implications), mixins that need to call `super`, diamond-shaped composition.

### Q33
- **Difficulty:** Staff
- **Topic:** Prototype & Inheritance
- **Problem Statement:** Explain "prototype pollution" as a security vulnerability: how can an attacker exploit `Object.prototype` via unsafe object merging (e.g., a naive deep-merge utility) to inject properties that affect the entire application? Write a vulnerable `deepMerge(target, source)` function, demonstrate the exploit with `JSON.parse('{"__proto__": {"isAdmin": true}}')`, and then write a secure version.
- **Expected Time Complexity:** O(n) for merge where n is total properties
- **Expected Space Complexity:** O(n)
- **Hints:** Block `__proto__`, `constructor`, and `prototype` keys explicitly, or use `Object.create(null)` for target objects, or use `Map` instead of plain objects for user-controlled data.
- **Edge Cases:** Nested `__proto__` several levels deep, `constructor.prototype` pollution path, libraries like lodash historically affected (CVE references).

---
