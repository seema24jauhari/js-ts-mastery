//1. once(fn) (Synchronous)

function once(fn) {
    let called = false;
    let result;

    return function (...args) {
        if (!called) {
            result = fn(...args);
            called = true;
        }

        return result;
    };
}

function add(a, b) {
    console.log("Executed");
    return a + b;
}

const addOnce = once(add);

console.log(addOnce(2, 3)); // Executed -> 5
console.log(addOnce(10, 20)); // 5
console.log(addOnce(100, 200)); // 5


//2. onceAsync(fn) (Asynchronous)

function onceAsync(fn) {
    let promise;

    return (...args) => {
        if (!promise) {
            promise = Promise.resolve(fn(...args))
                .catch(err => {
                    promise = null;   // allow retry
                    throw err;
                });
        }

        return promise;
    };
}

async function fetchData() {
    console.log("API Called");

    return new Promise(resolve => {
        setTimeout(() => {
            resolve("Success");
        }, 3000);
    });
}

const fetchOnce = onceAsync(fetchData);

fetchOnce().then(console.log);
fetchOnce().then(console.log);
fetchOnce().then(console.log);

