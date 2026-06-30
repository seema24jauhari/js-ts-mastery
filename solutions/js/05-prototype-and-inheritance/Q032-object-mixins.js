/*
=========================================================
Mixins in JavaScript
=========================================================

Problem

JavaScript does NOT support multiple inheritance.

❌ class Player extends A, B {}

Instead, we use Mixins.

A mixin is a function that

1. Takes a superclass.
2. Returns a new class extending it.

Syntax

const Mixin = (Base) =>
    class extends Base {};

=========================================================
Step 1 : Base Class
=========================================================
*/

class Character {
    constructor(name) {
        this.name = name;
    }
}


/*
=========================================================
Step 2 : Create Mixins
=========================================================
*/

/*
Serializable Mixin
*/

const Serializable = (Base) =>
    class extends Base {

        serialize() {
            return JSON.stringify(this);
        }

    };


/*
Loggable Mixin
*/

const Loggable = (Base) =>
    class extends Base {

        log() {
            console.log(`${this.name} logged.`);
        }

    };


/*
EventEmitter Mixin
*/

const EventEmitter = (Base) =>
    class extends Base {

        emit(event) {
            console.log(`Event: ${event}`);
        }

    };


/*
=========================================================
Step 3 : mix() function
=========================================================

Applies mixins one after another.

reduce()

Base

↓

Serializable

↓

Loggable

↓

EventEmitter

*/

function mix(...mixins) {

    return mixins.reduce(

        (Base, mixin) => mixin(Base),

        Character // this is base class, it is to provide a base class, it can be class or constructor function not object 

    );

}


/*
=========================================================
Step 4 : Use Mixins
=========================================================
*/

class Player extends mix(
    Serializable,
    Loggable,
    EventEmitter
) {

}

const p = new Player("John");

console.log(p.name);

console.log(p.serialize());

p.log();

p.emit("START");


/*
=========================================================
Prototype Chain
=========================================================

Player

↓

EventEmitter

↓

Loggable

↓

Serializable

↓

Character

↓

Object

↓

null
*/


/*
=========================================================
Method Collision
=========================================================

Later mixin wins.

*/

const A = (Base) =>
    class extends Base {

        hello() {
            console.log("A");
        }

    };

const B = (Base) =>
    class extends Base {

        hello() {
            console.log("B");
        }

    };

class Test extends mix(A, B) {}

const t = new Test();

t.hello();

/*
Output

B

Reason

B is applied after A.

It overrides A's method.
*/


/*
=========================================================
super() inside Mixins
=========================================================

Mixins can call super.

*/

const Walkable = (Base) =>
    class extends Base {

        move() {
            console.log("Walking");
        }

    };


const Flyable = (Base) =>
    class extends Base {

        move() {

            super.move();

            console.log("Flying");
        }

    };


class Bird extends Flyable(
    Walkable(Character)
) {}

const b = new Bird("Bird");

b.move();
console.log(b.name)
/*

Output

Walking

Flying


-------------------Final inheritance chain--------------------------------

Character
    ↑
WalkableClass
    ↑
FlyableClass
    ↑
Bird




-------------------------Prototype chain of an object----------------------------

b
 │
 ▼
Bird.prototype
 │
 ▼
FlyableClass.prototype
 │
 ▼
WalkableClass.prototype
 │
 ▼
Character.prototype
 │
 ▼
Object.prototype
 │
 ▼
null

*/


/*
=========================================================
Complexity
=========================================================

Applying m mixins

Time

O(m)

Space

O(m)

Each mixin creates one extra class
in the prototype chain.
*/


/*
=========================================================
Summary
=========================================================

1. JavaScript has single inheritance.

2. Mixins simulate multiple inheritance.

3. A mixin is

(Base) => class extends Base {}

4. mix() applies mixins using reduce().

5. Later mixins override earlier ones.

6. Mixins can use super().

7. Mixins are preferred over deep
inheritance hierarchies for reusable
behaviors.
*/