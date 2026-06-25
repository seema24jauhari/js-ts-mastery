let x = 'global';
function outer() {
  let x = 'outer';
  function inner() {
    console.log(x);
    let x = 'inner';
    console.log(x);
  }
  inner();
}
outer();

// ReferenceError: Cannot access 'x' before initialization