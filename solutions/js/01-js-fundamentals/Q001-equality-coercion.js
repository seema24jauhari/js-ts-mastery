/**
 * Coercion = Automatic type conversion by JavaScript from one data type to another.
 * Equality Corection: 
 * 
 * It's a famous bug in the original JavaScript implementation (1995) that got permanently baked into the spec.
 * The reason: JS values were represented internally with a type tag plus the actual value, packed into a fixed-size unit. Objects had a type tag of 0. null was represented as the null pointer (0x00 — all zero bits), which meant its type tag also happened to read as 0, same as objects. So typeof null returned "object" by accident of implementation, not by design.
 * typeof null        // "object"  (bug)
 * typeof undefined   // "undefined"
 * typeof {}          // "object"
 * typeof []          // "object"
 *
 * Why it was never fixed: by the time this was noticed, real websites already depended on the existing behavior. Changing typeof null to "null" would break those sites, and JavaScript's backward-compatibility rule (don't break the web) means the bug just... stayed. It's permanent now.
 * 
 * 
 * isNaN actually corec the value in number and if fails return false
 * 
 * Number(undefined)  // NaN  -> no defined numeric value
 * Number({})         // NaN  -> plain object, no conversion rule
 * Number(null)       // 0    -> spec special-cases null to 0
 * Number([])         // 0    -> empty array -> '' -> 0
 */
const values = [0, '0', false, null, undefined, NaN, '', '  ', []];

console.log('==============================');
console.log('== vs === Pairwise Comparison');
console.log('==============================\n');

for (let i = 0; i < values.length; i++) {
  for (let j = i; j < values.length; j++) {
    const a = values[i];
    const b = values[j];

    console.log(
      `${String(a)} (${typeof a})  vs  ${String(b)} (${typeof b})`,
    );
    console.log('==  :', a == b);
    console.log('=== :', a === b);
    console.log('-----------------------------');
  }
}

console.log('\n==============================');
console.log('Important Explanations');
console.log('==============================\n');

console.log('1. null == undefined');
console.log(null == undefined);
// true
// Special rule in JavaScript.  if one side is null and the other is undefined, return true. Both mean "no value," so the language treats them as loosely equal.

console.log('\n2. null === undefined');
console.log(null === undefined);
// false
// Different types.

console.log('\n3. NaN == NaN');
console.log(NaN == NaN);
// false
// NaN is never equal to itself.

console.log('\n4. NaN === NaN');
console.log(NaN === NaN);
// false

console.log('\n5. [] == false');
console.log([] == false);
// true
// [] -> '' -> 0
// false -> 0
// 0 == 0

console.log('\n6. "0" == false');
console.log('0' == false);
// true
// '0' -> 0
// false -> 0

console.log('\n7. "" == false');
console.log('' == false);
// true
// '' -> 0
// false -> 0

console.log('\n8. "  " == 0');
console.log('  ' == 0);
// true
// Number('  ') => 0

console.log('\n9. typeof null');
console.log(typeof null);
// 'object'
// Historical JavaScript bug.

console.log('\n10. typeof NaN');
console.log(typeof NaN);
// 'number'

console.log('\n11. typeof typeof 1');
console.log(typeof typeof 1);
// 'string'

/*
|--------------------------------------------------------------------------
| Complexity
|--------------------------------------------------------------------------
|
| n = values.length
|
| Time Complexity: O(n²)
| Space Complexity: O(1)
|
*/