/**
 * Primitive vs Reference Values
 */

// ---------------- Primitives ----------------

let a = 10;
let b = a;

b = 20;

console.log(a); // 10
console.log(b); // 20

console.log(10 === 10); // true

// ---------------- References ----------------

const obj1 = { name: 'John' };
const obj2 = obj1;

obj2.name = 'John';

console.log(obj1.name); // John
console.log(obj2.name); // John

console.log({} === {}); // false
console.log([] === []); // false

// ---------------- Shallow Copy Bug ----------------

const user = {
  name: 'John',
  skills: ['JavaScript', 'TypeScript'],
  address: {
    city: 'Delhi',
    state: 'Delhi',
  },
};

const shallowCopy = { ...user };

shallowCopy.name="Tim"
shallowCopy.skills.push('MongoDB');
shallowCopy.address.city = 'Noida';

console.log(user)
console.log(shallowCopy);

console.log(shallowCopy.skills);
// ['JavaScript', 'TypeScript', 'MongoDB'] ❌

console.log(user.address.city);
// 'Noida' ❌

// ---------------- Fix: Deep Copy ----------------

const deepCopy = structuredClone(user);

deepCopy.skills.push('Redis');
deepCopy.address.city = 'Gurgaon';

console.log(user.skills);
// ['JavaScript', 'TypeScript', 'MongoDB']

console.log(deepCopy.skills);
// ['JavaScript', 'TypeScript', 'MongoDB', 'Redis']

console.log(user.address.city);
// 'Noida'

console.log(deepCopy.address.city);
// 'Gurgaon'

// ---------------- Date / Map / Set ----------------

const original = {
  date: new Date('2026-01-01'),
  map: new Map([
    ['name', 'John'],
    ['role', 'Tech Lead'],
  ]),
  set: new Set([1, 2, 3]),
};

const cloned = structuredClone(original);

console.log(cloned.date instanceof Date); // true
console.log(cloned.map instanceof Map); // true
console.log(cloned.set instanceof Set); // true



const obj = {
  date: new Date(),
};

const copy = JSON.parse(JSON.stringify(obj)); //used for simple objects deep copy

/* 
= modern deep copy API
= preserves Date, Map, Set and handles circular references
*/
const copy2 = structuredClone(obj) //

console.log(copy.date);
console.log(copy2.date);
