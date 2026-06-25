/*
Module Pattern is a JavaScript design pattern used to:

Hide private data/functions
Expose only a public API
Avoid polluting the global scope

Before ES Modules (import/export), this was the common way to create encapsulation.

ES Modules are JavaScript's standard module system introduced in ES6. They allow code to be split across files using export and import, provide module-level scope, support static analysis and tree-shaking, and replace older patterns such as IIFEs and the Module Pattern.
*/
const BankAccount = (() => {
    let balance = 0; // private

    return {
        deposit(amount) {
            if (amount <= 0) {
                console.log('Deposit amount must be positive');
                return;
            }

            balance += amount;
            console.log(`Deposited: ${amount}`);
        },

        withdraw(amount) {
            if (amount <= 0) {
                console.log('Withdrawal amount must be positive');
                return;
            }

            if (amount > balance) {
                console.log('Insufficient funds');
                return;
            }

            balance -= amount;
            console.log(`Withdrawn: ${amount}`);
        },

        getBalance() {
            return balance;
        }
    };
})();