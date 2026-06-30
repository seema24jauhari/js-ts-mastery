/*
| Feature                      | Map | WeakMap |
| ---------------------------- | --- | ------- |
| String keys                  | ✅   | ❌       |
| Number keys                  | ✅   | ❌       |
| Object keys                  | ✅   | ✅       |
| Automatic garbage collection | ❌   | ✅       |
| Iterable                     | ✅   | ❌       |
| `.size`                      | ✅   | ❌       |
*/

function createEventEmitter() {
    const events = new Map();

    function on(event, handler) {
        if (!events.has(event)) {
            events.set(event, new Set());
        }

        events.get(event).add(handler);
    }

    function off(event, handler) {
        if (!events.has(event)) return;

        events.get(event).delete(handler);

        if (events.get(event).size === 0) {
            events.delete(event);
        }
    }

    function emit(event, ...args) {
        if (!events.has(event)) return;

        for (const handler of [...events.get(event)]) {
            try {
                handler(...args);
            } catch (err) {
                console.error(err);
            }
        }
    }

    function once(event, handler) {
        function wrapper(...args) {
            handler(...args);
            off(event, wrapper);
        }

        on(event, wrapper);
    }

    return {
        on,
        off,
        emit,
        once
    };
}

const emitter = createEventEmitter();

function greet(name) {
    console.log(`Hello ${name}`);
}

emitter.on("welcome", greet);

emitter.emit("welcome", "John");

emitter.off("welcome", greet);

emitter.emit("welcome", "John");



const emitter1 = createEventEmitter();

emitter1.once("login", user => {
    console.log("Welcome", user);
});

emitter1.emit("login", "John");
emitter1.emit("login", "John");