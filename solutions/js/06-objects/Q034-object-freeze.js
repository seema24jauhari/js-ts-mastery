/*
============================================================
Q34 - Object.freeze vs Object.seal vs
       Object.preventExtensions vs const
Difficulty: Easy
Topic: Objects

Time Complexity : O(n)   (deepFreeze)
Space Complexity: O(d)   (recursion depth)
============================================================
*/

/*
============================================================
1. const
============================================================

const protects the VARIABLE, not the object.

✔ Cannot reassign variable
✔ Object can still be modified

*/

const user = {
  name: "John",
};

user.name = "John"; // ✅ Allowed
user.city = "Delhi"; // ✅ Allowed

console.log(user);

// user = {};      // ❌ TypeError

/*
============================================================
2. Object.preventExtensions()
============================================================

✔ Existing properties can be modified
✔ Existing properties can be deleted
❌ New properties cannot be added

*/

const obj1 = {
  name: "Alice",
};

Object.preventExtensions(obj1);

obj1.name = "Bob"; // ✅
delete obj1.name; // ✅

obj1.age = 25; // ❌ ignored (or TypeError in strict mode)

console.log(obj1);

/*
============================================================
3. Object.seal()
============================================================

✔ Existing properties can be modified
❌ Cannot delete properties
❌ Cannot add new properties

*/

const obj2 = {
  name: "Alice",
};

Object.seal(obj2);

obj2.name = "Bob"; // ✅

delete obj2.name; // ❌

obj2.age = 30; // ❌

console.log(obj2);

/*
============================================================
4. Object.freeze()
============================================================

❌ Cannot add properties
❌ Cannot delete properties
❌ Cannot modify properties

Highest level of protection.

*/

const obj3 = {
  name: "Alice",
};

Object.freeze(obj3);

obj3.name = "Bob"; // ❌

delete obj3.name; // ❌

obj3.age = 25; // ❌

console.log(obj3);

/*
============================================================
Object.freeze() is SHALLOW
============================================================

Only first level is frozen.

Nested objects remain mutable.

*/

const employee = {
  name: "John",
  address: {
    city: "Delhi",
  },
};

Object.freeze(employee);

employee.name = "Sam"; // ❌

employee.address.city = "Noida"; // ✅ Allowed

console.log(employee);

/*
Output

{
   name: "John",
   address: {
      city: "Noida"
   }
}

*/

/*
============================================================
deepFreeze()
============================================================

Recursively freezes every nested object.

Also handles circular references using WeakSet.

*/

function deepFreeze(obj, seen = new WeakSet()) {
  if (
    obj === null ||
    typeof obj !== "object" ||
    seen.has(obj)
  ) {
    return obj;
  }

  seen.add(obj);

  for (const key of Reflect.ownKeys(obj)) {
    deepFreeze(obj[key], seen);
  }

  return Object.freeze(obj);
}

/*
============================================================
Testing deepFreeze()
============================================================
*/

const company = {
  name: "ABC",
  address: {
    city: "Delhi",
    location: {
      sector: 62,
    },
  },
};

deepFreeze(company);

company.name = "XYZ"; // ❌

company.address.city = "Noida"; // ❌

company.address.location.sector = 70; // ❌

console.log(company);

/*
============================================================
Circular Reference Example
============================================================
*/

const person = {
  name: "John",
};

person.self = person;

deepFreeze(person);

console.log(Object.isFrozen(person)); // true

/*
Without WeakSet:

person
  ↓
self
  ↓
person
  ↓
self
  ↓
Infinite recursion

WeakSet prevents this.

*/

/*
============================================================
Arrays
============================================================

Arrays are also objects.

*/

const arr = [1, 2, [3, 4]];

Object.freeze(arr);

arr.push(5); // ❌

arr[0] = 100; // ❌

arr[2][0] = 99; // ✅ (nested array not frozen)

console.log(arr);

/*
============================================================
Functions
============================================================

Functions are objects.

*/

function greet() {}

greet.version = 1;

Object.freeze(greet);

greet.version = 2; // ❌

console.log(greet.version);

/*
============================================================
Map / Set
============================================================

Object.freeze() freezes only the wrapper object.

Internal Map/Set data can still change.

*/

const map = new Map();

Object.freeze(map);

map.set("name", "John"); // ✅ Still works

console.log(map.get("name"));

const set = new Set();

Object.freeze(set);

set.add(100); // ✅ Still works

console.log(set);

/*
============================================================
Comparison Table
============================================================

                    Add   Delete   Modify

const Variable       ❌*     —        —
const Object         ✅      ✅       ✅

preventExtensions    ❌      ✅       ✅

seal                 ❌      ❌       ✅

freeze               ❌      ❌       ❌

(* Cannot reassign the variable.)

*/

/*
============================================================
Useful Methods
============================================================

Object.isFrozen(obj)

Object.isSealed(obj)

Object.isExtensible(obj)

*/

/*
============================================================
Interview Points
============================================================

✔ const protects variable binding, not object contents

✔ preventExtensions blocks only new properties

✔ seal blocks add + delete

✔ freeze blocks add + delete + modify

✔ freeze is shallow

✔ deepFreeze recursively freezes nested objects

✔ Arrays and functions can be frozen

✔ Map and Set contents are NOT frozen

✔ WeakSet prevents infinite recursion
   in circular references

*/

/*
============================================================
structuredClone()
============================================================

Definition:
-----------
structuredClone() creates a TRUE DEEP COPY of an object.

The cloned object is completely independent of the original.
Changing the copy does NOT affect the original.

Supported:
✔ Objects
✔ Arrays
✔ Date
✔ Map
✔ Set
✔ RegExp
✔ ArrayBuffer
✔ TypedArrays
✔ Circular references

Not Supported:
✘ Functions
✘ DOM Nodes

*/

/*
============================================================
Example 1 - Nested Object
============================================================
*/

const user = {
  name: "John",
  address: {
    city: "Delhi",
  },
};

const userCopy = structuredClone(user);

userCopy.address.city = "Noida";

console.log(user.address.city);     // Delhi
console.log(userCopy.address.city); // Noida

/*
Original object is unchanged because
structuredClone() performs a deep copy.
*/

/*
============================================================
Example 2 - Array
============================================================
*/

const arr = [1, 2, [3, 4]];

const arrCopy = structuredClone(arr);

arrCopy[2][0] = 100;

console.log(arr);      // [1,2,[3,4]]
console.log(arrCopy);  // [1,2,[100,4]]

/*
Nested array is also cloned.
*/

/*
============================================================
Example 3 - Date
============================================================
*/

const today = new Date();

const todayCopy = structuredClone(today);

console.log(today instanceof Date);      // true
console.log(todayCopy instanceof Date);  // true

/*
Date object remains a Date.
*/

/*
============================================================
Example 4 - Map
============================================================
*/

const map = new Map([
  ["name", "John"],
]);

const mapCopy = structuredClone(map);

mapCopy.set("city", "Delhi");

console.log(map.size);      // 1
console.log(mapCopy.size);  // 2

/*
Map is deeply cloned.
*/

/*
============================================================
Example 5 - Set
============================================================
*/

const set = new Set([1, 2, 3]);

const setCopy = structuredClone(set);

setCopy.add(4);

console.log(set);      // Set(3)
console.log(setCopy);  // Set(4)

/*
Set is deeply cloned.
*/

/*
============================================================
Example 6 - Circular Reference
============================================================
*/

const person = {
  name: "John",
};

person.self = person;

const personCopy = structuredClone(person);

console.log(personCopy.self === personCopy); // true

/*
JSON.stringify() would fail here,
but structuredClone() supports circular references.
*/

/*
============================================================
Example 7 - Functions (Not Supported)
============================================================
*/

const obj = {
  greet() {
    console.log("Hello");
  },
};

// structuredClone(obj);   // ❌ DataCloneError

/*
Functions cannot be cloned.
*/

/*
============================================================
Real-world Uses
============================================================
*/

/*
------------------------------------------------------------
1. Editing API Data
------------------------------------------------------------
*/

const apiUser = {
  name: "John",
  address: {
    city: "Delhi",
  },
};

const editableUser = structuredClone(apiUser);

editableUser.address.city = "Noida";

console.log(apiUser.address.city);      // Delhi
console.log(editableUser.address.city); // Noida

/*
Why?

We don't want to modify the original API response.
*/

/*
------------------------------------------------------------
2. Undo / Redo
------------------------------------------------------------
*/

const currentState = {
  title: "Document",
  content: {
    text: "Hello",
  },
};

const backup = structuredClone(currentState);

currentState.content.text = "Updated";

console.log(currentState.content.text); // Updated
console.log(backup.content.text);       // Hello

/*
Undo = restore backup.
*/

/*
------------------------------------------------------------
3. Redux / React State
------------------------------------------------------------
*/

const state = {
  user: {
    name: "John",
  },
};

const newState = structuredClone(state);

newState.user.name = "John";

console.log(state.user.name);    // John
console.log(newState.user.name); // John

/*
Useful when working with nested state.
*/

/*
------------------------------------------------------------
4. Sorting without changing original
------------------------------------------------------------
*/

const products = [
  { id: 2 },
  { id: 1 },
];

const sortedProducts = structuredClone(products);

sortedProducts.sort((a, b) => a.id - b.id);

console.log(products);
// Original remains unchanged

console.log(sortedProducts);
// Sorted copy

/*
Useful when original order must remain unchanged.
*/

/*
============================================================
Comparison
============================================================

Spread (...)

✔ Fast
✔ Shallow Copy

const copy = { ...obj };

Nested objects are SHARED.

------------------------------------------------------------

JSON.parse(JSON.stringify())

✔ Deep copy

Limitations:

✘ Date becomes string
✘ Map lost
✘ Set lost
✘ Undefined removed
✘ Functions removed
✘ Circular references fail

------------------------------------------------------------

structuredClone()

✔ Deep copy
✔ Date
✔ Map
✔ Set
✔ Circular references
✔ TypedArrays

✘ Functions
✘ DOM nodes

*/

/*
============================================================
Summary
============================================================

✔ structuredClone() creates a true deep copy.

✔ Nested objects are cloned.

✔ Original object is never modified.

✔ Supports:
   - Object
   - Array
   - Date
   - Map
   - Set
   - RegExp
   - TypedArrays
   - Circular references

✔ Does NOT support:
   - Functions
   - DOM nodes

✔ Better than JSON.parse(JSON.stringify())
   for modern JavaScript applications.

*/