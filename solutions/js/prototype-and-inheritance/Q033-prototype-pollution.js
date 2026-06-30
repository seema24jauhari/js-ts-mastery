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
  name: "Seema",
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
  name: "Seema",
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

*/