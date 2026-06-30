/*
=========================================================
Prototype Creation & Inheritance
=========================================================

Question:
Explain the difference between

1. Object.create(proto)
2. Object.setPrototypeOf(obj, proto)
3. class ... extends

Also explain performance differences.

=========================================================
1. Object.create(proto)
=========================================================

Creates a NEW object whose prototype is `proto`.

Prototype is assigned DURING object creation.

Syntax
*/

const animal = {
    speak() {
        console.log("Animal");
    }
};

const dog = Object.create(animal);

dog.speak(); // Animal

/*
Prototype Chain

dog
 │
 ▼
animal
 │
 ▼
Object.prototype
 │
 ▼
null

---------------------------------------------------------

When to use?

✔ Create a new object with a specific prototype.
✔ Preferred over changing prototype later.

Performance

✔ Fast
✔ Engine can optimize object from the beginning.
✔ No prototype mutation.
*/


/*
=========================================================
2. Object.setPrototypeOf(obj, proto)
=========================================================

Changes an EXISTING object's prototype.

Syntax
*/

const person = {
    name: "Seema"
};

const human = {
    walk() {
        console.log("Walking");
    }
};

Object.setPrototypeOf(person, human);

person.walk();

/*
Prototype Chain

person
 │
 ▼
human
 │
 ▼
Object.prototype

---------------------------------------------------------

Important

Prototype is changed AFTER object creation.

Performance

❌ Slower

Reason

JavaScript engines (V8, SpiderMonkey, JavaScriptCore)
optimize objects assuming their prototype does not change.

Changing the prototype later forces the engine to
discard those optimizations.
*/


/*
=========================================================
3. class ... extends
=========================================================

Modern ES6 syntax for inheritance.

*/

class Shape {
    getArea() {
        return 0;
    }
}

class Circle extends Shape {

    constructor(radius) {
        super();
        this.radius = radius;
    }

    getArea() {
        return Math.PI * this.radius ** 2;
    }
}

const c = new Circle(5);

console.log(c.getArea());

/*
Internally

extends roughly does this

Circle.prototype =
Object.create(Shape.prototype)

It also sets

constructor

and other internal links automatically.

Performance

✔ Fast
✔ Recommended
✔ Easy to read
✔ Engine friendly
*/


/*
=========================================================
Comparison
=========================================================

Object.create(proto)

✔ Creates NEW object
✔ Prototype assigned immediately
✔ Fast
✔ Recommended


Object.setPrototypeOf(obj, proto)

✔ Changes EXISTING object
❌ Slower
❌ Mutates prototype
❌ Can de-optimize engine


class extends

✔ Modern syntax
✔ Uses prototype inheritance internally
✔ Fast
✔ Most readable
*/


/*
=========================================================
Why is Object.setPrototypeOf slower?
=========================================================

JavaScript engines optimize objects.

Example

const obj = {
    x: 10,
    y: 20
};

Engine creates an internal structure
(often called a Hidden Class or Shape).

Hidden Class

obj

x
y

Access

obj.x

becomes extremely fast.


Now suppose

Object.setPrototypeOf(obj, newProto);

The engine must rethink

"What methods and properties can this object access now?"

Old optimization becomes invalid.

Engine throws away its cached assumptions.

This process is called

Hidden Class / Shape Invalidation

and causes de-optimization.
*/


/*
=========================================================
Hidden Classes (Shapes)
=========================================================

Hidden classes are internal engine structures.

They describe

✔ Property layout
✔ Property order
✔ Prototype

Example

const obj1 = {
    x: 10,
    y: 20
};

const obj2 = {
    x: 30,
    y: 40
};

Both share the SAME hidden class.

Fast property access.

After

Object.setPrototypeOf(obj2, newProto);

obj2

gets a different hidden class.

Engine must perform extra work.
*/


/*
=========================================================
Monomorphic vs Polymorphic
=========================================================

Monomorphic

Every object has the SAME shape.

Example

car.speed
bike.speed
bus.speed

Engine predicts property locations.

Very fast.


Polymorphic

Objects have DIFFERENT shapes.

Example

car.speed

bike.speed

bus.speed

truck.velocity

Different layouts.

Engine needs extra checks.

Slower.


Changing prototype dynamically often makes code
more polymorphic, reducing optimization.
*/


/*
=========================================================
Summary
=========================================================

Object.create(proto)

✔ Creates a new object with the given prototype.
✔ Prototype is fixed during creation.
✔ Fast and engine-friendly.

---------------------------------------------------------

Object.setPrototypeOf(obj, proto)

✔ Changes the prototype of an existing object.
✔ Causes hidden class/shape invalidation.
✔ Can de-optimize property access.
✔ Avoid in performance-critical code.

---------------------------------------------------------

class extends

✔ Modern syntax.
✔ Internally uses prototype inheritance.
✔ Automatically sets up prototype chain,
constructor, and super().
✔ Recommended for readability and maintainability.



Shape.call(this, ...) is conceptually the same as super(...) in a class.
Both execute the parent constructor and initialize the parent properties on the current object.

✔ Pre-ES6
function Shape(name) {
    this.name = name;
}

function Circle(radius) {
    Shape.call(this, "Circle"); // Parent constructor
    this.radius = radius;
}

✔ ES6
class Shape {
    constructor(name) {
        this.name = name;
    }
}

class Circle extends Shape {
    constructor(radius) {
        super("Circle"); // Parent constructor
        this.radius = radius;
    }
}

✅ Shape.call(this, "Circle") ≈ super("Circle")


So extends can work without you explicitly writing super(), but only if you don't define your own constructor.

class Shape {
    constructor(name) {
        this.name = name;
    }
}

class Circle extends Shape {
    // No constructor
}

const c = new Circle("Circle");

In this case, JavaScript automatically generates something like, here no need to write super:
constructor(...args) {
    super(...args);
}
*/