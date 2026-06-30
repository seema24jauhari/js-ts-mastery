# Why use Prototype?

## Question

If every object can access `sayHi()`, why do we need a prototype?

## Answer

Prototype is **NOT** about making methods accessible.

Prototype is about **sharing methods**.

- **Without prototype:** Every object gets its own copy of the method.
- **With prototype:** All objects share a single copy of the method.

This saves memory.

---

# Example 1: Without Prototype

```javascript
function Person(name) {
    this.name = name;

    // Every object gets a NEW function
    this.sayHi = function () {
        console.log(`Hi, I'm ${this.name}`);
    };
}

const p1 = new Person("John");
const p2 = new Person("Tim");

p1.sayHi();
p2.sayHi();

console.log(p1.sayHi === p2.sayHi); // false
```

### Memory Representation

```text
p1
├── name = "John"
└── sayHi()   <-- Function #1

p2
├── name = "Tim"
└── sayHi()   <-- Function #2
```

Even though both functions have the same code, they are **different function objects**.

---

# Example 2: Using Prototype

```javascript
function Employee(name) {
    this.name = name;
}

// Only ONE copy exists
Employee.prototype.sayHi = function () {
    console.log(`Hi, I'm ${this.name}`);
};

const e1 = new Employee("John");
const e2 = new Employee("Tim");

e1.sayHi();
e2.sayHi();

console.log(e1.sayHi === e2.sayHi); // true
```

### Memory Representation

```text
e1
├── name = "John"
│
▼
Employee.prototype
└── sayHi()

e2
├── name = "Tim"
│
▼
Employee.prototype
└── same sayHi()
```

Both objects share the **same function**.

---

# Why is this better?

Imagine creating **10,000 objects**.

### Without Prototype

```text
10,000 Person objects
10,000 copies of sayHi()
```

### With Prototype

```text
10,000 Person objects
1 copy of sayHi()
```

This uses much less memory.

---

# Comparison

| Without Prototype | With Prototype |
|-------------------|----------------|
| Every object has its own copy of the method | All objects share one method |
| More memory usage | Less memory usage |
| `p1.sayHi === p2.sayHi` → `false` | `e1.sayHi === e2.sayHi` → `true` |

---

# Summary

> The benefit of the prototype is **not** that methods become accessible—they already are. The benefit is that all instances **share the same method** instead of each instance having its own copy, which **saves memory** and **avoids duplicate function creation**.