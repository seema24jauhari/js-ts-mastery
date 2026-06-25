/**
 * JavaScript Type Coercion Simulator
 *
 */

// ---------------- ToPrimitive ----------------

function toPrimitive(value, hint = 'default') {
  if (typeof value !== 'object' || value === null) {
    return value;
  }

  if (typeof value[Symbol.toPrimitive] === 'function') {
    return value[Symbol.toPrimitive](hint);
  }

  if (hint === 'string') {
    if (typeof value.toString === 'function') {
      const result = value.toString();
      if (typeof result !== 'object') return result;
    }

    if (typeof value.valueOf === 'function') {
      const result = value.valueOf();
      if (typeof result !== 'object') return result;
    }
  } else {
    if (typeof value.valueOf === 'function') {
      const result = value.valueOf();
      if (typeof result !== 'object') return result;
    }

    if (typeof value.toString === 'function') {
      const result = value.toString();
      if (typeof result !== 'object') return result;
    }
  }

  throw new TypeError('Cannot convert object to primitive value');
}

// ---------------- ToNumber ----------------

function toNumber(value) {
  if (typeof value === 'number') return value;
  if (typeof value === 'boolean') return value ? 1 : 0;
  if (value === null) return 0;
  if (value === undefined) return NaN;
  if (typeof value === 'string') return Number(value);
  if (typeof value === 'symbol') {
    throw new TypeError('Cannot convert Symbol to number');
  }

  return toNumber(toPrimitive(value, 'number'));
}

// ---------------- ToBoolean ----------------

function toBoolean(value) {
  return !!value;
}

// ---------------- Predict Coercion ----------------

function predictCoercion(a, op, b) {
  switch (op) {
    case '+': {
      const left = toPrimitive(a);
      const right = toPrimitive(b);

      if (
        typeof left === 'string' ||
        typeof right === 'string'
      ) {
        return String(left) + String(right);
      }

      return toNumber(left) + toNumber(right);
    }

    case '-':
      return toNumber(a) - toNumber(b);

    case '==': {
      if (Object.is(a, b)) return true;

      if (
        (a === null && b === undefined) ||
        (a === undefined && b === null)
      ) {
        return true;
      }

      if (typeof a === typeof b) {
        return a === b;
      }

      if (typeof a === 'boolean') {
        return predictCoercion(toNumber(a), '==', b);
      }


      if (typeof b === 'boolean') {
        return predictCoercion(a, '==', toNumber(b));
      }

      if (
        typeof a === 'string' ||
        typeof a === 'number'
      ) {

        if (typeof b === 'object' && b !== null) {
          return predictCoercion(a, '==', toPrimitive(b));
        }
      }

      if (
        typeof b === 'string' ||
        typeof b === 'number'
      ) {
        if (typeof a === 'object' && a !== null) {
          return predictCoercion(toPrimitive(a), '==', b);
        }
      }

      return toNumber(a) === toNumber(b);
    }

    case '<': {
      const left = toPrimitive(a, 'number');
      const right = toPrimitive(b, 'number');

      if (
        typeof left === 'string' &&
        typeof right === 'string'
      ) {
        return left < right;
      }

      return toNumber(left) < toNumber(right);
    }

    default:
      throw new Error(`Unsupported operator: ${op}`);
  }
}

// ---------------- TESTS ----------------

// console.log(predictCoercion('5', '+', 2));      // "52"
// console.log(predictCoercion('5', '-', 2));      // 3
// console.log(predictCoercion('', '==', false));  // true
// console.log(predictCoercion('  ', '==', 0));    // true
// console.log(predictCoercion([], '==', false));  // true
// console.log(predictCoercion([1], '+', 2));      // "12"
// console.log(predictCoercion([1], '-', 2));      // -1
// console.log(predictCoercion('10', '<', '2'));   // true
// console.log(predictCoercion('10', '<', 2));     // false

// // Symbol.toPrimitive example

const obj = {
  [Symbol.toPrimitive](hint) {
    return hint === 'number' ? 100 : 'custom';
  },
};

console.log(predictCoercion(obj, '+', 1)); // "custom1"

// // Date example

// const d = new Date('2026-01-01');
// console.log(predictCoercion(d, '+', '')); // date string