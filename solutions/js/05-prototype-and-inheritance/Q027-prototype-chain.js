/*
=========================================================
Prototype Chain
=========================================================

Definition:
The prototype chain is the sequence of prototype objects
JavaScript searches when a property or method is not found
on the object itself.

Example:
const arr = [1, 2, 3];

When you call:

arr.push(4)

JavaScript searches in this order:

1. Does arr have push()?
   ❌ No

2. Check Array.prototype
   ✅ Found push()

3. If not found there, check Object.prototype

4. If still not found, stop at null and return undefined
   (or throw an error if you're trying to call it as a function).

---------------------------------------------------------
Prototype Chain
---------------------------------------------------------

arr
 │
 ▼
Array.prototype
 │
 ▼
Object.prototype
 │
 ▼
null

=========================================================
*/

const arr = [1, 2, 3];

/*
---------------------------------------------------------
Level 1 : arr (Own Properties)
---------------------------------------------------------

These properties belong directly to the array object.
*/

console.log(arr[0]);       // 1
console.log(arr.length);   // 3

/*
Own properties:

0 -> 1
1 -> 2
2 -> 3
length -> 3
*/


/*
---------------------------------------------------------
Level 2 : Array.prototype 

(__proto__:  is a property that points to an object's prototype (the object it inherits from).)
---------------------------------------------------------

arr does not have push(), map(), filter(), etc.

JavaScript looks in:


arr.__proto__

which is:

Array.prototype
*/

console.log(arr.__proto__ === Array.prototype); // true

// Methods contributed by Array.prototype

arr.push(4);
arr.pop();
arr.map(x => x * 2);
arr.filter(x => x > 1);


/*
---------------------------------------------------------
Level 3 : Object.prototype
---------------------------------------------------------

Array.prototype itself inherits from Object.prototype.
*/

console.log(Array.prototype.__proto__ === Object.prototype); // true

// Methods contributed by Object.prototype

console.log(arr.toString());

console.log(arr.hasOwnProperty("length"));


/*
---------------------------------------------------------
Level 4 : null
---------------------------------------------------------

Object.prototype is the last object in the chain.

Its prototype is null.

Search stops here.
*/

console.log(Object.prototype.__proto__); // null


/*
=========================================================
Visual Representation
=========================================================

arr
 │
 │ Own properties:
 │ 0
 │ 1
 │ 2
 │ length
 ▼
Array.prototype
 │
 │ push()
 │ pop()
 │ map()
 │ filter()
 ▼
Object.prototype
 │
 │ toString()
 │ hasOwnProperty()
 ▼
null

*/


/*
=========================================================
Property Lookup Example
=========================================================

arr.push(10)

Step 1:
Does arr have push()?
❌ No

Step 2:
Look inside Array.prototype
✅ Found push()

Execute push()

---------------------------------------------------------

arr.toString()

Step 1:
Does arr have toString()?
❌ No

Step 2:
Array.prototype?
❌ No

Step 3:
Object.prototype?
✅ Found toString()

Execute toString()

*/


/*
=========================================================
Edge Case
=========================================================

Objects created using Object.create(null)
have NO prototype.
*/

const obj = Object.create(null);

console.log(Object.getPrototypeOf(obj)); // null

// obj.toString(); // TypeError

/*
Prototype chain:

obj
 │
 ▼
null

No Object.prototype

No toString()

No hasOwnProperty()
*/


/*
=========================================================
Summary
=========================================================

For:

const arr = [1,2,3];

Prototype chain is:

arr
↓
Array.prototype   -> push(), pop(), map(), filter()
↓
Object.prototype  -> toString(), hasOwnProperty()
↓
null

Array.prototype inherits from Object.prototype.

So every array inherits all methods from Object.prototype in addition to array methods.

We can override the method:
   toString()
   valueOf()
   toLocaleString()
   hasOwnProperty()          // Not recommended
   isPrototypeOf()
   propertyIsEnumerable()


- Array-specific methods (push, pop, map, filter, forEach, slice, etc.) come from Array.prototype.
- General object methods (hasOwnProperty, valueOf, propertyIsEnumerable, etc.) come from Object.prototype.

JavaScript searches this chain whenever a property or
method is not found on the object itself.

*/