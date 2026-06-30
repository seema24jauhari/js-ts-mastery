/*
===========================================
Q31 - Prototype & Inheritance
Difficulty: Hard
Time Complexity: O(1)
Space Complexity: O(1)
===========================================
*/

function Animal(name) {
  this.name = name;
}

Animal.prototype.speak = function () {
  return `${this.name} makes a sound.`;
};

function Dog(name) {
  Animal.call(this, name); // Borrow Animal constructor
}

// Inherit Animal.prototype
Dog.prototype = Object.create(Animal.prototype);

// Override speak()
Dog.prototype.speak = function () {
  return `${this.name} barks.`;
};

const d = new Dog("Rex");

console.log(d.speak());
console.log(d instanceof Animal);
console.log(d instanceof Dog);
console.log(Dog.prototype.constructor === Dog);
console.log(Object.getPrototypeOf(d) === Dog.prototype);
Dog.prototype.constructor = Dog; //fix constructor
console.log(Dog.prototype.constructor === Dog);


delete Dog.prototype.speak;

console.log(d.speak());

/*
====================
Output
====================

Rex barks.
true
true
false
true
Rex makes a sound.

====================
Explanation
====================

1. Animal constructor creates:
   this.name = name

2. Animal.prototype contains:
   speak() {
      return `${this.name} makes a sound.`
   }

3. Dog constructor calls:
      Animal.call(this, name)

   so Dog instances also receive:
      this.name

4. Inheritance:

      Dog.prototype = Object.create(Animal.prototype);

Prototype chain becomes:

d
 │
 ▼
Dog.prototype
 │
 ▼
Animal.prototype
 │
 ▼
Object.prototype
 │
 ▼
null

5. Dog overrides speak():

Dog.prototype.speak = function () {
    return `${this.name} barks.`;
};

Therefore

d.speak()

finds speak() immediately on Dog.prototype.

Output:

Rex barks.

------------------------------------------------

6. instanceof checks prototype chain.

Animal.prototype exists in d's chain

therefore

d instanceof Animal
→ true

Dog.prototype also exists

d instanceof Dog
→ true

------------------------------------------------

7. constructor property

Initially every function has

Dog.prototype = {
    constructor: Dog
}

But after executing

Dog.prototype = Object.create(Animal.prototype);

Dog.prototype becomes a brand new object whose prototype is
Animal.prototype.

That new object DOES NOT have its own constructor.

It inherits constructor from Animal.prototype:

Dog.prototype.constructor
        ↓
Animal

Therefore

Dog.prototype.constructor === Dog

is

false

Actual value:

Dog.prototype.constructor === Animal

Consequence:
- constructor points to Animal instead of Dog.
- Reflection code may identify the object incorrectly.
- Usually fixed by:

Dog.prototype.constructor = Dog;

------------------------------------------------

8.

Object.getPrototypeOf(d) === Dog.prototype

d's immediate prototype is Dog.prototype.

Output:

true

------------------------------------------------

9.

delete Dog.prototype.speak;

Now Dog.prototype no longer has speak().

Lookup proceeds like this:

d
 ↓
Dog.prototype      ❌ no speak
 ↓
Animal.prototype   ✅ speak found

So

d.speak()

calls Animal.prototype.speak()

Output:

Rex makes a sound.

====================
Method Lookup Before delete
====================

d
 │
 ▼
Dog.prototype
   speak()   ✅ found

====================
Method Lookup After delete
====================

d
 │
 ▼
Dog.prototype
   ❌ speak missing
 │
 ▼
Animal.prototype
   speak()   ✅ used

====================
Prototype Chain
====================

d
 │
 ▼
Dog.prototype
 │
 ▼
Animal.prototype
 │
 ▼
Object.prototype
 │
 ▼
null

====================
Key Concepts
====================

✔ Constructor stealing:
   Animal.call(this, name)

✔ Prototype inheritance:
   Object.create()

✔ Method overriding

✔ Prototype chain lookup

✔ instanceof checks prototype chain

✔ delete removes own property only

✔ Missing properties are searched higher in prototype chain

✔ constructor must usually be reset after
   Object.create()

Example:

Dog.prototype.constructor = Dog;


*/