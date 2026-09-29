JavaScript has 8 types: 7 primitives + `object`.

**Primitives** (immutable, compared by value):

```js
typeof 42            // "number"
typeof 10n           // "bigint"
typeof 'hi'          // "string"
typeof true          // "boolean"
typeof undefined     // "undefined"
typeof Symbol()      // "symbol"
typeof null          // "object"  <- spec bug, null is actually its own primitive type
```

**Non-primitive:**

```js
typeof {}            // "object"
typeof []            // "object"  (arrays are objects)
typeof function(){}  // "function"  (functions are objects, but typeof special-cases them)
```

**Quick notes on each:**
- `number` — all numbers are floats (IEEE 754 double), including integers. Includes `NaN`, `Infinity`.
- `bigint` — for integers beyond `Number.MAX_SAFE_INTEGER` (`2^53 - 1`). Written with an `n` suffix: `123n`.
- `string` — always immutable; methods like `.toUpperCase()` return new strings.
- `boolean` — `true` / `false`.
- `undefined` — a variable declared but not assigned.
- `null` — intentional "no value," set explicitly.
- `symbol` — unique, often used as hidden/non-colliding object keys.
- `object` — everything else: plain objects, arrays, functions, dates, maps, sets, etc.

**Checking type reliably:**

```js
Array.isArray([])                          // true (typeof [] just says "object")
Object.prototype.toString.call(null)       // "[object Null]"
Object.prototype.toString.call([])         // "[object Array]"
```

**Value vs. reference:** primitives copy by value, objects copy by reference — this trips people up constantly:

```js
let a = 5, b = a; b = 10;        // a is still 5
let x = {n: 5}, y = x; y.n = 10; // x.n is now 10 too
```JavaScript has 8 types: 7 primitives + `object`.

**Primitives** (immutable, compared by value):

```js
typeof 42            // "number"
typeof 10n           // "bigint"
typeof 'hi'          // "string"
typeof true          // "boolean"
typeof undefined     // "undefined"
typeof Symbol()      // "symbol"
typeof null          // "object"  <- spec bug, null is actually its own primitive type
```

**Non-primitive:**

```js
typeof {}            // "object"
typeof []            // "object"  (arrays are objects)
typeof function(){}  // "function"  (functions are objects, but typeof special-cases them)
```

**Quick notes on each:**
- `number` — all numbers are floats (IEEE 754 double), including integers. Includes `NaN`, `Infinity`.
- `bigint` — for integers beyond `Number.MAX_SAFE_INTEGER` (`2^53 - 1`). Written with an `n` suffix: `123n`.
- `string` — always immutable; methods like `.toUpperCase()` return new strings.
- `boolean` — `true` / `false`.
- `undefined` — a variable declared but not assigned.
- `null` — intentional "no value," set explicitly.
- `symbol` — unique, often used as hidden/non-colliding object keys.
- `object` — everything else: plain objects, arrays, functions, dates, maps, sets, etc.

**Checking type reliably:**

```js
Array.isArray([])                          // true (typeof [] just says "object")
Object.prototype.toString.call(null)       // "[object Null]"
Object.prototype.toString.call([])         // "[object Array]"
```

**Value vs. reference:** primitives copy by value, objects copy by reference — this trips people up constantly:

```js
let a = 5, b = a; b = 10;        // a is still 5
let x = {n: 5}, y = x; y.n = 10; // x.n is now 10 too
```


The 7 primitive types in JavaScript — immutable, compared/copied by value (not reference):

```js
typeof 42            // "number"
typeof 10n           // "bigint"
typeof 'hi'          // "string"
typeof true          // "boolean"
typeof undefined     // "undefined"
typeof Symbol()      // "symbol"
typeof null          // "object"  <- typeof bug; null is still a primitive
```

| Type | Example | Notes |
|---|---|---|
| `number` | `42`, `3.14`, `NaN` | IEEE 754 double, no separate int type |
| `bigint` | `123n` | for integers past `Number.MAX_SAFE_INTEGER` |
| `string` | `'hi'` | immutable, methods return new strings |
| `boolean` | `true`/`false` | |
| `undefined` | declared, unassigned | JS assigns this automatically |
| `null` | intentional "no value" | assigned explicitly |
| `symbol` | `Symbol('id')` | unique, mostly used as hidden object keys |

**"Immutable" and "by value"** are the key ideas:

```js
let a = 5;
let b = a;
b = 10;
// a is still 5 — b got a copy, not a link to a

let s = 'hello';
s.toUpperCase();   // returns 'HELLO', doesn't change s
s;                 // still 'hello'
```

Everything that isn't one of these 7 is an **object** (including arrays, functions, dates) — copied by reference instead of by value.

"Immutable" means the value itself can never be changed in place — no operation modifies it in memory. The only thing you can do is point the variable to a different value. It's not about const vs let; it's about the value type itself.

Think of a primitive value like a **printed number on paper** — you can't erase and rewrite it, you can only throw it away and get a new piece of paper.

```js
let x = 5;
x = x + 1;
```

This doesn't erase the `5` and turn it into `6`. It creates a **new** value `6`, and `x` now points to that instead. The `5` itself never changed — it just isn't used anymore.

**Easiest possible proof — strings:**

```js
let name = 'sam';
name[0] = 'S';        // try to change the first letter directly
console.log(name);    // still 'sam' — nothing happened
```

You *can't* edit a string in place. The only way to "change" it is to make a whole new one:

```js
name = 'Sam';          // this works — but it's a NEW string replacing the old
console.log(name);     // 'Sam'
```

**Compare to an object (mutable) — this is the opposite behavior:**

```js
let user = { name: 'sam' };
user.name = 'Sam';     // this DOES work — edits the same object
console.log(user.name); // 'Sam'
```

So:
- Primitive (`string`, `number`, etc.) → can't be edited, only replaced.
- Object (`{}`, `[]`) → can be edited directly, in place.

That's the whole idea of immutable vs mutable.


An integer is a `bigint` only when you explicitly say so — JS never auto-promotes a regular number into one, no matter how large it gets.

**Two ways to create one:**

```js
// 1. 'n' suffix on an integer literal
let big = 123n;
typeof big;          // "bigint"

// 2. BigInt() function
let big2 = BigInt(123);
typeof big2;         // "bigint"
```

**Regular numbers stay `number`, even past safe integer range — they just lose precision:**

```js
typeof 123                        // "number"
typeof 9007199254740993           // "number" — but this value is WRONG (rounds to ...992)

Number.MAX_SAFE_INTEGER           // 9007199254740991  (2^53 - 1)
9007199254740993 === 9007199254740992   // true — precision lost!
```

**When you actually need `bigint`:**

```js
9007199254740993n              // exact — correctly represented
BigInt(9007199254740993)        // ⚠️ already imprecise BEFORE conversion —
                                 // the number literal lost precision first
BigInt("9007199254740993")      // ✅ exact — pass as a string to avoid that trap
```

**Rule of thumb:** if an integer might exceed `Number.MAX_SAFE_INTEGER` (`2^53 - 1` ≈ 9 quadrillion) and you need exact precision — IDs, crypto, huge counters — use `bigint`, and always seed it from a string or literal, not from a `number` that's already lost precision.

One catch: you can't mix `bigint` and `number` in the same operation:

```js
10n + 5        // TypeError
10n + 5n       // 15n — fine
```

Symbol is for creating a value guaranteed to be **unique** — mainly used as an object key that will never accidentally clash with another key, even one with the exact same name.

**Basic creation:**

```js
const s1 = Symbol('id');
const s2 = Symbol('id');
s1 === s2;          // false — always unique, even with the same description
```

The string (`'id'`) is just a label for debugging — it has no effect on uniqueness.

**Use case 1 — "hidden" / collision-proof object properties**

```js
const id = Symbol('id');

const user = {
  name: 'Sam',
  [id]: 12345      // won't collide with any string key, even 'id'
};

console.log(user.name);   // 'Sam'
console.log(user[id]);    // 12345
console.log(Object.keys(user));   // ['name'] — symbol keys are skipped
```

This matters when writing a library: you can attach metadata to an object without risking a clash with whatever property names the consumer of your library already uses.

**Use case 2 — fixed set of constants that must never be equal to anything else**

```js
const PENDING = Symbol('pending');
const DONE = Symbol('done');

function setStatus(status) {
  if (status === PENDING) { /* ... */ }
}
```

Safer than using strings (`'pending'`), since a string can accidentally match user input; a symbol can't.

**Use case 3 — built-in protocol hooks** (more advanced, rarely written by hand)

```js
class Range {
  constructor(a, b) { this.a = a; this.b = b; }
  [Symbol.iterator]() {
    let cur = this.a, end = this.b;
    return {
      next: () => cur <= end
        ? { value: cur++, done: false }
        : { done: true }
    };
  }
}

[...new Range(1, 3)];   // [1, 2, 3] — works with for...of, spread, etc.
```

**When NOT to bother:** everyday code, plain data objects, API responses — just use strings. Symbols are for the narrow case where uniqueness/collision-avoidance genuinely matters.



ES6 introduced these main **built-in data structures/types**:

* **Map**
* **Set**
* **WeakMap**
* **WeakSet**

JavaScript's existing primitive types remain:

* String
* Number
* Boolean
* Undefined
* Null
* Symbol *(introduced in ES6)*

**ES6 new additions:** `Map`, `Set`, `WeakMap`, `WeakSet`, and `Symbol`.


These 4 were introduced in **ES6**:

| Type        | What it stores       | Duplicate?  | Key restriction  |
| ----------- | -------------------- | ----------- | ---------------- |
| **Map**     | Key → Value pairs    | Keys unique | Any type         |
| **Set**     | Values only          | ❌ No        | —                |
| **WeakMap** | Object → Value pairs | Keys unique | **Objects only** |
| **WeakSet** | Objects only         | ❌ No        | **Objects only** |

### 1. Map

Use when you need **key-value pairs**.

```js
const map = new Map();

map.set("name", "Seema");
map.set("age", 30);

map.get("name"); // Seema
```

Unlike normal objects, **Map keys can be objects, numbers, functions, etc.**

---

### 2. Set

Use when you need **unique values**.

```js
const set = new Set([1, 2, 2, 3]);

console.log(set); // 1, 2, 3
```

Useful for removing duplicates.

---

### 3. WeakMap

Like Map, but **keys must be objects**.

```js
const wm = new WeakMap();

const user = {};
wm.set(user, "private data");
```

Main reason to use it: **doesn't prevent the key object from being garbage collected.**

---

### 4. WeakSet

Like Set, but it stores **objects only** and doesn't prevent them from being garbage collected.

```js
const ws = new WeakSet();

const user = {};
ws.add(user);
```

**Easy memory trick:**

> **Map = key + value**
> **Set = unique values**
> **WeakMap = object key + value + garbage-collection friendly**
> **WeakSet = objects + garbage-collection friendly**


/*
| Feature                      | Map | WeakMap |
| ---------------------------- | --- | ------- |
| String keys                  | ✅   | ❌       |
| Number keys                  | ✅   | ❌       |
| Object keys                  | ✅   | ✅       |
| Automatic garbage collection | ❌   | ✅       |
| Iterable                     | ✅   | ❌       |
| `.size`                      | ✅   | ❌       |
*/
