## SECTION 11: Spread & Rest (Q66–Q69)

### Q66
- **Difficulty:** Easy
- **Topic:** Spread & Rest
- **Problem Statement:** Predict the output and explain shallow-copy semantics with spread:
```js
const original = { a: 1, nested: { b: 2 } };
const copy = { ...original };
copy.a = 100;
copy.nested.b = 200;
console.log(original.a, original.nested.b);

const arr1 = [1, 2, 3];
const arr2 = [...arr1, 4, 5];
arr2[0] = 99;
console.log(arr1[0]);
```
- **Expected Time Complexity:** O(n)
- **Expected Space Complexity:** O(n)
- **Hints:** Spread copies own enumerable properties one level deep; nested objects/arrays remain shared references.
- **Edge Cases:** Spreading objects with getters (getter is invoked once during spread, result is a plain value in the copy — not a live getter); spreading `Symbol`-keyed properties (they ARE included in object spread, unlike `for...in`).

### Q67
- **Difficulty:** Medium
- **Topic:** Spread & Rest
- **Problem Statement:** Implement `Math.max`/`Math.min` wrappers `maxOf(array)` / `minOf(array)` using spread syntax, then explain why this approach (`Math.max(...array)`) fails for very large arrays (e.g., 200,000+ elements) due to call stack limits, and implement a stack-safe alternative using `reduce` or a manual loop.
- **Expected Time Complexity:** O(n)
- **Expected Space Complexity:** O(1) for the safe version; O(n) stack frames for the spread version (risk of `RangeError`)
- **Hints:** `fn(...hugeArray)` effectively becomes a function call with N arguments, each potentially needing a stack slot — engines have argument count / stack depth limits.
- **Edge Cases:** Empty array (what should `maxOf([])` return — `-Infinity` matches `Math.max()` with no args, but is that the right API design?), array containing `NaN` (propagates through `Math.max`).

### Q68
- **Difficulty:** Hard
- **Topic:** Spread & Rest
- **Problem Statement:** Explain the difference between rest parameters in function signatures vs the rest pattern in destructuring vs spread in function calls/array-object literals — three distinct but visually similar uses of `...`. Write one example of each, and one example combining all three in a single utility function `logAndForward(target, ...args)` that logs all arguments and then calls `target(...args)`.
- **Expected Time Complexity:** O(n)
- **Expected Space Complexity:** O(n)
- **Hints:** Rest parameters must be the last parameter; spread can appear anywhere in an argument list/array literal (multiple times even).
- **Edge Cases:** A function with both named parameters and rest: `function f(a, b, ...rest)` called with fewer than 2 arguments — what is `rest`?

### Q69
- **Difficulty:** Staff
- **Topic:** Spread & Rest
- **Problem Statement:** Implement an immutable update utility `updateIn(obj, path, updater)` for deeply nested state (common in Redux-style state management) that returns a new object with only the path to the updated value shallow-copied (structural sharing — unchanged branches retain reference equality with the original object), without using any external libraries (no Immer/Immutable.js).
- **Expected Time Complexity:** O(p) where p = path length (not total object size)
- **Expected Space Complexity:** O(p) new objects created
- **Hints:** Recursively spread-copy only the objects along the path; siblings not on the path keep their original references — this is the key property to verify/test.
- **Edge Cases:** Path doesn't exist yet (should it create intermediate objects?), path includes array indices (e.g., `['items', 2, 'name']` — spreading an array vs object at that level), `updater` returns the same value (should the function still create new objects along the path, or detect no-op and return original — discuss trade-offs).

---

## SECTION 12: Modules (Q70–Q73)

### Q70
- **Difficulty:** Medium
- **Topic:** Modules
- **Problem Statement:** Explain the differences between CommonJS (`require`/`module.exports`) and ES Modules (`import`/`export`): synchronous vs asynchronous loading, live bindings vs value copies, `this` at top level, named/default/namespace exports, and how `export default` interacts with `export *`. Demonstrate the "live binding" behavior of ES modules with a code example where an exported `let` variable's value changes are visible to importers.
- **Expected Time Complexity:** O(1)
- **Expected Space Complexity:** O(1)
- **Hints:** CommonJS `module.exports = {...}` exports a snapshot object; ESM exports are live references to the binding in the source module.
- **Edge Cases:** Re-assigning an entire `module.exports` object after some properties were already destructured/imported elsewhere; circular ESM imports (what does an importer see if module A imports B and B imports A, before either finishes initializing?).

### Q71
- **Difficulty:** Hard
- **Topic:** Modules
- **Problem Statement:** Explain how circular dependencies are resolved differently in CommonJS vs ES Modules, with a concrete two-file example for each (`a.js`/`b.js`) where each file imports a named export from the other and calls a function from it at module top level. Predict what each system outputs and explain why (partial exports object in CommonJS vs TDZ-protected live bindings in ESM).
- **Expected Time Complexity:** O(1)
- **Expected Space Complexity:** O(1)
- **Hints:** In CommonJS, the second module to load gets a partially-populated `exports` object from the first (whichever started loading but hasn't finished); in ESM, hoisted bindings exist but calling a function before its module fully evaluates throws a `ReferenceError` due to TDZ if it's a `let`/`const`/`class`, but function declarations are fine since they're fully hoisted.
- **Edge Cases:** What if the circularly-imported value is a function declaration vs a `const` arrow function — does the ESM example behave differently?

### Q72
- **Difficulty:** Medium
- **Topic:** Modules
- **Problem Statement:** Explain dynamic imports (`import()`) and their use cases: code splitting, conditional loading, lazy-loading based on feature flags. Write a function `loadFeature(featureName)` that dynamically imports a module from a map of feature names to import paths, handles load failures gracefully (returns a fallback "feature unavailable" component/object), and caches successful loads so subsequent calls don't re-fetch.
- **Expected Time Complexity:** O(1) amortized after first load (cached)
- **Expected Space Complexity:** O(f) where f = number of distinct features loaded
- **Hints:** `import()` returns a promise; cache the promise itself (not just the resolved module) to avoid duplicate in-flight requests for the same feature.
- **Edge Cases:** A feature name not present in the map, the dynamic import rejecting (network error, 404 on the chunk), calling `loadFeature` for the same feature concurrently before the first resolves.

### Q73
- **Difficulty:** Staff
- **Topic:** Modules
- **Problem Statement:** Design a module-level "singleton with lazy initialization" pattern for a configuration/cache module that must (a) only initialize once even under concurrent async access (e.g., multiple simultaneous calls to `getConfig()` before the first I/O-based load completes should not trigger duplicate loads), (b) support a `resetForTesting()` export for test isolation, and (c) avoid the classic "module singleton leaks across test files" problem in a test runner that may or may not reset the module registry between tests. Discuss how this differs in CJS vs ESM regarding module caching.
- **Expected Time Complexity:** O(1) amortized
- **Expected Space Complexity:** O(1)
- **Hints:** Store the in-flight promise, not just a boolean "loading" flag; `resetForTesting` should clear both the cached value AND any in-flight promise.
- **Edge Cases:** `getConfig()` called, fails, then called again — should it retry or return the cached rejection? Test isolation when the module registry (`require.cache` / ESM module map) persists across tests in the same process.

---

## SECTION 13: Promises (Q74–Q82)

### Q74
- **Difficulty:** Easy
- **Topic:** Promises
- **Problem Statement:** Explain the three states of a Promise (pending, fulfilled, rejected) and why these are one-way, terminal transitions. Predict the output:
```js
const p = new Promise((resolve, reject) => {
  resolve('first');
  resolve('second');
  reject('error');
});
p.then(console.log).catch(console.error);
```
- **Expected Time Complexity:** O(1)
- **Expected Space Complexity:** O(1)
- **Hints:** Once settled, subsequent `resolve`/`reject` calls are no-ops.
- **Edge Cases:** Calling `resolve` with another Promise (adoption/chaining — the outer promise's state follows the inner one).

### Q75
- **Difficulty:** Medium
- **Topic:** Promises
- **Problem Statement:** Implement a Promise from scratch (`MyPromise`) supporting `.then()`, `.catch()`, `.finally()`, with correct chaining (each `.then()` returns a new promise), correct handling of returning a thenable/promise from a handler (flattening), and correct async resolution timing (handlers run as microtasks, not synchronously). Support `MyPromise.resolve`, `MyPromise.reject`.
- **Expected Time Complexity:** O(1) for state transitions; O(h) for notifying h registered handlers on settle
- **Expected Space Complexity:** O(h) for pending handler queue
- **Hints:** Use an internal state machine (`pending`/`fulfilled`/`rejected`) and a queue of `{onFulfilled, onRejected, resolveNext, rejectNext}` callbacks for pending promises; use `queueMicrotask` (or `setTimeout(fn, 0)` as a fallback) to defer handler execution.
- **Edge Cases:** Throwing inside a `.then()` handler (must reject the returned promise), returning a `MyPromise` (or any thenable, including a native `Promise`) from `.then()` (must chain/flatten, not nest), calling `.then()` multiple times on the same promise (multiple independent handler chains), resolving with a promise that resolves with another promise (multi-level flattening).

### Q76
- **Difficulty:** Hard
- **Topic:** Promises
- **Problem Statement:** Implement `Promise.all`, `Promise.allSettled`, `Promise.race`, and `Promise.any` from scratch (`myAll`, `myAllSettled`, `myRace`, `myAny`), matching native semantics exactly, including their behavior with empty iterables and non-promise values mixed into the iterable.
- **Expected Time Complexity:** O(n) for `all`/`allSettled`; O(n) for `race`/`any` (must attach handlers to all, even though only one "wins")
- **Expected Space Complexity:** O(n) for results array
- **Hints:** `Promise.all([])` resolves immediately with `[]`; `Promise.race([])` never settles; `Promise.any([])` rejects immediately with an `AggregateError`; `Promise.all` rejects on the FIRST rejection but other promises continue running (their results are ignored, not cancelled).
- **Edge Cases:** Mixed array of promises and plain values (e.g., `[Promise.resolve(1), 2, 3]`); `myAny` with all rejections (must collect all errors into `AggregateError.errors`); `myAllSettled` never rejects.

### Q77
- **Difficulty:** Hard
- **Topic:** Promises
- **Problem Statement:** Implement a `promisePool(tasks, concurrency)` function that takes an array of functions returning promises and a concurrency limit, executing at most `concurrency` tasks in parallel at any time, returning a promise that resolves with an array of all results in their original order (regardless of completion order).
- **Expected Time Complexity:** O(n) task executions; wall-clock time bounded by `ceil(n/concurrency) * max_task_time` in the worst case
- **Expected Space Complexity:** O(n) for results array
- **Hints:** Maintain an index counter; each "worker" pulls the next task index when it finishes its current one; use `Promise.all` over `concurrency` worker promises.
- **Edge Cases:** `concurrency >= tasks.length` (degenerates to running all in parallel), `concurrency = 0` or negative (should throw or treat as 1?), a task that throws synchronously vs returns a rejected promise (both should propagate or be handled per spec — define behavior: does one failing task stop the whole pool, or should it behave like `allSettled`? Specify and implement both variants).

### Q78
- **Difficulty:** Hard
- **Topic:** Promises
- **Problem Statement:** Predict the output of the following code, explaining the exact order of execution including how `.then()` chains interleave with synchronous code and `setTimeout`:
```js
console.log('1');
setTimeout(() => console.log('2'), 0);
Promise.resolve().then(() => console.log('3'));
Promise.resolve().then(() => {
  console.log('4');
  return Promise.resolve();
}).then(() => console.log('5'));
console.log('6');
```
- **Expected Time Complexity:** O(1)
- **Expected Space Complexity:** O(1)
- **Hints:** All microtasks queued during the synchronous run, plus any microtasks they enqueue, run before the macrotask queue (`setTimeout`) is processed.
- **Edge Cases:** What if the `.then(() => { ... return Promise.resolve(); })` instead returned a plain value (not a promise) — would `'5'` still print after `'3'` or before?

### Q79
- **Difficulty:** Staff
- **Topic:** Promises
- **Problem Statement:** Implement `cancellablePromise(executor)` — since native Promises cannot be cancelled — that returns `{ promise, cancel }`, where calling `cancel()` causes the promise to reject with a `CancelError` if it hasn't already settled, AND propagates cancellation to any "cancellable" promises it's chained from (i.e., design a minimal cancellation-token-based system, similar in spirit to `AbortController`, that can be composed across a `.then()` chain so cancelling the "root" cancels all derived promises). Discuss why this is fundamentally a "best effort" abstraction and cannot truly stop already-executing synchronous code or in-flight network requests without `AbortController` integration.
- **Expected Time Complexity:** O(1) for cancel propagation per promise in the chain
- **Expected Space Complexity:** O(c) where c = chain length
- **Hints:** Wrap each `.then()` to check the shared cancellation token before invoking the handler and before resolving the next promise in the chain; integrate with `AbortController` for actual `fetch` cancellation.
- **Edge Cases:** Calling `cancel()` after the promise has already settled (should be a no-op), cancelling mid-chain after some `.then()` handlers have already run (should subsequent handlers be skipped?), multiple `cancel()` calls.

### Q80
- **Difficulty:** Medium
- **Topic:** Promises
- **Problem Statement:** Debug the following code which is meant to fetch user data and then their posts sequentially, but contains a common async anti-pattern (the "promise constructor anti-pattern" combined with unnecessary nesting). Refactor it to be idiomatic:
```js
function getUserAndPosts(userId) {
  return new Promise((resolve, reject) => {
    fetchUser(userId).then(user => {
      fetchPosts(user.id).then(posts => {
        resolve({ user, posts });
      }).catch(err => reject(err));
    }).catch(err => reject(err));
  });
}
```
- **Expected Time Complexity:** O(1) plus network I/O
- **Expected Space Complexity:** O(1)
- **Hints:** Avoid wrapping promise chains in `new Promise` ("promise constructor anti-pattern") — just `return` the chain; flatten nested `.then()` calls.
- **Edge Cases:** What if `fetchPosts` should run in parallel with some other independent fetch rather than sequentially after `fetchUser` — how would the refactor change?

### Q81
- **Difficulty:** Hard
- **Topic:** Promises
- **Problem Statement:** Explain "unhandled promise rejection" — what happens in Node.js vs browsers when a promise rejects with no `.catch()` handler attached (synchronously or within the same microtask checkpoint)? Write code demonstrating a rejection that IS considered "handled" because a `.catch()` is attached asynchronously (e.g., inside a `setTimeout`) before the unhandled-rejection check fires, vs one that is NOT handled in time.
- **Expected Time Complexity:** O(1)
- **Expected Space Complexity:** O(1)
- **Hints:** The unhandled rejection check happens at the end of the current microtask queue processing (`process.on('unhandledRejection')` / `window.onunhandledrejection`); a `.catch()` attached via `setTimeout` (a macrotask) is too late.
- **Edge Cases:** A promise that is rejected, has no handler initially, gets a `.catch()` attached "late" but the rejection had already been reported — does the `rejectionHandled` event fire? (Discuss `unhandledrejection` and `rejectionhandled` events in browsers.)

### Q82
- **Difficulty:** Staff
- **Topic:** Promises
- **Problem Statement:** Design and implement an async task queue `TaskQueue` for a frontend application that needs to send analytics events to a server. Requirements: tasks are enqueued via `queue.add(taskFn)`, executed strictly in FIFO order (one at a time, even though `taskFn` is async), if a task fails it should be retried up to 3 times with exponential backoff before being dropped (with the failure logged), and the queue should support `pause()`/`resume()` and `drain()` (returns a promise that resolves when the queue is empty and idle). Consider what happens if `pause()` is called while a task is executing.
- **Expected Time Complexity:** O(1) per `add`; overall O(n) task executions plus retries
- **Expected Space Complexity:** O(n) for pending queue
- **Hints:** Use a recursive/looping "processNext" function gated by a `running` flag and a `paused` flag; `drain()` can resolve via a stored resolver that's called when the queue becomes empty and not running.
- **Edge Cases:** `pause()` called while a task is mid-execution (the current task should finish; only subsequent tasks pause), `add()` called after `drain()` was awaited (should `drain()`'s promise have already resolved — does a new `drain()` call need to be made?), all tasks failing all retries (queue should still drain, not hang).

---

## SECTION 14: Async/Await (Q83–Q88)

### Q83
- **Difficulty:** Easy
- **Topic:** Async/Await
- **Problem Statement:** Explain that `async`/`await` is syntactic sugar over Promises. Rewrite the following `async`/`await` function as an equivalent `.then()`/`.catch()` chain, and vice versa — given a `.then()` chain, rewrite it using `async`/`await`:
```js
async function getData(id) {
  try {
    const user = await fetchUser(id);
    const posts = await fetchPosts(user.id);
    return { user, posts };
  } catch (err) {
    console.error(err);
    return null;
  }
}
```
- **Expected Time Complexity:** O(1) plus I/O
- **Expected Space Complexity:** O(1)
- **Hints:** `try/catch` around `await` is equivalent to `.catch()` on the chain; an `async` function always returns a Promise, even if you `return` a plain value.
- **Edge Cases:** What does `getData(id)` return if `id` causes `fetchUser` to throw synchronously (not return a rejected promise) — is it still caught by the `try/catch`?

### Q84
- **Difficulty:** Medium
- **Topic:** Async/Await
- **Problem Statement:** Predict the output and explain why, focusing on sequential vs parallel execution:
```js
async function sequential() {
  const a = await delay(100, 'a');
  const b = await delay(100, 'b');
  return [a, b];
}
async function parallel() {
  const [a, b] = await Promise.all([delay(100, 'a'), delay(100, 'b')]);
  return [a, b];
}
// delay(ms, value) returns a promise resolving with `value` after `ms`
```
What is the approximate total execution time of each function, and why is a common mistake to write `sequential`-style code when `parallel` was intended?
- **Expected Time Complexity:** O(n) for sequential (sum of delays); O(max) for parallel (max delay)
- **Expected Space Complexity:** O(1)
- **Hints:** Each `await` pauses execution of the `async` function until that specific promise settles — independent operations awaited one after another do NOT run concurrently unless started before the first `await`.
- **Edge Cases:** What if `b`'s delay depends on the result of `a` (true dependency) — can it still be parallelized? (No — explain why this is a genuine sequential dependency vs a false one.)

### Q85
- **Difficulty:** Hard
- **Topic:** Async/Await
- **Problem Statement:** Implement `asyncMap(array, asyncFn, concurrency)` — like `Array.prototype.map` but for an async function, with a concurrency limit, returning a promise that resolves to an array of results IN THE SAME ORDER as the input, even though tasks may complete out of order. Then implement `asyncFilter(array, asyncPredicate, concurrency)` similarly.
- **Expected Time Complexity:** O(n) tasks; wall time bounded by concurrency
- **Expected Space Complexity:** O(n) for results
- **Hints:** Pre-allocate a results array of length n and write to `results[index]` regardless of completion order; `asyncFilter` can be implemented as `asyncMap` followed by a synchronous `filter` based on the boolean results.
- **Edge Cases:** Empty input array, `concurrency` greater than array length, one async call throwing (should the whole operation reject immediately, or wait for in-flight tasks — define and implement both "fail-fast" and "wait-for-all" variants).

### Q86
- **Difficulty:** Hard
- **Topic:** Async/Await
- **Problem Statement:** Explain why `forEach` cannot be used with `async`/`await` to achieve sequential execution (a very common bug), with a concrete buggy example using `array.forEach(async (item) => { await process(item); })`, predicting its actual (incorrect) behavior, then provide two correct alternatives: a `for...of` loop with `await`, and a `reduce`-based sequential chain.
- **Expected Time Complexity:** O(n) sequential
- **Expected Space Complexity:** O(1)
- **Hints:** `forEach`'s callback return value is ignored — `forEach` does not wait for promises returned by its callback, so all iterations effectively start "simultaneously" (synchronously, before any `await` pauses).
- **Edge Cases:** What if the goal IS parallel execution with `forEach` but you still need to know when ALL are done — `forEach` provides no mechanism for this; what would you use instead (`Promise.all` + `map`)?

### Q87
- **Difficulty:** Staff
- **Topic:** Async/Await
- **Problem Statement:** Design an `AsyncLock` (mutex) class for JavaScript to serialize access to a critical section across multiple concurrent async operations (e.g., multiple components trying to refresh an auth token simultaneously — only one refresh should actually happen, others should wait and reuse the result). Implement `lock.acquire()` returning a promise that resolves with a `release` function, and a higher-level `lock.runExclusive(fn)` helper. Demonstrate solving the "thundering herd" token-refresh problem with it.
- **Expected Time Complexity:** O(1) per acquire/release (amortized); O(w) to wake w waiters
- **Expected Space Complexity:** O(w) for the waiter queue
- **Hints:** Maintain an internal promise chain — `acquire()` returns a promise that resolves once the previous holder calls `release`; for the token-refresh case, combine `AsyncLock` with the "in-flight promise caching" pattern from Q24's `onceAsync`.
- **Edge Cases:** `release()` called twice (should be safe/no-op), an exception thrown inside `runExclusive`'s `fn` (lock must still be released — use `finally`), reentrant acquisition from the same "logical" caller (deadlock risk — discuss whether this lock is reentrant and what happens if not).

### Q88
- **Difficulty:** Hard
- **Topic:** Async/Await
- **Problem Statement:** Explain `for await...of` and async iterators/generators. Implement an async generator `paginatedFetch(baseUrl)` that yields items from a paginated REST API one page at a time (the API returns `{ items: [...], nextCursor: string | null }`), allowing a consumer to do `for await (const item of paginatedFetch(url)) { ... }` to iterate over ALL items across all pages transparently, fetching subsequent pages lazily only as needed.
- **Expected Time Complexity:** O(1) amortized per item yielded (excluding network); O(p) total page fetches for p pages
- **Expected Space Complexity:** O(page size) — only one page held in memory at a time
- **Hints:** `async function* paginatedFetch(url) { let cursor = null; do { const res = await fetch(...); for (const item of res.items) yield item; cursor = res.nextCursor; } while (cursor); }`.
- **Edge Cases:** Consumer breaks out of the `for await` loop early (does the generator need cleanup — `return()`/`finally` in the generator?), API returns an error mid-pagination (should the async generator throw, propagating to the consumer's loop?), empty first page.

---

## SECTION 15: Event Loop (Q89–Q92)

### Q89
- **Difficulty:** Medium
- **Topic:** Event Loop
- **Problem Statement:** Draw (in text/ASCII or describe precisely) the JavaScript runtime architecture: Call Stack, Heap, Web APIs / Node APIs, Callback (Macrotask) Queue, Microtask Queue, and the Event Loop's role in coordinating them. Explain step-by-step what happens when `setTimeout(fn, 1000)` is called, including which component handles the timer and how `fn` eventually reaches the call stack.
- **Expected Time Complexity:** O(1)
- **Expected Space Complexity:** O(1)
- **Hints:** The JS engine itself doesn't implement timers — the host environment (browser/Node) does; the callback is queued only after BOTH the timer expires AND the call stack is empty.
- **Edge Cases:** `setTimeout(fn, 0)` does not run "immediately" — explain the minimum delay clamping in browsers (historically 4ms for nested timeouts) and why.

### Q90
- **Difficulty:** Hard
- **Topic:** Event Loop
- **Problem Statement:** Explain how the event loop interacts with browser rendering: where do "render steps" (layout, paint) fit relative to the microtask queue and macrotask queue? Specifically, explain why `requestAnimationFrame` callbacks and microtasks queued within them behave differently from `setTimeout`, and predict the rendering implications of the following:
```js
function loop() {
  for (let i = 0; i < 1000000; i++) {} // expensive synchronous work
  Promise.resolve().then(() => console.log('microtask'));
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);
```
- **Expected Time Complexity:** O(1) conceptually
- **Expected Space Complexity:** O(1)
- **Hints:** Microtasks run after each task AND after each `requestAnimationFrame` callback batch, before rendering; long synchronous work blocks rendering regardless of where it's scheduled.
- **Edge Cases:** What if `Promise.resolve().then(...)` inside the loop schedules ANOTHER microtask recursively — could this starve rendering entirely even with `requestAnimationFrame`?

### Q91
- **Difficulty:** Staff
- **Topic:** Event Loop
- **Problem Statement:** A production Node.js server is experiencing event loop lag spikes (measured via `perf_hooks` or libraries like `toobusy`) causing request timeouts under load, traced to a synchronous JSON serialization of large objects (`JSON.stringify` on multi-MB objects) in a hot request handler. Explain why this blocks the event loop, and propose at least two architectural solutions (e.g., worker threads, streaming serialization, chunking with `setImmediate`) with trade-offs for each.
- **Expected Time Complexity:** O(n) for the serialization itself; discuss how each solution affects perceived latency vs throughput
- **Expected Space Complexity:** O(n) for the serialized output, plus IPC overhead for worker-thread solutions
- **Hints:** Worker threads avoid blocking the main loop but incur serialization cost to transfer data back (unless using `SharedArrayBuffer` or transferable objects); streaming JSON serializers can yield control periodically.
- **Edge Cases:** Worker thread pool exhaustion under sustained load, ordering guarantees if requests must be processed in order, error handling across the worker boundary.

### Q92
- **Difficulty:** Hard
- **Topic:** Event Loop
- **Problem Statement:** Predict the precise output order, explaining each scheduling decision:
```js
console.log('start');

setTimeout(() => console.log('timeout 1'), 0);

queueMicrotask(() => console.log('microtask 1'));

new Promise((resolve) => {
  console.log('promise constructor');
  resolve();
}).then(() => {
  console.log('promise then 1');
  queueMicrotask(() => console.log('nested microtask'));
}).then(() => {
  console.log('promise then 2');
});

setTimeout(() => console.log('timeout 2'), 0);

console.log('end');
```
- **Expected Time Complexity:** O(1)
- **Expected Space Complexity:** O(1)
- **Hints:** The promise constructor's executor runs synchronously; track the microtask queue as a FIFO that can have items appended to it WHILE it's being drained.
- **Edge Cases:** Does `'nested microtask'` print before or after `'promise then 2'`? Why?

---

## SECTION 16: Microtasks vs Macrotasks (Q93–Q95)

### Q93
- **Difficulty:** Medium
- **Topic:** Microtasks vs Macrotasks
- **Problem Statement:** List and categorize the following as microtasks or macrotasks, explaining the general rule for each category: `setTimeout`, `setInterval`, `Promise.then`, `queueMicrotask`, `MutationObserver` callbacks, `requestAnimationFrame`, `requestIdleCallback`, `process.nextTick` (Node.js), `setImmediate` (Node.js), I/O callbacks (file reads, network).
- **Expected Time Complexity:** O(1)
- **Expected Space Complexity:** O(1)
- **Hints:** Microtask queue is fully drained before the next macrotask; in Node.js, `process.nextTick` has even higher priority than other microtasks (runs before the Promise microtask queue, in a separate queue).
- **Edge Cases:** `MutationObserver` is a microtask in browsers — what does this imply about DOM mutation observation timing relative to `Promise.then`?

### Q94
- **Difficulty:** Hard
- **Topic:** Microtasks vs Macrotasks
- **Problem Statement:** Explain "microtask starvation" — a scenario where recursively scheduling microtasks (e.g., a `.then()` handler that always re-schedules itself) prevents macrotasks (like `setTimeout`, user input events, or rendering) from ever running, effectively freezing the UI despite the JS thread technically being "available." Write a minimal code example demonstrating this, and explain how to fix it by yielding to the macrotask queue periodically.
- **Expected Time Complexity:** O(1) per iteration but unbounded total
- **Expected Space Complexity:** O(1)
- **Hints:** `function recurse() { Promise.resolve().then(recurse); }` never yields; fix by occasionally using `setTimeout(recurse, 0)` or `requestIdleCallback`/`scheduler.yield()` instead.
- **Edge Cases:** How would you detect this happening in a production app (e.g., via long-task monitoring, `PerformanceObserver` with `longtask` entries)?

### Q95
- **Difficulty:** Staff
- **Topic:** Microtasks vs Macrotasks
- **Problem Statement:** Implement a `yieldToMain()` utility function that returns a promise resolving on the next macrotask (using the best available API, with fallbacks: `scheduler.yield()` → `requestIdleCallback` → `setTimeout(0)` → `setImmediate` in Node), and use it inside a `processLargeArray(array, processFn)` function that processes a huge array in chunks, yielding control back to the browser periodically (e.g., every 5ms of work, measured via `performance.now()`) to keep the UI responsive — a manual time-slicing / cooperative scheduling implementation.
- **Expected Time Complexity:** O(n) total work, broken into time-sliced chunks
- **Expected Space Complexity:** O(1) extra (excluding results accumulation)
- **Hints:** Loop while `performance.now() - chunkStart < timeBudgetMs`, then `await yieldToMain()` and continue; this is conceptually similar to React's concurrent rendering / Scheduler package.
- **Edge Cases:** A single item's `processFn` taking longer than the entire time budget (can't yield mid-item — the chunk will overrun; discuss whether this is acceptable or whether items need to be further subdivided), the array being mutated by another part of the app while processing is in progress.

---
