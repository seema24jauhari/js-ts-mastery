/*
============================================================
Q33 - Prototype Pollution (Security Vulnerability)
Difficulty: Staff
Topic: Prototype & Inheritance

Time Complexity : O(n)
Space Complexity: O(n)
============================================================
*/

/*
============================================================
What is Prototype Pollution?
============================================================

Prototype pollution is a security vulnerability where an attacker
injects properties into Object.prototype.

Since almost every object inherits from Object.prototype,
the injected properties become visible throughout the application.

Example:

Object.prototype.isAdmin = true;

const user = {};

console.log(user.isAdmin); // true

Although user never had an isAdmin property.

This can bypass authorization checks, modify application behavior,
or even lead to remote code execution in some libraries.

*/

/*
============================================================
Vulnerable deepMerge()
============================================================
*/

function deepMerge(target, source) {
  for (const key in source) {
    if (
      typeof source[key] === "object" &&
      source[key] !== null &&
      !Array.isArray(source[key])
    ) {
      if (!target[key]) {
    }
    target[key] = {};

      deepMerge(target[key], source[key]);
    } else {
      target[key] = source[key];
    }
  }

  return target;
}

/*
============================================================
Attack Payload
============================================================

JSON.parse() creates an object containing "__proto__".

The merge function blindly copies every key.

*/

const payload = JSON.parse(`
{
  "__proto__": {
    "isAdmin": true
  }
}
`);

const appConfig = {};

console.log("Before attack:");
console.log({}.isAdmin); // undefined

deepMerge(appConfig, payload);

console.log("\nAfter attack:");
console.log({}.isAdmin); // true  <-- Object.prototype polluted

/*
============================================================
Why did this happen?
============================================================

During merge:

target["__proto__"]

returns Object.prototype

Therefore recursion becomes

deepMerge(Object.prototype, { isAdmin: true })

which executes

Object.prototype.isAdmin = true

Now every object inherits it.

*/

/*
============================================================
Another Example
============================================================
*/

const user = {};

console.log(user.isAdmin); // true

if (user.isAdmin) {
  console.log("Access Granted");
}

/*
============================================================
How attackers exploit this
============================================================

Imagine application code:

if (user.isAdmin) {
    deleteDatabase();
}

Attacker sends:

{
   "__proto__": {
      "isAdmin": true
   }
}

Now every object appears to have

isAdmin = true

without ever modifying user.

*/

/*
============================================================
Secure Version
============================================================
*/

function secureDeepMerge(target, source) {
  const blockedKeys = ["__proto__", "prototype", "constructor"];

  for (const key in source) {
    // Block dangerous keys
    if (blockedKeys.includes(key)) {
      continue;
    }

    if (
      typeof source[key] === "object" &&
      source[key] !== null &&
      !Array.isArray(source[key])
    ) {
      if (!Object.prototype.hasOwnProperty.call(target, key)) {
        target[key] = {};
      }

      secureDeepMerge(target[key], source[key]);
    } else {
      target[key] = source[key];
    }
  }

  return target;
}

/*
============================================================
Testing Secure Version
============================================================
*/

// Remove pollution from previous demo
delete Object.prototype.isAdmin;

const safeTarget = {};

secureDeepMerge(safeTarget, payload);

console.log("\nSecure Merge:");
console.log({}.isAdmin); // undefined

/*
============================================================
Even Better Protection
============================================================

1. Use Object.create(null)

const obj = Object.create(null);

No prototype exists.

obj.__proto__ is treated as a normal key.

------------------------------------------------------------

2. Use Map instead of Object

const map = new Map();

User-controlled keys cannot pollute prototypes.

------------------------------------------------------------

3. Validate input

Reject:

__proto__
prototype
constructor

at every nesting level.

------------------------------------------------------------

4. Prefer trusted libraries

Older versions of lodash, jQuery, Hoek,
and several other libraries were affected by
prototype pollution CVEs.

Always keep dependencies updated.

*/

/*
============================================================
constructor.prototype Attack
============================================================

Attack payload:

{
  "constructor": {
    "prototype": {
      "isAdmin": true
    }
  }
}

If merge doesn't block:

constructor
prototype

the attacker may eventually modify:

Object.prototype

Modern secure merge utilities explicitly
block both keys.

*/

/*
============================================================
Prototype Pollution Flow
============================================================

Attacker JSON
        │
        ▼
{
  "__proto__": {
      "isAdmin": true
  }
}
        │
        ▼
Unsafe deepMerge()
        │
        ▼
Object.prototype.isAdmin = true
        │
        ▼
Every object inherits isAdmin

*/

/*
============================================================
Key Takeaways
============================================================

✔ Prototype pollution modifies Object.prototype

✔ Every normal object inherits polluted properties

✔ Unsafe deep merge utilities are common attack vectors

✔ Always block:
      - "__proto__"
      - "constructor"
      - "prototype"

✔ Prefer:
      - Object.create(null)
      - Map
      - Updated libraries

✔ Validate user-controlled object keys



_.merge() is a utility from the Lodash library that recursively merges objects, similar to deepMerge function

const _ = require("lodash");

const obj1 = {
  name: "John",
  address: {
    city: "Delhi"
  }
};

const obj2 = {
  address: {
    pincode: 110001
  }
};

_.merge(obj1, obj2);

console.log(obj1);

OUTPUT:


{
  name: "John",
  address: {
    city: "Delhi",
    pincode: 110001
  }
}


Why was it vulnerable?
Older versions did something like:


_.merge(target, JSON.parse('{
  "__proto__": {
    "isAdmin": true
  }
}'));

If _.merge() didn't block __proto__, it eventually executed:


Object.prototype.isAdmin = true;

Then:

const user = {};
console.log(user.isAdmin); // true 😱



#### Fix 1 — Object.create(null)

js
const obj = Object.create(null);

This creates an object with no prototype at all — not even the usual Object.prototype.

js
const safe = Object.create(null);
safe.__proto__ = { isAdmin: true };   // does NOTHING special now
console.log(safe.__proto__);           // { isAdmin: true } — just a normal property!
console.log(Object.prototype.isAdmin); // undefined — untouched

Why it works: __proto__ is only a magic setter because it's inherited from Object.prototype's getter/setter. Since Object.create(null) has no Object.prototype in its chain, __proto__ is just a plain string key like any other — completely inert.

js
{}.__proto__              // -> Object.prototype (magic)
Object.create(null).__proto__   // -> undefined, just a missing property (no magic)

### Fix 2 — Use Map instead of a plain object

js
const map = new Map();
map.set('__proto__', { isAdmin: true });
map.set(userSuppliedKey, userSuppliedValue);

Why it works: Map stores keys/values in an internal data structure, completely separate from the object property system. Setting a key called "__proto__" on a Map is just a normal key-value pair — it has zero connection to the object's actual prototype.

console.log(map.get('__proto__'));      // { isAdmin: true } — just data
console.log(Object.prototype.isAdmin);  // undefined — untouched

js
Map also sidesteps other related gotchas (constructor, hasOwnProperty as keys) since it doesn't use the prototype-based property lookup system at all — any string is just a key.


Real scenario: **counting word frequency from user-submitted text** — the keys come straight from user input, so they could be literally anything, including `__proto__`.

**The vulnerable version:**

```js
function wordFrequency(text) {
  const counts = {};
  const words = text.toLowerCase().split(/\s+/);
  for (const word of words) {
    counts[word] = (counts[word] || 0) + 1;
  }
  return counts;
}

wordFrequency("the cat sat on the __proto__ mat");
```

```js
counts['__proto__']        // doesn't create a key — it READS the prototype object
counts['__proto__'] = ...  // this WRITES to the prototype, not a new key!
```

That `(counts[word] || 0) + 1` line, when `word` is `"__proto__"`, ends up doing `counts.__proto__ = 1` — corrupting the prototype chain instead of storing a count. Depending on what's written, this can pollute every object app-wide.

**Fix 1 — `Object.create(null)` (best when you still want `obj[key]` syntax):**

```js
function wordFrequency(text) {
  const counts = Object.create(null);   // no prototype to pollute
  const words = text.toLowerCase().split(/\s+/);
  for (const word of words) {
    counts[word] = (counts[word] || 0) + 1;
  }
  return counts;
}

wordFrequency("the cat sat on the __proto__ mat");
// { the: 2, cat: 1, sat: 1, on: 1, __proto__: 1, mat: 1 }  -- safe, just a normal entry
```

**Fix 2 — `Map` (better when you'll also need size, iteration order, or non-string keys):**

```js
function wordFrequency(text) {
  const counts = new Map();
  const words = text.toLowerCase().split(/\s+/);
  for (const word of words) {
    counts.set(word, (counts.get(word) || 0) + 1);
  }
  return counts;
}

const result = wordFrequency("the cat sat on the __proto__ mat");
result.get('__proto__');   // 1 — just a normal entry, totally safe
result.size;                 // 6 — Map gives you this for free
```

---

**Other real cases where this bites teams in production:**
- **`JSON.parse`-ing request bodies and merging into config/settings objects** (npm's `lodash.merge` had a real CVE from exactly this)
- **Caching API responses keyed by user-supplied IDs** (`cache[userId] = data`)
- **Building a lookup table from CSV/form uploads** where column headers become keys

**Rule of thumb:** the moment an object's *keys* (not just values) come from outside your code — user input, uploaded files, query params, request bodies — use `Map` or `Object.create(null)` instead of `{}`.
*/