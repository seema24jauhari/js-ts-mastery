## SECTION 6: Objects (Q34–Q40)

### Q34
- **Difficulty:** Easy
- **Topic:** Objects
- **Problem Statement:** Explain the differences between `Object.freeze`, `Object.seal`, `Object.preventExtensions`, and `const`. Write code demonstrating that `Object.freeze` is shallow and provide a `deepFreeze(obj)` implementation.
- **Expected Time Complexity:** O(n) for `deepFreeze` where n = total nested properties
- **Expected Space Complexity:** O(d) recursion depth
- **Hints:** `Object.freeze` only prevents reassignment/addition/deletion of direct properties, not mutation of nested objects.
- **Edge Cases:** Freezing an object containing functions, arrays, `Map`/`Set` (note: `Map`/`Set` internals aren't frozen by `Object.freeze`), circular references in `deepFreeze`.

### Q35
- **Difficulty:** Medium
- **Topic:** Objects
- **Problem Statement:** Implement a `groupBy(array, keyFn)` function (similar to `Object.groupBy` / lodash's `groupBy`) that groups array elements into an object keyed by the result of `keyFn`. Then implement `Object.groupBy` from scratch and compare its output (a `null`-prototype object or `Map`-like grouping) to a naive `{}`-based implementation, discussing prototype pollution risk if `keyFn` can return arbitrary strings.
- **Expected Time Complexity:** O(n)
- **Expected Space Complexity:** O(n)
- **Hints:** Use `Object.create(null)` or a `Map` as the accumulator to avoid prototype pollution via keys like `"__proto__"`.
- **Edge Cases:** `keyFn` returns `"__proto__"`, `"constructor"`, or `"toString"`; empty array input; `keyFn` returns non-string (e.g., object) keys.

### Q36
- **Difficulty:** Hard
- **Topic:** Objects
- **Problem Statement:** Explain property descriptors (`writable`, `enumerable`, `configurable`) and `get`/`set` accessors via `Object.defineProperty`. Implement a `createImmutablePoint(x, y)` factory that returns an object with `x` and `y` as read-only properties (throwing in strict mode on write attempts) and a computed, non-enumerable `distance` getter that calculates distance from origin.
- **Expected Time Complexity:** O(1) for property access
- **Expected Space Complexity:** O(1)
- **Hints:** `writable: false` + strict mode throws `TypeError` on assignment; `enumerable: false` hides from `Object.keys`/`for...in`/`JSON.stringify`.
- **Edge Cases:** Attempting to redefine a `configurable: false` property; `JSON.stringify` output should exclude `distance` if non-enumerable but `console.log` (in some environments) may still show it — discuss.

### Q37
- **Difficulty:** Medium
- **Topic:** Objects
- **Problem Statement:** Predict the output and explain `for...in` vs `for...of` vs `Object.keys`/`Object.entries`/`Object.values` behavior with inherited and non-enumerable properties:
```js
const parent = { inherited: 'yes' };
const child = Object.create(parent);
child.own = 'ownValue';
Object.defineProperty(child, 'hidden', { value: 'secret', enumerable: false });

for (const key in child) console.log('for-in:', key);
console.log('Object.keys:', Object.keys(child));
console.log('Object.entries:', Object.entries(child));
```
- **Expected Time Complexity:** O(p) for p total properties (own + inherited)
- **Expected Space Complexity:** O(p)
- **Hints:** `for...in` iterates enumerable properties including inherited ones; `Object.keys`/`entries`/`values` only consider own enumerable properties.
- **Edge Cases:** `Symbol`-keyed properties are excluded from all of the above (need `Object.getOwnPropertySymbols`).

### Q38
- **Difficulty:** Hard
- **Topic:** Objects
- **Problem Statement:** Implement a generic `pick(obj, keys)` and `omit(obj, keys)` utility, fully typed if using TypeScript generics (here, focus on JS correctness), that correctly handle nested key paths like `'address.city'` (dot notation) for `pick` only — `omit` operates on top-level keys only. Handle missing intermediate paths gracefully.
- **Expected Time Complexity:** O(k * d) where k = number of keys, d = path depth
- **Expected Space Complexity:** O(k * d) for result object
- **Hints:** Split path strings on `.`; build nested result objects incrementally; for `omit`, shallow clone and `delete`.
- **Edge Cases:** Key path references a non-existent property, array indices in path (e.g., `'items.0.name'`), key collision when two paths share a prefix.

### Q39
- **Difficulty:** Staff
- **Topic:** Objects
- **Problem Statement:** Implement a `structuredClone` polyfill (`myStructuredClone(value)`) that handles primitives, plain objects, arrays, `Date`, `RegExp`, `Map`, `Set`, and circular references — but correctly throws (matching native behavior) for functions and DOM nodes, which are non-cloneable.
- **Expected Time Complexity:** O(n) where n is total nodes in the object graph
- **Expected Space Complexity:** O(n) for the clone plus O(n) for the visited-map
- **Hints:** Use a `Map<original, clone>` for cycle detection, populating the map *before* recursing into children so cycles resolve correctly.
- **Edge Cases:** Self-referencing objects (`obj.self = obj`), `Map`/`Set` containing objects that reference each other, `Date` with invalid value (`new Date('invalid')`), typed arrays (`Int32Array`, etc.).

### Q40
- **Difficulty:** Hard
- **Topic:** Objects
- **Problem Statement:** Explain `Symbol` and its use cases: unique property keys, well-known symbols (`Symbol.iterator`, `Symbol.toPrimitive`, `Symbol.toStringTag`, `Symbol.hasInstance`). Implement a class `Temperature` where `Symbol.toPrimitive` allows `+temp` to return the numeric Celsius value, `` `${temp}` `` to return a formatted string like `"25°C"`, and `Symbol.hasInstance` is used so `value instanceof Temperature` returns true for any object with a numeric `celsius` property (duck typing).
- **Expected Time Complexity:** O(1)
- **Expected Space Complexity:** O(1)
- **Hints:** `Symbol.toPrimitive(hint)` receives `'number'`, `'string'`, or `'default'`; `Symbol.hasInstance` is a static method defined with `Object.defineProperty` or `static [Symbol.hasInstance](instance)`.
- **Edge Cases:** What does `instanceof` do if `Symbol.hasInstance` is overridden on a built-in like `Array`? Behavior with `null`/`undefined` operands to `instanceof`.

---

## SECTION 7: Arrays (Q41–Q48)

### Q41
- **Difficulty:** Easy
- **Topic:** Arrays
- **Problem Statement:** Explain the difference between mutating array methods (`push`, `pop`, `splice`, `sort`, `reverse`, `fill`, `copyWithin`) and non-mutating methods (`map`, `filter`, `slice`, `concat`, `toSorted`, `toReversed`). Given an array, demonstrate a bug caused by `sort()` mutating a shared array reference, and fix it using a non-mutating alternative.
- **Expected Time Complexity:** O(n log n) for sort, O(n) for others
- **Expected Space Complexity:** O(1) for in-place vs O(n) for copies
- **Hints:** `Array.prototype.sort` mutates and returns the same reference; `toSorted` (ES2023) returns a new array.
- **Edge Cases:** Sorting an array shared via closure across multiple consumers; sorting `[10, 1, 2]` with default comparator (lexicographic) vs numeric comparator.

### Q42
- **Difficulty:** Medium
- **Topic:** Arrays
- **Problem Statement:** Implement `Array.prototype.flat(depth)` and `Array.prototype.flatMap(fn)` from scratch as standalone functions `myFlat(arr, depth)` and `myFlatMap(arr, fn)`, supporting `Infinity` as depth and handling sparse arrays correctly (sparse holes should be skipped, matching native behavior).
- **Expected Time Complexity:** O(n) for `flatMap`; O(n * d) worst case for `flat` where d is depth (but O(total elements) in practice)
- **Expected Space Complexity:** O(n) for result
- **Hints:** Use recursion with a depth counter; `Array.isArray` to detect nested arrays; for sparse arrays, use `in` operator or `Object.keys` rather than naive indexing.
- **Edge Cases:** `depth = 0` (no flattening), `depth = Infinity` with deeply nested arrays (stack overflow risk — discuss iterative alternative), sparse arrays like `[1, , 3]`.

### Q43
- **Difficulty:** Hard
- **Topic:** Arrays
- **Problem Statement:** Given a large array (millions of elements) of objects `{ id: number, category: string, value: number }`, write the most performant way to compute the sum of `value` grouped by `category`, comparing the performance characteristics of: (a) `reduce` with object accumulator, (b) `Map`-based accumulator, (c) a for-loop with a plain object using `Object.create(null)`. Explain why one approach is significantly faster in V8 for this scale, referencing hidden classes and hash map implementations.
- **Expected Time Complexity:** O(n) for all approaches
- **Expected Space Complexity:** O(k) where k = number of distinct categories
- **Hints:** `Map` avoids prototype chain lookups and hidden-class transitions that occur when dynamically adding string keys to plain objects; `reduce` has function call overhead per iteration vs a for-loop.
- **Edge Cases:** Category values that collide with `Object.prototype` method names (`"toString"`, `"hasOwnProperty"`) when using plain objects.

### Q44
- **Difficulty:** Medium
- **Topic:** Arrays
- **Problem Statement:** Implement `Array.prototype.reduce` from scratch as `myReduce(arr, callback, initialValue)`, correctly handling: the case where `initialValue` is omitted (using the first element as the initial accumulator and starting iteration from index 1), empty arrays with no `initialValue` (must throw `TypeError`), and sparse arrays (skip holes).
- **Expected Time Complexity:** O(n)
- **Expected Space Complexity:** O(1)
- **Hints:** Match the exact native error message/behavior for `[].reduce((a,b) => a+b)`.
- **Edge Cases:** Empty array with `initialValue` provided (returns `initialValue` without calling callback), single-element array with no `initialValue`, array containing `undefined`/`null` values vs actual holes.

### Q45
- **Difficulty:** Hard
- **Topic:** Arrays
- **Problem Statement:** Implement a function `chunk(array, size)` that splits an array into chunks of a given size (last chunk may be smaller), and a function `zip(...arrays)` that combines multiple arrays element-wise into an array of tuples, stopping at the shortest array's length. Provide both imperative and functional (using `reduce`/`Array.from`) implementations and discuss the performance trade-off.
- **Expected Time Complexity:** O(n) for `chunk`; O(n * m) for `zip` where n = shortest length, m = number of arrays
- **Expected Space Complexity:** O(n) for both
- **Hints:** `Array.from({ length: ... }, (_, i) => ...)` is a common functional pattern for `zip`.
- **Edge Cases:** `size <= 0` for `chunk` (should throw or return empty?), `zip()` with no arguments, `zip` with arrays of different lengths, empty input array.

### Q46
- **Difficulty:** Hard
- **Topic:** Arrays
- **Problem Statement:** You're given an array of timestamped events `{ timestamp: number, type: string }[]`, potentially unsorted and containing duplicates. Implement `getEventRateWindows(events, windowSizeMs)` that returns, for each unique event type, the maximum number of events of that type occurring within any sliding window of `windowSizeMs` duration. Optimize for large inputs (millions of events).
- **Expected Time Complexity:** O(n log n) for sorting plus O(n) for the sliding window pass per event type, overall O(n log n)
- **Expected Space Complexity:** O(n) for grouping plus O(k) for result, k = number of event types
- **Hints:** Sort each event-type's timestamps; use a two-pointer sliding window to find the max count within any window.
- **Edge Cases:** All events have the same timestamp, `windowSizeMs = 0`, single event, events with timestamps spanning years (numeric overflow considerations for very large timestamps — none in practice with `Number`, but discuss precision).

### Q47
- **Difficulty:** Medium
- **Topic:** Arrays
- **Problem Statement:** Predict the output and explain why, focusing on array length and sparse array semantics:
```js
const arr = [1, 2, 3];
arr[10] = 99;
console.log(arr.length);
console.log(arr);
console.log(arr.map(x => x * 2));
console.log(arr.filter(() => true));
arr.length = 2;
console.log(arr);
```
- **Expected Time Complexity:** O(n)
- **Expected Space Complexity:** O(1)
- **Hints:** `map`/`filter`/`forEach` skip holes but preserve sparse structure in `map`'s output; setting `.length` to a smaller value truncates the array, deleting elements.
- **Edge Cases:** `arr.map(x => x*2)` on a sparse array — what is `arr.map(...)[5]`? Is it `undefined` or a hole?

### Q48
- **Difficulty:** Staff
- **Topic:** Arrays
- **Problem Statement:** Design and implement a `VirtualizedArray<T>` class for a frontend list virtualization use case (e.g., rendering 1 million rows but only ~50 in the DOM at a time). It should support `getVisibleRange(scrollTop, viewportHeight, itemHeight)` returning `{ startIndex, endIndex, offsetY }`, and handle variable-height items via `getVisibleRangeVariable(scrollTop, viewportHeight, heightFn)` using a precomputed prefix-sum array with binary search for O(log n) lookups.
- **Expected Time Complexity:** O(1) for fixed-height; O(log n) for variable-height (binary search); O(n) one-time prefix-sum construction
- **Expected Space Complexity:** O(n) for the prefix-sum array
- **Hints:** Binary search the prefix-sum array for the first index whose cumulative height exceeds `scrollTop`.
- **Edge Cases:** `scrollTop` near the end of the list (ensure `endIndex` doesn't exceed array bounds), dynamically changing item heights requiring prefix-sum recomputation (discuss incremental update strategy), zero-height items.

---

## SECTION 8: Functions (Q49–Q55)

### Q49
- **Difficulty:** Easy
- **Topic:** Functions
- **Problem Statement:** Explain the four ways `this` can be bound in JavaScript (default, implicit, explicit via `call`/`apply`/`bind`, and `new` binding) plus arrow function lexical `this`, and rank their precedence. Given a method extracted from an object and passed as a callback (losing its `this`), demonstrate the bug and three different fixes.
- **Expected Time Complexity:** O(1)
- **Expected Space Complexity:** O(1)
- **Hints:** `new` binding has highest precedence, then explicit binding, then implicit, then default; arrow functions ignore all of these and use enclosing lexical `this`.
- **Edge Cases:** `bind` called multiple times on the same function (only the first `bind` matters — "bind is permanent"), using `new` on a `bind`-result.

### Q50
- **Difficulty:** Medium
- **Topic:** Functions
- **Problem Statement:** Implement `Function.prototype.call`, `Function.prototype.apply`, and `Function.prototype.bind` from scratch (`myCall`, `myApply`, `myBind`) without using the native versions. `myBind` must support partial application and being used with `new` (i.e., the bound function can still be a constructor, in which case the bound `this` is ignored).
- **Expected Time Complexity:** O(n) for `apply`/`bind` with n arguments
- **Expected Space Complexity:** O(n)
- **Hints:** For `myCall`/`myApply`, temporarily assign the function as a property of the context object and invoke it; for `myBind`'s `new`-compatibility, check `this instanceof boundFn` inside the returned function.
- **Edge Cases:** `myCall`/`myApply` with `null`/`undefined` context (should default to global object in non-strict, stay `undefined`/`null` in strict — discuss), property name collisions when temporarily attaching the function, `myBind` combined with further partial application (`fn.bind(ctx, a).bind(null, b)`).

### Q51
- **Difficulty:** Hard
- **Topic:** Functions
- **Problem Statement:** Explain the differences between regular functions, arrow functions, and methods with respect to: `this` binding, `arguments` object availability, usability as constructors (`new`), `prototype` property, and generator/async support. Then explain why arrow functions cannot be used as object methods when the method needs to access the object via `this`, with a concrete buggy example and fix.
- **Expected Time Complexity:** O(1)
- **Expected Space Complexity:** O(1)
- **Hints:** Arrow functions have no own `this`, `arguments`, `super`, or `new.target`; they cannot be used with `new` (no `[[Construct]]`).
- **Edge Cases:** Arrow function as a class field (captures instance `this` correctly due to closure over constructor scope) vs arrow function as a prototype method (captures module/global `this`).

### Q52
- **Difficulty:** Medium
- **Topic:** Functions
- **Problem Statement:** Implement `compose(...fns)` and `pipe(...fns)` higher-order functions for functional composition, where `compose` applies functions right-to-left and `pipe` applies left-to-right. Support functions of any arity for the first function in the chain but unary for subsequent functions. Then use them to build a data transformation pipeline for an array of user objects (filter active users, map to display names, sort alphabetically).
- **Expected Time Complexity:** O(n * f) where n = data size, f = number of functions in the pipeline
- **Expected Space Complexity:** O(1) for the composition itself (excluding intermediate results if functions aren't lazy)
- **Hints:** `pipe = (...fns) => (...args) => fns.reduce((acc, fn, i) => i === 0 ? fn(...acc) : fn(acc), args)`.
- **Edge Cases:** Empty function list (should return identity), single function, functions that throw mid-pipeline (error propagation), async functions in the pipeline (does `pipe` handle promises automatically, or does the caller need `pipeAsync`?).

### Q53
- **Difficulty:** Hard
- **Topic:** Functions
- **Problem Statement:** Explain default parameters, rest parameters, and the `arguments` object, including how default parameters create their own scope (separate from the function body scope) which affects closures formed within default parameter expressions. Predict the output:
```js
function outer(a = (() => { console.log('default a'); return 1; })(), b = a + 1) {
  console.log(a, b);
}
outer();
outer(10);
outer(10, 20);
```
- **Expected Time Complexity:** O(1)
- **Expected Space Complexity:** O(1)
- **Hints:** Default parameter expressions are evaluated only when the argument is `undefined` (including explicitly passing `undefined`); each parameter's default has access to previously-declared parameters.
- **Edge Cases:** `outer(undefined, 5)` — does `a`'s default still execute? What about `outer(undefined, undefined)`?

### Q54
- **Difficulty:** Hard
- **Topic:** Functions
- **Problem Statement:** Implement a `retry(fn, options)` higher-order function for resilient API calls, where `options = { retries: number, delayMs: number, backoff: 'fixed' | 'exponential', shouldRetry: (error) => boolean }`. The function should return a new async function that retries `fn` on failure according to the options, supporting cancellation via an `AbortSignal`.
- **Expected Time Complexity:** O(r) calls in the worst case where r = retries
- **Expected Space Complexity:** O(1)
- **Hints:** Use `setTimeout` wrapped in a promise for delays; check `signal.aborted` before each retry and reject with an `AbortError` if aborted; exponential backoff: `delayMs * 2^attempt`.
- **Edge Cases:** `retries = 0` (should still attempt once), `shouldRetry` returns `false` on the first error (no retries even if `retries > 0`), abort signal triggered during a delay (must cancel the pending timeout), `fn` itself returns a rejected promise vs throws synchronously.

### Q55
- **Difficulty:** Staff
- **Topic:** Functions
- **Problem Statement:** Design a type-safe (conceptually — discuss even if implementing in plain JS) function overloading mechanism in JavaScript, since the language doesn't support it natively. Implement a `createOverload()` utility that allows registering multiple implementations of a function differentiated by argument count and/or runtime type checks (predicates), dispatching to the correct implementation at call time. Discuss the performance cost of runtime dispatch vs compile-time overload resolution (as in typed languages).
- **Expected Time Complexity:** O(o) per call where o = number of registered overloads (worst case, before a match is found)
- **Expected Space Complexity:** O(o)
- **Hints:** Store overloads as `{ predicate: (...args) => boolean, impl: Function }[]`; iterate and find the first matching predicate.
- **Edge Cases:** No matching overload found (throw a descriptive error), ambiguous overloads (two predicates match — which wins?), overloads differing only by argument count vs type.

---

## SECTION 9: ES6+ (Q56–Q60)

### Q56
- **Difficulty:** Easy
- **Topic:** ES6+
- **Problem Statement:** List and briefly demonstrate 8 significant features introduced in ES2015 (ES6) that are not covered elsewhere in this curriculum's dedicated sections (e.g., template literals, `for...of`, computed property names, tagged templates, `Symbol`, `Proxy`/`Reflect` basics, `WeakMap`/`WeakSet`, default exports). For each, give a one-line code example.
- **Expected Time Complexity:** O(1)
- **Expected Space Complexity:** O(1)
- **Hints:** Avoid overlap with closures, destructuring, classes, promises (covered in other sections).
- **Edge Cases:** N/A — survey question.

### Q57
- **Difficulty:** Hard
- **Topic:** ES6+
- **Problem Statement:** Implement a tagged template literal function `html` that performs basic HTML-escaping of interpolated values (to prevent XSS) while leaving the static template parts untouched, similar to libraries like `lit-html`'s sanitization concept. Demonstrate: `` html`<div>${userInput}</div>` `` correctly escapes `<script>` tags in `userInput`.
- **Expected Time Complexity:** O(n) where n = total string length
- **Expected Space Complexity:** O(n)
- **Hints:** Tagged template functions receive `(strings, ...values)`; escape `&`, `<`, `>`, `"`, `'` in each value before joining.
- **Edge Cases:** Values that are already "safe" (e.g., wrapped in a `SafeHTML` marker class) should not be double-escaped — design a way to mark trusted content.

### Q58
- **Difficulty:** Hard
- **Topic:** ES6+
- **Problem Statement:** Explain `WeakMap` and `WeakSet`: how they differ from `Map`/`Set` in terms of garbage collection, key constraints (objects only, no primitives), and lack of iteration/size. Implement a private-data pattern using `WeakMap` to store "private" fields for instances of a class `BankAccount`, demonstrating that the private data is inaccessible from outside and is garbage-collected when the instance is no longer referenced.
- **Expected Time Complexity:** O(1) for get/set
- **Expected Space Complexity:** O(1) per instance (amortized; doesn't prevent GC)
- **Hints:** A module-level `WeakMap<BankAccount, {balance: number}>` keyed by instance; compare to native `#privateFields` (ES2022).
- **Edge Cases:** Why can't `WeakMap` keys be primitives like strings or numbers? Why is `WeakMap` not iterable (`.forEach`, `.size` don't exist)?

### Q59
- **Difficulty:** Staff
- **Topic:** ES6+
- **Problem Statement:** Implement a reactive state object using `Proxy` and `Reflect`: `createReactive(target, onChange)` returns a proxy that calls `onChange(path, oldValue, newValue)` whenever any nested property is set (deep reactivity), and returns nested objects/arrays also wrapped in proxies lazily (on access). Avoid infinite recursion and double-wrapping of already-reactive objects.
- **Expected Time Complexity:** O(1) per get/set trap invocation (amortized); nested wrapping is lazy
- **Expected Space Complexity:** O(n) total for all wrapped nested objects, created lazily
- **Hints:** Use a `WeakMap` to cache proxies per target object to avoid re-wrapping; use `Reflect.set`/`Reflect.get` inside traps to preserve correct `this` and default behavior; track the property path for the `onChange` callback.
- **Edge Cases:** Setting a property to the same value (should `onChange` fire?), arrays — mutating methods like `push` internally set `.length` and indices, which should each trigger (or be batched into) change notifications; deleting properties (`deleteProperty` trap); circular object references.

### Q60
- **Difficulty:** Hard
- **Topic:** ES6+
- **Problem Statement:** Explain optional chaining (`?.`), nullish coalescing (`??`), and logical assignment operators (`??=`, `||=`, `&&=`) introduced in ES2020/ES2021. Predict the output and explain short-circuiting behavior:
```js
const obj = { a: { b: 0, c: null, d: false, e: '' } };
console.log(obj.a?.b ?? 'default');
console.log(obj.a?.c ?? 'default');
console.log(obj.a?.d ?? 'default');
console.log(obj.a?.e ?? 'default');
console.log(obj.x?.y?.z ?? 'default');
console.log(obj.a?.f?.());
let count = 0;
obj.a.b ||= 100;
obj.a.c ??= 100;
console.log(obj.a.b, obj.a.c);
```
- **Expected Time Complexity:** O(1)
- **Expected Space Complexity:** O(1)
- **Hints:** `??` only falls back on `null`/`undefined`, unlike `||` which falls back on any falsy value; optional chaining short-circuits the entire chain to `undefined` if any link is `null`/`undefined`, and `?.()` checks the function itself is callable/exists before invoking.
- **Edge Cases:** `obj.a?.f?.()` where `f` doesn't exist — does it throw or return `undefined`? Combining `?.` with `[]` notation: `obj.a?.['b']`.

---

## SECTION 10: Destructuring (Q61–Q65)

### Q61
- **Difficulty:** Easy
- **Topic:** Destructuring
- **Problem Statement:** Predict the output and explain each destructuring pattern:
```js
const { a, b: renamed, c = 10, ...rest } = { a: 1, b: 2, d: 4, e: 5 };
console.log(a, renamed, c, rest);

const [first, , third, ...others] = [1, 2, 3, 4, 5];
console.log(first, third, others);

const { x: { y = 5 } = {} } = {};
console.log(y);
```
- **Expected Time Complexity:** O(n)
- **Expected Space Complexity:** O(n)
- **Hints:** Default values apply only when the destructured value is `undefined`; nested default `= {}` prevents errors when destructuring from a missing nested object.
- **Edge Cases:** Destructuring `null` or `undefined` directly (`const { a } = null` throws); skipping elements with empty commas in array destructuring.

### Q62
- **Difficulty:** Medium
- **Topic:** Destructuring
- **Problem Statement:** Implement a function `swap(obj, key1, key2)` that swaps the values of two keys in an object using destructuring assignment (no temporary variable declared separately). Then implement a multi-variable swap for an array of N variables using a single destructuring statement, e.g., rotating `[a, b, c]` to `[b, c, a]`.
- **Expected Time Complexity:** O(1) for two-key swap; O(n) for N-variable rotation
- **Expected Space Complexity:** O(1)
- **Hints:** `[obj[key1], obj[key2]] = [obj[key2], obj[key1]]`.
- **Edge Cases:** Swapping when `key1 === key2`, swapping properties that don't exist on the object (results in `undefined`).

### Q63
- **Difficulty:** Hard
- **Topic:** Destructuring
- **Problem Statement:** Write a function `parseConfig({ host = 'localhost', port = 8080, options: { timeout = 5000, retries = 3 } = {}, ...extra } = {})` that destructures a deeply nested configuration object with multiple levels of defaults, and explain precisely what happens for each of these calls:
```js
parseConfig();
parseConfig({});
parseConfig({ host: 'example.com' });
parseConfig({ options: { timeout: 1000 } });
parseConfig({ options: null });
parseConfig(undefined);
```
- **Expected Time Complexity:** O(1)
- **Expected Space Complexity:** O(1)
- **Hints:** `parseConfig({ options: null })` will throw because destructuring `{ timeout = ... } = null` is invalid — explain precisely why (default only applies to `undefined`, not `null`).
- **Edge Cases:** The `options: null` case throwing a `TypeError` — identify exactly which line/operation throws.

### Q64
- **Difficulty:** Hard
- **Topic:** Destructuring
- **Problem Statement:** Given an API response shape that can be one of three variants (a discriminated union: `{ status: 'success', data: T }`, `{ status: 'error', error: string }`, `{ status: 'loading' }`), write a function `handleResponse(response)` using destructuring and a `switch` on `status` to safely extract and process the relevant fields, ensuring TypeScript-style exhaustiveness is conceptually maintained (discuss how you'd enforce exhaustiveness checking even in plain JS, e.g., via a default case that throws).
- **Expected Time Complexity:** O(1)
- **Expected Space Complexity:** O(1)
- **Hints:** Destructure inside each `case` block since the shape differs per variant; a `default` case calling a function that always throws can simulate exhaustiveness checking (`assertNever`).
- **Edge Cases:** `response.status` is an unexpected value not in the union (handle gracefully, don't crash the app), `response` is `null`/`undefined`.

### Q65
- **Difficulty:** Staff
- **Topic:** Destructuring
- **Problem Statement:** Explain the performance implications of destructuring large objects/arrays in hot code paths (e.g., inside a function called millions of times in a render loop), specifically regarding object shape stability, the cost of creating the `rest` object via `...rest`, and engine de-optimization. Refactor a hot-path function that destructures `{ x, y, z, ...metadata }` from every item in a 1M-element array, where `metadata` is unused, to avoid the unnecessary `rest` object allocation while preserving readability.
- **Expected Time Complexity:** O(n)
- **Expected Space Complexity:** O(1) after fix vs O(n) extra objects before fix
- **Hints:** `...rest` in destructuring creates a new object via an internal copy of all remaining own enumerable properties — this is not free; if `metadata` is never used, destructure only `{ x, y, z }`.
- **Edge Cases:** What if `metadata` IS needed but only conditionally (e.g., for logging in dev mode)? Discuss conditional destructuring strategies.

---
