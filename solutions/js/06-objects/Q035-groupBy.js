/*
============================================================
File: Q35-groupBy.js

Q35 - Implement groupBy() and Object.groupBy()

Difficulty: Medium
Topic: Objects

Time Complexity : O(n)
Space Complexity: O(n)
============================================================
*/

/*
============================================================
Problem Statement
============================================================

Implement:

1. groupBy(array, keyFn)

2. Object.groupBy() from scratch

Also explain why Object.create(null) is safer than {}.

*/

/*
============================================================
Example Data
============================================================
*/

const users = [
  { name: "Seema", city: "Delhi", age: 30 },
  { name: "Rahul", city: "Noida", age: 25 },
  { name: "John", city: "Delhi", age: 35 },
  { name: "Alice", city: "Mumbai", age: 28 },
];

/*
============================================================
1. Naive groupBy()
============================================================

Uses {}

Potential prototype pollution risk.

*/

function groupBy(array, keyFn) {
  const result = {};

  for (const item of array) {
    const key = String(keyFn(item));

    if (!result[key]) {
      result[key] = [];
    }

    result[key].push(item);
  }

  return result;
}

/*
============================================================
Testing
============================================================
*/

const groupedByCity = groupBy(users, user => user.city);

console.log(groupedByCity);

/*

Output

{
  Delhi: [
      ...
  ],
  Noida: [
      ...
  ],
  Mumbai: [
      ...
  ]
}

*/

/*
============================================================
Group By Age Category
============================================================
*/

const groupedByAge = groupBy(users, user =>
  user.age >= 30 ? "30+" : "Below 30"
);

console.log(groupedByAge);

/*
============================================================
2. Implement Object.groupBy()
============================================================

Uses Object.create(null)

No prototype exists.

Safer against prototype pollution.

*/

Object.myGroupBy = function (array, keyFn) {
  const result = Object.create(null);

  for (const item of array) {
    const key = String(keyFn(item));

    if (!result[key]) {
      result[key] = [];
    }

    result[key].push(item);
  }

  return result;
};

const grouped = Object.myGroupBy(users, user => user.city);

console.log(grouped);

/*
============================================================
Difference

{}

Prototype exists

↓

Object.prototype

↓

null

--------------------------------------------

Object.create(null)

Prototype

↓

null

No Object.prototype

*/

/*
============================================================
Prototype Pollution Example
============================================================
*/

const attackData = [
  {
    role: "__proto__",
    user: "Attacker",
  },
];

/*
Naive version
*/

const bad = groupBy(attackData, item => item.role);

console.log(bad);

/*

Because "__proto__" already exists on {}

unexpected behavior can occur.

*/

/*
Safe version
*/

const safe = Object.myGroupBy(
  attackData,
  item => item.role
);

console.log(safe);

/*

Output

[Object: null prototype] {
   "__proto__": [
      {
         role: "__proto__",
         user: "Attacker"
      }
   ]
}

"__proto__" becomes a NORMAL KEY.

*/

/*
============================================================
Why Object.create(null)?
============================================================

{}

↓

Object.prototype

↓

hasOwnProperty()

toString()

constructor

__proto__

already exist.

--------------------------------------------

Object.create(null)

↓

null

No inherited properties.

Every key belongs only to the object.

*/

/*
============================================================
Edge Case 1
Empty Array
============================================================
*/

console.log(groupBy([], x => x));

/*

{}

*/

/*
============================================================
Edge Case 2
Non-string Keys
============================================================
*/

const nums = [1, 2, 3, 4, 5];

const evenOdd = groupBy(nums, n =>
  n % 2 === 0 ? "Even" : "Odd"
);

console.log(evenOdd);

/*

{
   Odd:[1,3,5],
   Even:[2,4]
}

*/

/*
============================================================
Objects as Keys
============================================================
*/

const result = groupBy(nums, () => ({ id: 1 }));

console.log(result);

/*

{
   "[object Object]": [...]
}

Objects become strings.

*/

/*
============================================================
Using Map Instead
============================================================

Map allows ANY value as key.

*/

function groupByMap(array, keyFn) {
  const map = new Map();

  for (const item of array) {
    const key = keyFn(item);

    if (!map.has(key)) {
      map.set(key, []);
    }

    map.get(key).push(item);
  }

  return map;
}

const mapResult = groupByMap(users, user => user.city);

console.log(mapResult);

/*
============================================================
Advantages of Map
============================================================

✔ No prototype pollution

✔ Keys can be:

- Object
- Array
- Function
- Symbol
- Number
- String

No string conversion required.

*/

/*
============================================================
Comparison
============================================================

Naive {}

✔ Simple

✘ Prototype pollution possible

--------------------------------------------

Object.create(null)

✔ No prototype

✔ "__proto__" is normal key

✔ Recommended

--------------------------------------------

Map

✔ Safest

✔ Supports any key type

✔ No prototype pollution

*/

/*
============================================================
Summary
============================================================

✔ groupBy groups elements using keyFn()

✔ Time Complexity : O(n)

✔ Space Complexity : O(n)

✔ {} can be vulnerable to prototype pollution

✔ Object.create(null) avoids inherited properties

✔ Map is the safest accumulator

✔ Object.groupBy() should use
   Object.create(null)

✔ Non-string keys become strings in objects

✔ Map preserves original key types

*/