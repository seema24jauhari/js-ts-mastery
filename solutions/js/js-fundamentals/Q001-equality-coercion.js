/**
 * Equality Corection
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
// Special rule in JavaScript.

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