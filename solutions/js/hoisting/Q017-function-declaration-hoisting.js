/**
 * Block-scoped function declarations behave like let. Hence console.log(foo) would throw error ReferenceError, but typeOf foo behave like 
 * typeof nonExistingVariable. Hence no erro.
 */

'use strict'
function test() {
  console.log(typeof foo); //undefined
  if (true) {
    function foo() { return 'block'; }
  }
  console.log(typeof foo); //undefined
}
test();