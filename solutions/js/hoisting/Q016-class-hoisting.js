/**
 * Hoisting is JavaScript's behavior of creating bindings for variables, functions, and classes during the memory creation phase before code execution. Different declarations are initialized differently: var gets undefined, function declarations get the full function object, while let, const, and class remain uninitialized in the Temporal Dead Zone until execution reaches their declaration.
 */
console.log(typeof MyClass);
class MyClass {
  constructor() { this.value = 42; }
}
const instance = new MyClass();
console.log(instance.value);