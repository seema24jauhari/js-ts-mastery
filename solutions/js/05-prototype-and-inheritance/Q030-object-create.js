/*
=========================================================
Implement Object.create()
=========================================================

Question:
Implement your own version of Object.create()

Function Signature

myObjectCreate(proto, propertiesObject)

Requirements

1. Don't use Object.create().
2. Support propertiesObject.
3. Throw TypeError if proto is invalid.
4. Handle proto === null.

=========================================================
How Object.create() Works
=========================================================

Object.create(proto)

↓

Creates a NEW object

↓

Sets its [[Prototype]] to proto

↓

Returns the object

Example

const animal = {
    speak() {
        console.log("Animal");
    }
};

const dog = Object.create(animal);

dog

 │
 ▼
animal

=========================================================
Solution
=========================================================
*/

function myObjectCreate(proto, propertiesObject) {

    // Step 1: Validate prototype
    if (proto !== null && typeof proto !== "object") {
        throw new TypeError("Prototype must be an object or null");
    }

    let obj;
    if (proto === null) {

    // Step 2: Handle null prototype
        obj = {};
        Object.setPrototypeOf(obj, null);
    }
    else {

        // Temporary constructor
        function Temp() {}

        // Set prototype
        Temp.prototype = proto;

        // Create object
        obj = new Temp();
    }

    // Step 3: Define properties (optional)
    if (propertiesObject) {
        Object.defineProperties(obj, propertiesObject);
    }

    return obj;
}


/*
=========================================================
Example 1
=========================================================
*/

const animal = {
    speak() {
        console.log("Animal");
    }
};

const dog = myObjectCreate(animal);

dog.speak(); // Animal

console.log(Object.getPrototypeOf(dog) === animal);
// true


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

*/


/*
=========================================================
Example 2
=========================================================
*/

const person = myObjectCreate(Object.prototype, {

    name: {
        value: "John",
        writable: true,
        enumerable: true
    },

    age: {
        value: 34,
        writable: false,
        enumerable: true
    }

});

console.log(person.name); // John
console.log(person.age);  // 34


/*
=========================================================
Example 3
=========================================================

Null prototype
*/

const dict = myObjectCreate(null);

dict.city = "Delhi";

console.log(dict.city);

console.log(Object.getPrototypeOf(dict));
// null


/*
=========================================================
Example 4
=========================================================

Invalid prototype
*/

try {

    myObjectCreate(100);

}
catch (e) {

    console.log(e.message);

}


/*
=========================================================
Why Temporary Constructor?
=========================================================

function Temp(){}

Temp.prototype = proto;

new Temp()

creates

object

 │
 ▼
proto

Exactly what Object.create(proto) does.


Without Temp

There is no direct way to create
an object with an arbitrary prototype
(excluding built-in Object.create()).
*/


/*
=========================================================
Complexity
=========================================================

Time

Prototype creation : O(1)

defineProperties : O(p)

Overall : O(1 + p)


Space

O(1)
*/


/*
=========================================================
Summary
=========================================================

1. Validate proto.

2. Create a temporary constructor.

3. Assign its prototype.

4. Create object using new.

5. Define optional properties.

6. Return object.

Special Case

If proto === null,

create an object and explicitly set
its prototype to null.
*/