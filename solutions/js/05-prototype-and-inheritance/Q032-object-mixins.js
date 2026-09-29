/*
=========================================================
Mixins in JavaScript
=========================================================
*/
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

const EventEmitter = {
  on(event, callback) {
    this._listeners ??= {};
    (this._listeners[event] ??= []).push(callback);
  },
  emit(event, data) {
    this._listeners?.[event]?.forEach(cb => cb(data));
  }
};

class ChatRoom {}
class UploadTask {}

Object.assign(ChatRoom.prototype, EventEmitter);
Object.assign(UploadTask.prototype, EventEmitter);

const room = new ChatRoom();
room.on('message', (msg) => console.log('Got:', msg));
room.emit('message', 'hello!');   // "Got: hello!"

/* Problem

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

Let's slow it down and build it piece by piece.

**Step 1: What is `(Base) => class extends Base {}` actually doing?**

Forget mixins for a second. This is just a **function that takes a class and returns a new, bigger class**:

```js
const Loggable = (Base) =>
    class extends Base {
        log() {
            console.log(`${this.name} logged.`);
        }
    };
```

Read it as: "give me any class (`Base`), and I'll hand you back a new class that has everything `Base` had, PLUS a `log()` method."

```js
class Character {
  constructor(name) { this.name = name; }
}

const Logged = Loggable(Character);   // Logged = Character + log()

const c = new Logged('Sam');
c.log();   // "Sam logged."
```

That's it. No `mix()`, no `reduce()` yet — just one function wrapping one class.

**Step 2: Stack multiple mixins by hand (before touching `reduce`)**

```js
const Step1 = Serializable(Character);     // Character + serialize()
const Step2 = Loggable(Step1);              // (Character + serialize) + log()
const Step3 = EventEmitter(Step2);          // (all of above) + emit()

class Player extends Step3 {}
```

Each mixin takes the *previous result* and adds more onto it. That's the whole trick — **chaining function calls, each wrapping the last.**

**Step 3: `mix()` just automates that chaining, using `reduce`**

```js
function mix(...mixins) {
    return mixins.reduce(
        (Base, mixin) => mixin(Base),
        Character
    );
}
```

This is *identical* to Step 2, just written as a loop instead of by hand:

```js
// reduce starts with Character, then does:
Base = Character
Base = Serializable(Base)   // Base = Serializable(Character)
Base = Loggable(Base)       // Base = Loggable(Serializable(Character))
Base = EventEmitter(Base)   // Base = EventEmitter(Loggable(Serializable(Character)))
// final Base is returned
```

`mixins.reduce((Base, mixin) => mixin(Base), Character)` reads as: "start with `Character`, then for each mixin in the list, call it on whatever we built so far."

**Step 4: Why does `mix(Serializable, Loggable, EventEmitter)` build the chain in that order?**

```
Character → Serializable → Loggable → EventEmitter → Player
```

Because `reduce` processes the array **left to right**: `Serializable` wraps `Character` first, `Loggable` wraps that result next, `EventEmitter` wraps last. So `EventEmitter`'s class ends up closest to `Player` in the prototype chain — which is exactly the diagram in your file.

---


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