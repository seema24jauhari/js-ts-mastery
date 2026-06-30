/*
=========================================================
Problem:
Implement classical inheritance (Pre-ES6)

Requirements:

1. Shape constructor
2. getArea() on Shape.prototype
3. Circle constructor
4. Circle inherits from Shape
5. Circle overrides getArea()
6. Fix constructor property
=========================================================
*/


/*
=========================================================
Step 1 : Parent Constructor
=========================================================
*/

function Shape(name) {
    this.name = name;
}


/*
=========================================================
Step 2 : Parent Prototype Method
=========================================================
*/

Shape.prototype.getArea = function () {
    return "Area is unknown";
};


/*
=========================================================
Step 3 : Child Constructor
=========================================================

Call Shape constructor so Circle gets
all Shape properties.
*/

function Circle(radius) {

    //Call the Shape constructor, but make this refer to the current Circle object
    Shape.call(this, "Circle");

    this.radius = radius;
}


/*
=========================================================
Step 4 : Inherit Prototype
=========================================================

Circle.prototype

↓

Shape.prototype
*/

Circle.prototype = Object.create(Shape.prototype);


/*
=========================================================
Step 5 : Fix constructor property
=========================================================

After Object.create(),

constructor becomes Shape.

Reset it to Circle.

function Shape() {
    this.type = "shape";
}

function Circle() {
    this.type = "circle";
}

Circle.prototype = Object.create(Shape.prototype);

const c = new Circle();

const another = new c.constructor();

console.log(another.type);
 
Output: shape
Expected: circle
*/

Circle.prototype.constructor = Circle;


/*
=========================================================
Step 6 : Override Parent Method
=========================================================
*/

Circle.prototype.getArea = function () {
    return Math.PI * this.radius * this.radius;
};


/*
=========================================================
Testing
=========================================================
*/

const circle = new Circle(5);

console.log(circle.name);      // Circle

console.log(circle.radius);    // 5

console.log(circle.getArea()); // 78.53981633974483


/*
=========================================================
Prototype Chain
=========================================================

circle
   │
   ▼
Circle.prototype
   │
   ▼
Shape.prototype
   │
   ▼
Object.prototype
   │
   ▼
null
*/


console.log(circle instanceof Circle); // true

console.log(circle instanceof Shape); // true

console.log(circle instanceof Object); // true



/*
=========================================================
Verify constructor
=========================================================
*/

console.log(circle.constructor === Circle); // true



/*
=========================================================
Common Mistake
=========================================================

❌ WRONG

Circle.prototype = Shape.prototype;

Both constructors now share the SAME prototype.

Changing one changes the other.
*/

/*
function Circle(radius){}

Circle.prototype = Shape.prototype;
*/

Circle.prototype.getName = function () {
    return this.name;
};

/*
If Circle.prototype === Shape.prototype

Then

Shape.prototype.getName

also exists!

Both point to SAME object.


This is why Object.create() is used.
*/

/*
=========================================================
Correct Way
=========================================================

Circle.prototype = Object.create(Shape.prototype);

Creates a NEW object whose prototype
is Shape.prototype.

Chain becomes

Circle.prototype
      │
      ▼
Shape.prototype

Both prototypes are different objects.
*/

console.log(Circle.prototype === Shape.prototype); // false



/*
=========================================================
Summary
=========================================================



Animal.call(this, name)
✅ Copies instance properties (this.name, this.age, etc.)
❌ Does not inherit prototype methods (speak(), walk(), etc.)
function Animal(name) {
  this.name = name;   // Instance property
}

Animal.prototype.speak = function () {}; // Prototype method

function Dog(name) {
  Animal.call(this, name);
}

const d = new Dog("Rex");

console.log(d.name);   // ✅ "Rex"
console.log(d.speak);  // ❌ undefined


============================================

Dog.prototype = Object.create(Animal.prototype)
✅ Inherits prototype methods
❌ Does not copy instance properties
Dog.prototype = Object.create(Animal.prototype);

const d = new Dog("Rex");

console.log(d.name);    // ✅ "Rex" (from call)
console.log(d.speak()); // ✅ Works (from prototype)


============================================================

Without fixing constructor:

const d = new Dog("Rex");

console.log(d.constructor === Animal); // true ❌
console.log(d.constructor === Dog);    // false


After fixing:

Dog.prototype.constructor = Dog;

const d = new Dog("Rex");
console.log(d.constructor === Dog);    // true ✅

Remember: constructor is just a reference. Fixing it does not affect inheritance—it only makes the reference accurate.

=============================================================


1. Parent constructor initializes parent properties.

2. Child constructor calls

Shape.call(this,...)

to inherit instance properties.

3. Prototype inheritance

Circle.prototype = Object.create(Shape.prototype)

4. Reset constructor

Circle.prototype.constructor = Circle

5. Override methods by defining them again
on Circle.prototype.

6. instanceof works because of the
prototype chain.


Object literal ({}): Used to create a single object.
Constructor function (function Person() {} + new): Used as a blueprint to create many similar objects and supports code reuse and inheritance.


Without a constructor:
const p1 = { name: "John", age: 30 };
const p2 = { name: "Tim", age: 28 };
const p3 = { name: "Amit", age: 35 };
You repeat the same structure again and again.

With a constructor:
function Person(name, age) {
    this.name = name;
    this.age = age;
}

const p1 = new Person("John", 30);
const p2 = new Person("Tim", 28);
const p3 = new Person("Amit", 35);
No duplication.
*/