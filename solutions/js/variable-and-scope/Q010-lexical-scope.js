/**
 * Lexical Scope: Variables are accessible based on where they are declared in the source code (their position/nesting), not where a function is called from.
 */

/*
const createCounter = () => {
    let counter = 0; // private

    return {
        increment() {
            return counter++;
        },

        decrement() {
            return counter--;
        },

        getValue() {
            return counter;
        }
    };
};

let count = createCounter();
console.log(count)
console.log(count.increment())
console.log(count.getValue())

*/

function createCounter() {
    let counter = 0; // private

    return {
        increment() {
            return counter++;
        },
        decrement() {
            return counter--;
        },
        getValue() {
            return counter;
        }
    };
}

let count = createCounter()
console.log(count.increment())
console.log(count.getValue())
