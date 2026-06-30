/**
 * Equality Test
 */

function deepEqual(a, b, visited = new WeakMap()) {
    // Same reference or primitive equality
    if (Object.is(a, b)) return true;

    // One is null or not an object
    if (
        a === null ||
        b === null ||
        typeof a !== 'object' ||
        typeof b !== 'object'
    ) {
        return false;
    }

    // Different prototypes
    if (Object.getPrototypeOf(a) !== Object.getPrototypeOf(b)) {
        return false;
    } 

    // Circular reference handling
    if (visited.has(a)) {
        return visited.get(a) === b;
    }

    visited.set(a, b);

    // Date
    if (a instanceof Date && b instanceof Date) {
        return a.getTime() === b.getTime();
    }

    // RegExp
    if (a instanceof RegExp && b instanceof RegExp) {
        return a.source === b.source && a.flags === b.flags;
    }

    // Array
    if (Array.isArray(a) && Array.isArray(b)) {
        if (a.length !== b.length) return false;

        for (let i = 0; i < a.length; i++) {
        if (!deepEqual(a[i], b[i], visited)) {

            return false;
        }
        }

        return true;
    }

    // Map
    if (a instanceof Map && b instanceof Map) {
        if (a.size !== b.size) return false;

        for (const [keyA, valueA] of a) {
        let found = false;

        for (const [keyB, valueB] of b) {
            if (
                deepEqual(keyA, keyB, visited) &&
                deepEqual(valueA, valueB, visited)
            ) {
            found = true;
            break;
            }
        }

        if (!found) return false;
        }

        return true;
    }

    // Set
    if (a instanceof Set && b instanceof Set) {
        if (a.size !== b.size) return false;

        for (const valueA of a) {
        let found = false;

        for (const valueB of b) {
            if (deepEqual(valueA, valueB, visited)) {
            found = true;
            break;
            }
        }

        if (!found) return false;
        }

        return true;
    }

    // Plain objects
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);

    if (keysA.length !== keysB.length) return false;

    for (const key of keysA) {
        if (!Object.hasOwn(b, key)) return false;

        if (!deepEqual(a[key], b[key], visited)) {
        return false;
        }
    }

    return true;
}

/* ---------------- TESTS ---------------- */

console.log(deepEqual(1, 1)); // true
console.log(deepEqual(NaN, NaN)); // true

console.log(
  deepEqual(
    { name: 'John', skills: ['JS', 'TS'] },
    { name: 'John', skills: ['JS', 'TS'] }
  )
); // true

console.log(
  deepEqual(
    new Date('2026-01-01'),
    new Date('2026-01-01')
  )
); // true

console.log(
  deepEqual(
    /hello/gi,
    /hello/gi
  )
); // true

console.log(
  deepEqual(
    new Set([1, 2, 3]),
    new Set([3, 2, 1])
  )
); // true

console.log(
  deepEqual(
    new Map([
      ['a', 1],
      ['b', 2],
    ]),
    new Map([
      ['b', 2],
      ['a', 1],
    ])
  )
); // true

const obj1 = { name: 'A' };
obj1.self = obj1;

const obj2 = { name: 'A' };
obj2.self = obj2;

console.log(deepEqual(obj1, obj2)); // true