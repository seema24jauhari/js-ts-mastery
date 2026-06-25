## SECTION 27: Design Patterns (continued) (Q154–Q161)

### Q154
- **Difficulty:** Hard
- **Topic:** Design Patterns
- **Problem Statement:** Implement the Observer pattern from scratch (distinct from but related to your Q25 event emitter and Q135 Observable): a `Subject` class with `subscribe(observer)`/`unsubscribe(observer)`/`notify(data)`, where `observer` implements an `update(data)` method. Use it to build a `StockTicker` (`Subject`) that notifies multiple `PriceDisplay` and `PriceAlert` observers when a stock price changes. Then explain the distinction between the classic GoF Observer pattern (synchronous, push-based, tightly coupled to an `update` interface) and the Pub/Sub pattern (typically asynchronous, often decoupled via a message broker/event bus, publishers and subscribers don't reference each other directly) — implement a minimal Pub/Sub `EventBus` and contrast it with `Subject`.
- **Expected Time Complexity:** O(o) per `notify` where o = number of observers
- **Expected Space Complexity:** O(o)
- **Hints:** In Observer, the `Subject` holds direct references to observer objects; in Pub/Sub, publishers and subscribers communicate via topic/event names through a broker, with NO direct references to each other.
- **Edge Cases:** An observer that throws inside `update` (should it stop notification of subsequent observers, similar to the discussion in Q25?), unsubscribing an observer FROM WITHIN its own `update` call (mutating the observer list while iterating it — classic bug, requires iterating a copy or using a data structure safe for concurrent modification).

### Q155
- **Difficulty:** Hard
- **Topic:** Design Patterns
- **Problem Statement:** Implement the Command pattern: an `executeCommand(command)` / `undo()` / `redo()` system for a text editor's edit history, where each `Command` (`InsertTextCommand`, `DeleteTextCommand`, `FormatCommand`) encapsulates `execute()` and `undo()` logic plus any data needed to reverse itself. Maintain an undo stack and redo stack, ensuring that executing a NEW command after some undos clears the redo stack (standard editor behavior). Discuss memory considerations for long edit histories (e.g., command compaction/coalescing — merging many rapid single-character insert commands into one "insert word" command for undo granularity that matches user expectation, not literal keystroke granularity).
- **Expected Time Complexity:** O(1) for execute/undo/redo (excluding the command's own operation complexity); O(1) amortized for stack push/pop
- **Expected Space Complexity:** O(h) where h = history length, bounded by a max-history-size eviction policy
- **Hints:** Command coalescing: when a new `InsertTextCommand` arrives shortly after (time-based threshold) and at an adjacent position to the previous one, merge them into a single command object rather than pushing a new stack entry.
- **Edge Cases:** Undo stack exceeding a memory budget for very long editing sessions (oldest commands evicted — but this means undo eventually "runs out," which must be communicated to the user), a command whose `undo()` depends on state that's changed by ANOTHER mechanism since `execute()` (e.g., collaborative editing — another user's change interleaved — discuss why Command pattern alone is insufficient for collaborative undo and what's needed instead, e.g., OT/CRDTs per Q108).

### Q156
- **Difficulty:** Hard
- **Topic:** Design Patterns
- **Problem Statement:** Implement the Decorator pattern in JavaScript (function-wrapping style, distinct from TypeScript's `@decorator` syntax which is covered in Q241+) to add cross-cutting behavior to functions WITHOUT modifying their source: `withLogging(fn)`, `withTiming(fn)`, `withRetry(fn, options)` (reuse Q54), `withCache(fn)` (reuse memoize), composed together: `const enhanced = withLogging(withTiming(withRetry(fetchUserData)))`. Explain how decorator composition ORDER affects behavior (e.g., does `withTiming` measure time INCLUDING retries, or just the final successful attempt?) and why this makes decorator ordering a meaningful design decision, not an arbitrary one.
- **Expected Time Complexity:** O(1) overhead per decorator layer
- **Expected Space Complexity:** O(d) for d decorator layers (each adds a closure frame to the call stack)
- **Hints:** Each decorator returns a new function that calls the wrapped function and adds behavior before/after/around the call.
- **Edge Cases:** A decorated ASYNC function — decorators like `withTiming` must `await` the inner function's result (or return its promise) to measure the FULL async duration, not just the synchronous portion before the first `await`; very deep decorator chains affecting stack trace readability in debugging (discuss `Error.captureStackTrace` or naming functions for clearer stack traces).

### Q157
- **Difficulty:** Staff
- **Topic:** Design Patterns
- **Problem Statement:** Implement the Adapter pattern: your application has a unified `PaymentGateway` interface (`charge(amountCents, token): Promise<ChargeResult>`), but needs to integrate with THREE third-party SDKs with incompatible APIs (one uses callbacks, one uses a different amount unit (dollars as floats), one returns XML instead of JSON). Implement `StripeAdapter`, `LegacyGatewayAdapter`, `XmlGatewayAdapter`, each conforming to the unified interface while internally translating to/from the third-party SDK's actual API. Discuss the risk of "leaky abstractions" in adapters — e.g., the legacy gateway's float-dollar amounts introduce floating-point precision risk when converting to/from integer cents — and how the adapter should handle this translation safely (rounding strategy, validation).
- **Expected Time Complexity:** O(1) per adapted call (excluding network)
- **Expected Space Complexity:** O(1)
- **Hints:** For the callback-based SDK, wrap it in a `new Promise((resolve, reject) => legacySDK.charge(amount, (err, result) => err ? reject(err) : resolve(result)))` (promisification); for floating-point dollar-to-cent conversion, use `Math.round(dollars * 100)` rather than naive multiplication to avoid floating point representation errors (e.g., `0.1 + 0.2 !== 0.3`).
- **Edge Cases:** The legacy gateway returns an amount like `19.999999999999996` due to floating point arithmetic on ITS side (before your adapter even receives it) — how does your adapter detect and correct for this vs a genuinely different amount due to a fee, and is there enough information to distinguish these cases (discuss whether a tolerance-based comparison or contacting the gateway provider for clarification is the right approach).

### Q158
- **Difficulty:** Hard
- **Topic:** Design Patterns
- **Problem Statement:** Implement the Proxy pattern (the GENERAL design pattern, leveraging JS's native `Proxy` object from Q59, but for a different purpose here): a `createLazyProxy(loader)` that defers an expensive object's creation until its FIRST property access (virtual proxy / lazy initialization), and a `createValidatingProxy(target, schema)` that validates property assignments against a schema, throwing on invalid writes (protection proxy). Then implement a `createLoggingProxy(target, logger)` (logging proxy, similar to Q156's decorator but at the property-access level rather than function-call level) and discuss when a Proxy-based approach is preferable to a Decorator-based approach for cross-cutting concerns (Proxy intercepts ALL property access/assignment generically; Decorator requires explicit wrapping per function).
- **Expected Time Complexity:** O(1) per trapped operation
- **Expected Space Complexity:** O(1)
- **Hints:** The lazy proxy's `get` trap checks if the real object has been created yet; if not, calls `loader()` and caches the result before forwarding the property access via `Reflect.get`.
- **Edge Cases:** The lazy proxy's loader THROWING (should every subsequent property access re-attempt loading, or cache the failure? — relate to the `once`/`onceAsync` discussion in Q24), validating proxy receiving a property NOT in the schema (allow with a warning, or reject outright — discuss schema strictness trade-offs).

### Q159
- **Difficulty:** Hard
- **Topic:** Design Patterns
- **Problem Statement:** Implement the State pattern for a `TrafficLight` (or `OrderStatus` for a more business-relevant example: `pending → processing → shipped → delivered`, plus `cancelled` reachable from `pending`/`processing` only): instead of a `status` string field checked via `if/else`/`switch` everywhere transitions or behavior differ, encapsulate each state as an object/class implementing a common interface (`canTransitionTo(newStatus)`, `getAllowedActions()`, `onEnter()`, `onExit()`), with the `Order` context object delegating to its current state object. Compare this to a simpler "state machine as a transition table" approach (a `Map<fromState, Map<event, toState>>`) and discuss when the full State PATTERN (with behavior per state, not just transitions) is warranted vs when a simple transition table suffices.
- **Expected Time Complexity:** O(1) for transition checks and dispatch
- **Expected Space Complexity:** O(s) for s state objects (typically a small, fixed number, often singletons)
- **Hints:** State pattern is warranted when DIFFERENT BEHAVIOR (not just different allowed transitions) is associated with each state (e.g., `getAllowedActions()` differs meaningfully per state, beyond just "what's the next status"); a transition table alone suffices if you ONLY need to validate/execute transitions without state-specific behavior.
- **Edge Cases:** An invalid transition attempt (e.g., `delivered → pending`) — should this throw, return `false`/an error result, or be silently ignored (discuss API design implications for callers), concurrent transition attempts on the same order (e.g., two requests both trying to cancel and ship simultaneously — relate to Q87's `AsyncLock` for serializing state transitions safely).

### Q160
- **Difficulty:** Staff
- **Topic:** Design Patterns
- **Problem Statement:** Implement the Chain of Responsibility pattern for an Express-like HTTP middleware system from scratch: `app.use(middleware)` registers middleware functions `(req, res, next) => void`, and `app.handle(req, res)` runs them in registration order, where each middleware can either call `next()` to pass control to the next middleware, call `next(error)` to jump directly to error-handling middleware (skipping remaining normal middleware), or NOT call `next()` at all (ending the chain, e.g., after sending a response). Implement support for error-handling middleware (4-arity functions `(err, req, res, next)`) that are skipped during normal flow but invoked when `next(error)` is called.
- **Expected Time Complexity:** O(m) where m = number of middleware in the chain (worst case, all execute)
- **Expected Space Complexity:** O(1) extra (excluding the middleware array itself)
- **Hints:** Distinguish middleware arity via `fn.length` (4 = error handler, otherwise normal) — this is literally how Express does it; maintain an index into the middleware array, incremented each time `next()` is called, recursively invoking the next middleware.
- **Edge Cases:** `next()` called MULTIPLE times by the same middleware (a common bug — should the framework detect and warn/throw on this, since it could cause double-responses or skipped middleware confusion?), an error thrown SYNCHRONOUSLY inside a middleware (not via `next(error)`) — should this be caught and routed to error-handling middleware automatically (requires wrapping each middleware call in `try/catch`), no error-handling middleware registered when an error occurs (need a sensible default — e.g., a built-in catch-all that responds with 500).

### Q161
- **Difficulty:** Staff
- **Topic:** Design Patterns
- **Problem Statement:** Critically evaluate the appropriateness of classical Gang-of-Four design patterns in modern JavaScript/TypeScript, given the language's first-class functions and closures often provide simpler alternatives to patterns designed for class-heavy languages like Java/C++ (e.g., Strategy pattern is often just "pass a function," Command pattern is often just "store a closure," Visitor pattern is often unnecessary given `Array.prototype` methods and structural typing). For THREE specific patterns covered above (your choice), write BOTH the "classical OOP" implementation AND a more idiomatic "JavaScript-native" simplified equivalent, and argue for which is more appropriate for a typical TypeScript codebase, while acknowledging contexts (e.g., very large enterprise codebases, or teams from Java/C# backgrounds) where the classical approach might still be preferred for consistency/familiarity.
- **Expected Time Complexity:** O(1)
- **Expected Space Complexity:** O(1)
- **Hints:** Strategy → just pass a function instead of a `Strategy` interface with multiple implementing classes; Command → a closure capturing the needed state IS the command, no need for a class with `execute()`/`undo()` methods unless undo logic is genuinely complex and benefits from being co-located as data.
- **Edge Cases:** N/A — open-ended design discussion; a strong (staff-level) answer demonstrates judgment about WHEN classical patterns earn their complexity vs when they're cargo-culted from other languages without justification.

---

## SECTION 28: Error Handling (Q162–Q168)

### Q162
- **Difficulty:** Easy
- **Topic:** Error Handling
- **Problem Statement:** Explain the built-in `Error` hierarchy (`Error`, `TypeError`, `RangeError`, `SyntaxError`, `ReferenceError`, etc.) and implement a custom error hierarchy for an application: a base `AppError` extending `Error` (correctly setting `this.name`, preserving `stack`, and supporting a `cause` option per the ES2022 `Error` cause chaining feature), with subclasses `ValidationError`, `NotFoundError`, `UnauthorizedError`, each carrying relevant metadata (e.g., `ValidationError` carries a `field` property). Explain why `class CustomError extends Error` requires special handling in older transpilation targets (Babel targeting ES5) due to how `extends` interacts with built-ins, even though this is largely a non-issue with modern native ES6+ classes.
- **Expected Time Complexity:** O(1)
- **Expected Space Complexity:** O(1)
- **Hints:** `super(message)` must be called before accessing `this`; set `this.name = this.constructor.name` so `error.name` reflects the actual subclass, not just `'Error'`; use `Error.captureStackTrace(this, this.constructor)` (V8-specific) to exclude the constructor itself from the stack trace.
- **Edge Cases:** `instanceof` checks for custom errors transpiled to ES5 historically being broken (the prototype chain isn't correctly set up by Babel's default `extends` transform for built-ins without specific workarounds) — explain the underlying reason (ES5 down-leveled classes can't properly subclass `Error` because `Error` is special-cased by the engine).

### Q163
- **Difficulty:** Medium
- **Topic:** Error Handling
- **Problem Statement:** Explain the difference between "operational errors" (expected failure conditions: invalid user input, network timeout, resource not found — things a well-written program should anticipate and handle gracefully) and "programmer errors" (bugs: calling a function with wrong argument types, null pointer-style errors, logic errors — things that indicate the code itself needs fixing). Discuss why CRASHING (or at least not attempting to "recover" silently) is often the CORRECT response to a programmer error, while operational errors should be caught and handled gracefully with user-facing feedback. Apply this distinction to a real function: `function getUser(id) { if (typeof id !== 'string') throw new TypeError(...); /* programmer error */ try { return db.find(id); } catch (e) { throw new NotFoundError(...); } /* operational error */ }`.
- **Expected Time Complexity:** O(1)
- **Expected Space Complexity:** O(1)
- **Hints:** This distinction (from Node.js's historical error-handling philosophy, articulated by Joyent's error handling guide) informs WHERE try/catch boundaries should exist — operational errors are caught close to their source and translated into domain errors; programmer errors are typically allowed to propagate and crash the process (in a server context, allowing process managers to restart a clean process, rather than continuing in a possibly-corrupted state).
- **Edge Cases:** Is a `JSON.parse` failure on user-submitted data an operational error (yes — invalid input is expected/anticipated) or would the SAME `JSON.parse` failure on a value YOUR OWN code generated (and should always be valid JSON) be a programmer error instead (yes — same error type, different classification based on context)?

### Q164
- **Difficulty:** Hard
- **Topic:** Error Handling
- **Problem Statement:** Implement a global error boundary strategy for a Node.js server: handlers for `process.on('uncaughtException')` and `process.on('unhandledRejection')` that log the error with full context, attempt a graceful shutdown (stop accepting new connections, finish in-flight requests with a timeout, THEN exit), and explain why CONTINUING to run after an uncaught exception is dangerous (the process may be in an undefined/corrupted state — relate to Q163's programmer-error philosophy) even though it's technically possible to "catch and continue" with these global handlers.
- **Expected Time Complexity:** O(1) for the handler; shutdown time bounded by in-flight request timeout
- **Expected Space Complexity:** O(1)
- **Hints:** `server.close()` stops accepting NEW connections but waits for existing ones to finish — combine with a hard timeout (`setTimeout(() => process.exit(1), timeoutMs)`) in case some connection never finishes; log BEFORE attempting shutdown, since the shutdown process itself might fail.
- **Edge Cases:** An error occurring DURING the graceful shutdown process itself (need a safeguard against infinite loops/recursive error handling), `unhandledRejection` being deprecated/changing behavior across Node versions (historically Node warned and continued; newer versions can be configured to crash by default — discuss `--unhandled-rejections=strict` and why CRASHING is now considered the safer default, consistent with Q163).

### Q165
- **Difficulty:** Hard
- **Topic:** Error Handling
- **Problem Statement:** Design a frontend error reporting/monitoring strategy (conceptually similar to what Sentry/Bugsnag provide): implement a global handler combining `window.onerror` (for synchronous uncaught errors), `window.onunhandledrejection` (for unhandled promise rejections), and a React-like Error Boundary CONCEPT (a wrapper that catches errors during rendering — describe the mechanism even if not implementing a full React integration) that reports errors to a backend endpoint, INCLUDING deduplication (the same error occurring 1000 times in a tight loop shouldn't send 1000 reports — implement client-side rate limiting/sampling per unique error signature) and enrichment (attaching browser info, user ID if available, breadcrumb trail of recent user actions leading up to the error).
- **Expected Time Complexity:** O(1) per error occurrence (with O(1) deduplication check via a hash map of recent error signatures)
- **Expected Space Complexity:** O(e) for e unique recent error signatures tracked, bounded by a TTL-based or LRU eviction (per Q127) to avoid unbounded growth
- **Hints:** An error "signature" for deduplication could be a hash of `(error.message, error.stack's first few frames)` — exact stack traces can vary slightly due to inlining/minification, so consider whether to normalize; breadcrumbs can be a fixed-size circular buffer of recent user actions (clicks, navigation, console logs) maintained globally.
- **Edge Cases:** Errors from third-party scripts (often reported as `"Script error."` with no useful stack trace due to CORS restrictions on cross-origin scripts without `crossorigin` attribute — explain this browser security behavior and how to fix it for first-party scripts you control), the error reporting call ITSELF failing (must not cause an infinite loop of "error reporting the error-reporting error").

### Q166
- **Difficulty:** Medium
- **Topic:** Error Handling
- **Problem Statement:** Predict the output and explain the `finally` block's interaction with `return` statements in `try`/`catch`/`finally`:
```js
function test1() {
  try {
    return 'try';
  } finally {
    console.log('finally1');
  }
}
function test2() {
  try {
    return 'try';
  } finally {
    return 'finally2';
  }
}
function test3() {
  try {
    throw new Error('try error');
  } finally {
    return 'finally3';
  }
}
console.log(test1());
console.log(test2());
console.log(test3());
```
- **Expected Time Complexity:** O(1)
- **Expected Space Complexity:** O(1)
- **Hints:** A `return` (or `throw`) inside `finally` OVERRIDES any pending `return`/`throw` from the `try`/`catch` block — this is a notorious JS/Java gotcha; `finally` ALWAYS runs before the function actually returns, even if `try` already hit a `return`.
- **Edge Cases:** `test3` — does the thrown error from `try` propagate at all, or is it completely SWALLOWED by `finally`'s `return`? (It's swallowed — explain why this is considered a serious anti-pattern: silently discarding exceptions.)

### Q167
- **Difficulty:** Staff
- **Topic:** Error Handling
- **Problem Statement:** Design a typed Result/error-handling convention for a TypeScript codebase as an alternative to throwing exceptions for EXPECTED operational errors (building on the `Either` monad from Q134, but designed as a pragmatic, ergonomic pattern rather than full FP — similar to Rust's `Result<T, E>` or Go's error-as-value style). Define `type Result<T, E = Error> = { ok: true, value: T } | { ok: false, error: E }`, helper functions `ok(value)`/`err(error)`, and a `tryCatch(fn): Result<T, E>` wrapper for converting throwing code into `Result`-returning code at the boundary. Discuss the trade-offs vs exceptions: explicit error handling at call sites (TypeScript can enforce checking `result.ok` via discriminated union narrowing) vs the verbosity of `Result` types propagating through every function signature, and propose a pragmatic boundary (e.g., use `Result` for expected domain errors in business logic, but allow exceptions for genuinely unexpected/programmer errors per Q163).
- **Expected Time Complexity:** O(1) per operation
- **Expected Space Complexity:** O(1)
- **Hints:** TypeScript's discriminated unions make `if (result.ok) { result.value } else { result.error }` fully type-safe with NARROWING — this is the key ergonomic win over a plain try/catch where the caught error's type is `unknown` (in strict TS) and requires manual type-guarding.
- **Edge Cases:** Composing multiple `Result`-returning operations (chaining — similar to `Either`'s `flatMap`/`chain` from Q134) without deeply nested `if (result.ok) { ... if (result2.ok) { ... } }` pyramids — discuss implementing a `Result.chain`/`andThen` helper or considering whether this is where the FP `Either` monad's `chain` method genuinely pays for its abstraction cost, in contrast to Q134's caution about over-using monadic patterns.

### Q168
- **Difficulty:** Hard
- **Topic:** Error Handling
- **Problem Statement:** Explain `AggregateError` (ES2021, used by `Promise.any` per Q76) and implement a `validateForm(formData, validators)` function that runs ALL validators (not stopping at the first failure, unlike typical exception-based validation which short-circuits) and throws a SINGLE `AggregateError` containing ALL validation failures if any occurred, so the UI can display ALL errors to the user at once rather than one-at-a-time (a common UX requirement that's awkward with naive try/catch-per-field approaches).
- **Expected Time Complexity:** O(v) where v = number of validators/fields
- **Expected Space Complexity:** O(e) where e = number of errors (e ≤ v)
- **Hints:** `new AggregateError(errors, message)`; run all validators within a loop collecting failures into an array rather than throwing immediately on the first one.
- **Edge Cases:** Zero validators provided (trivially valid — no `AggregateError` thrown), a validator that itself throws unexpectedly (a programmer error in the VALIDATOR itself, per Q163's distinction) — should this be caught and treated as a validation failure, or allowed to propagate and crash the whole `validateForm` call (discuss why these are different failure modes deserving different treatment)?

---

## SECTION 29: Performance Optimization (Q169–Q177)

### Q169
- **Difficulty:** Medium
- **Topic:** Performance Optimization
- **Problem Statement:** Explain V8's hidden classes (also called "Shapes" or "Maps" internally) and inline caching: why creating objects with the SAME property insertion order/structure (e.g., always `{x, y}` not sometimes `{y, x}` or `{x, y, z}`) allows the engine to optimize property access dramatically. Given a constructor function that conditionally adds properties (`if (hasZ) this.z = 0;`), refactor it to ALWAYS initialize all properties (even to `undefined`/a sentinel) in a CONSISTENT order, and explain the resulting performance improvement in terms of monomorphic vs polymorphic/megamorphic call sites.
- **Expected Time Complexity:** O(1) for property access regardless, but with vastly different CONSTANT factors between monomorphic (fast, inline-cached) and megamorphic (slow, dictionary-mode lookup) access patterns
- **Expected Space Complexity:** O(1) per object; discuss that "wasted" `undefined` properties have minimal real overhead compared to the hidden-class transition cost they avoid
- **Hints:** A "polymorphic" call site sees a FEW different hidden classes (still optimizable with limited inline caches); "megamorphic" sees too many (falls back to slow generic property lookup).
- **Edge Cases:** Deleting a property with `delete obj.x` (this is ESPECIALLY expensive — it can force the object into "dictionary mode" entirely, permanently slower for ALL property access on that object, not just the deleted one) — propose `obj.x = undefined` as an alternative when the SEMANTIC difference between "deleted" and "undefined" doesn't matter for your use case.

### Q170
- **Difficulty:** Hard
- **Topic:** Performance Optimization
- **Problem Statement:** Given a function that processes a 10-million-element array in a hot path (called every animation frame), compare and benchmark (conceptually — describe the methodology and expected results, since actual execution isn't possible here) FOUR implementations: (a) `for (let i = 0; i < arr.length; i++)`, (b) `for (const item of arr)`, (c) `arr.forEach(...)`, (d) `arr.map(...)`/`.filter(...)` chains. Rank them by expected performance and explain WHY: caching `arr.length` vs re-reading it each iteration, iterator protocol overhead for `for...of` over plain arrays, function call overhead for `forEach`'s callback per iteration, and intermediate array allocation for `map`/`filter` chains.
- **Expected Time Complexity:** O(n) for all four (asymptotically identical) — the question is about CONSTANT FACTORS
- **Expected Space Complexity:** O(1) for (a)/(b)/(c); O(n) per stage for (d)
- **Hints:** Modern V8 has significantly optimized `forEach`/`for...of` over the years, narrowing (but not eliminating) the gap with raw `for` loops — discuss that MICRO-benchmarking claims age quickly and the importance of profiling YOUR actual code/engine version rather than trusting old blog posts.
- **Edge Cases:** The array containing HOLES (sparse) — `for...of` and `forEach` treat holes differently (forEach SKIPS holes entirely, calling the callback fewer times than `array.length`; for...of yields `undefined` for holes, calling the callback the full `length` times) — this is a CORRECTNESS difference, not just performance, that matters more than raw speed in many real cases.

### Q171
- **Difficulty:** Staff
- **Topic:** Performance Optimization
- **Problem Statement:** A production React-like SPA exhibits janky scrolling on a page rendering a virtualized list (per Q48) of 50 visible rows, each row containing a complex nested component tree. Using the Chrome DevTools Performance panel methodology (describe the analysis steps even without actually running it here), diagnose THREE plausible root causes (e.g., (1) unnecessary re-renders due to new function/object references passed as props on every parent re-render — relate to Q129's reference-stability discussion, (2) expensive synchronous work in a scroll handler causing layout thrashing per Q99, (3) large/unoptimized images causing decode-time jank) and propose a specific fix for EACH, along with how you'd VERIFY the fix worked using performance profiling (before/after flame graphs, Long Tasks API, Core Web Vitals like INP).
- **Expected Time Complexity:** Discussion-based; target <16ms per frame for 60fps, or <50ms tasks per modern responsiveness guidelines (relating to Long Tasks)
- **Expected Space Complexity:** N/A
- **Hints:** `React.memo`/reference-stable callbacks (`useCallback`) for (1); `rafThrottle` from Q124 or moving work off the scroll handler entirely for (2); `loading="lazy"`, appropriately-sized images, modern formats (WebP/AVIF), and `decoding="async"` for (3).
- **Edge Cases:** A fix that improves ONE metric (e.g., scripting time) but REGRESSES another (e.g., `useMemo`'s comparison overhead exceeding the cost of just recomputing, per Q129's caution about memoization overhead) — discuss the importance of measuring holistically, not optimizing a single number in isolation.

### Q172
- **Difficulty:** Hard
- **Topic:** Performance Optimization
- **Problem Statement:** Explain "tree shaking" in the context of ES modules and bundlers (webpack, Rollup, esbuild): why ES modules' STATIC structure (imports/exports known at compile time, unlike CommonJS's dynamic `require`) enables dead code elimination, and what specific coding patterns DEFEAT tree shaking (e.g., re-exporting an entire namespace `export * from './utils'` when only one function is used elsewhere, side-effectful module-level code that the bundler can't prove is safe to remove, `sideEffects: false` in `package.json` and its risks if the package ACTUALLY has side effects). Given a utility library file exporting 50 functions where a consuming app only uses 3, explain step-by-step why a naive `import * as utils from './utils'` followed by `utils.foo()` may prevent tree-shaking the other 47, vs `import { foo } from './utils'`.
- **Expected Time Complexity:** O(1) — this is a build-time/bundle-size concern, not runtime
- **Expected Space Complexity:** Directly affects final bundle SIZE (a key "space" metric for frontend performance, even though it's not algorithmic space complexity)
- **Hints:** Some bundlers CAN tree-shake namespace imports if they can statically analyze which properties of the namespace object are actually accessed, but this is less reliable than direct named imports — recommend named imports as the safer default.
- **Edge Cases:** A module with a side-effectful top-level statement (e.g., `console.log('loaded')` or polyfill registration) that the bundler must KEEP even if no exports are used, unless `sideEffects: false` is declared — and the danger of declaring `sideEffects: false` on a package that ACTUALLY needs some side effects (the bundler will incorrectly strip them, causing subtle production bugs).

### Q173
- **Difficulty:** Staff
- **Topic:** Performance Optimization
- **Problem Statement:** Design a code-splitting and lazy-loading strategy for a large SPA (relate to Q72's dynamic imports) with the goal of minimizing Time to Interactive (TTI) and Largest Contentful Paint (LCP) for the initial route, while NOT introducing excessive "waterfall" loading delays for subsequent navigation. Discuss: route-based splitting (each page is a separate chunk), component-based splitting for heavy below-the-fold or rarely-used components (e.g., a rich text editor only needed when a user clicks "edit"), PRELOADING strategies (`<link rel="prefetch">` for likely-next routes based on user behavior/hover intent, vs `rel="preload"` for critical-but-not-immediately-rendered resources), and the trade-off between TOO MANY small chunks (HTTP overhead, even with HTTP/2 multiplexing, plus the runtime cost of many small module evaluations) vs TOO FEW large chunks (slower initial load, less caching granularity — a single CSS/icon change invalidates the whole bundle's cache).
- **Expected Time Complexity:** Discussion-based; target metrics like LCP < 2.5s, INP < 200ms per Core Web Vitals
- **Expected Space Complexity:** Bundle size budgets, e.g., initial JS < 170KB compressed (a commonly cited rough guideline, though context-dependent)
- **Hints:** Hover-intent prefetching (prefetch a route's chunk when the user hovers a link, before they click — buys ~100-300ms of head start) is a well-known technique (used by frameworks like Next.js, Quicklink); chunk granularity is often tuned via bundler configuration (e.g., webpack's `splitChunks` with size/count heuristics) rather than purely manual `import()` placement.
- **Edge Cases:** A user on a slow/metered connection — should AGGRESSIVE prefetching be disabled based on the Network Information API (`navigator.connection.saveData`/`effectiveType`) to respect their data constraints and battery life? Discuss this as a real production consideration, not just a theoretical one.

### Q174
- **Difficulty:** Medium
- **Topic:** Performance Optimization
- **Problem Statement:** Explain string concatenation performance: why repeatedly concatenating strings with `+=` in a loop (building a large string from many small pieces) is less efficient than using an array and `Array.prototype.join('')` at the end, in terms of how JS engines represent strings (immutability — every `+=` historically could mean allocating a NEW string of the combined length, though modern engines use "rope" structures/concatenation optimizations that mitigate but don't eliminate this). Write a benchmark METHODOLOGY (not actual execution) comparing both approaches for building a 100,000-line CSV string, and discuss at what scale this optimization actually matters (premature optimization caution — for small strings, the difference is negligible and `join` may even be slower due to array overhead).
- **Expected Time Complexity:** O(n) for array+join (well-optimized); historically O(n²) worst-case for naive `+=` without rope optimization, though modern engines mitigate this significantly
- **Expected Space Complexity:** O(n) for the array of pieces; O(n) for the final string either way
- **Hints:** Modern V8 uses "cons strings"/ropes internally for `+`/`+=` that defer actual concatenation, making the naive concern LESS severe than it was in ES3-era engines — but `join` remains a safe, clearly-correct, and commonly-recommended pattern regardless.
- **Edge Cases:** Building a string where each piece needs separate processing/transformation BEFORE concatenation (e.g., escaping each CSV field) — does this change the analysis (the per-piece transformation cost likely dominates either way at sufficient piece sizes)?

### Q175
- **Difficulty:** Hard
- **Topic:** Performance Optimization
- **Problem Statement:** Explain "Long Tasks" (any task on the main thread exceeding 50ms, as defined by the Long Tasks API / `PerformanceObserver` with `entryTypes: ['longtask']`) and their relationship to Interaction to Next Paint (INP), a Core Web Vital. Implement a `monitorLongTasks(callback)` function using `PerformanceObserver` that reports long tasks with their duration and (where available) attribution info, and propose a strategy for BREAKING UP a known long task (e.g., processing a large dataset on form submission) using the time-slicing technique from Q95's `yieldToMain`, demonstrating the before/after impact on INP.
- **Expected Time Complexity:** O(1) for the observer setup; the underlying task being monitored retains its own complexity
- **Expected Space Complexity:** O(1)
- **Hints:** `new PerformanceObserver((list) => { list.getEntries().forEach(callback); }).observe({ entryTypes: ['longtask'] });`; breaking up a long task doesn't reduce TOTAL work, but it allows the browser to interleave INPUT HANDLING and RENDERING between chunks, directly improving perceived responsiveness (INP).
- **Edge Cases:** The Long Tasks API not being supported in all browsers (feature-detection needed, `'PerformanceObserver' in window && PerformanceObserver.supportedEntryTypes?.includes('longtask')`), a "long task" that's actually MULTIPLE smaller scripts running back-to-back with no yield point in between (the API reports the COMBINED task, which may need deeper instrumentation via User Timing API marks to pinpoint which specific script is the culprit).

### Q176
- **Difficulty:** Staff
- **Topic:** Performance Optimization
- **Problem Statement:** Design a performance budget and CI enforcement strategy for a frontend team: define specific, measurable budgets (e.g., "initial JS bundle < 200KB gzipped," "LCP < 2.5s on a simulated 'Slow 4G' + mid-tier mobile CPU profile," "no individual long task > 200ms in the critical user journey") and propose HOW each would be enforced automatically in CI (bundle size via `bundlesize`/webpack-bundle-analyzer budgets failing the build; LCP/performance via Lighthouse CI with assertion thresholds run against a deployed preview environment). Discuss the challenge of FLAKY performance CI checks (timing-based assertions are inherently noisier than functional test assertions) and propose mitigations (running multiple trials and taking a percentile, using consistent CI hardware/throttling profiles, separating "hard fail" budgets from "warn only" regressions).
- **Expected Time Complexity:** N/A — process/tooling design question
- **Expected Space Complexity:** N/A
- **Hints:** Lighthouse CI supports `assertions` with `minScore`/numeric thresholds per metric and can run against multiple URLs; bundle-size tooling typically diffs against a baseline (e.g., the main branch) rather than just an absolute number, to catch REGRESSIONS specifically.
- **Edge Cases:** A legitimate feature addition that NECESSARILY increases bundle size beyond budget (e.g., adding a required charting library) — the CI gate shouldn't be an unbreakable wall; discuss an "override with justification + team lead approval" escape hatch vs simply raising the budget (and the risk of budgets perpetually creeping up if overrides are too easy).

### Q177
- **Difficulty:** Hard
- **Topic:** Performance Optimization
- **Problem Statement:** Explain `requestIdleCallback` and its use case for low-priority background work (e.g., pre-fetching data for a likely-next view, sending non-critical analytics, cleaning up old cache entries) that should run WITHOUT competing with user-interaction-critical work. Implement a `scheduleIdleWork(tasks)` queue that processes an array of low-priority task functions during idle periods, using the `deadline.timeRemaining()` and `deadline.didTimeout` parameters correctly, with a fallback to `setTimeout` for environments without `requestIdleCallback` support (notably Safari, historically). Discuss why `requestIdleCallback` is NOT appropriate for visual updates (use `requestAnimationFrame` instead, per Q124) — idle callbacks can be significantly delayed or never fire if the browser stays busy.
- **Expected Time Complexity:** O(t) total tasks processed across however many idle periods are needed
- **Expected Space Complexity:** O(t) for the pending task queue
- **Hints:** Pass a `timeout` option to `requestIdleCallback` to guarantee the callback eventually runs even under sustained busy conditions (`didTimeout` will be `true` in that case, signaling the work should proceed even without much `timeRemaining()`).
- **Edge Cases:** A single task within the queue taking LONGER than the remaining idle time once started (idle callbacks can't be "paused" mid-task — the task should ideally be SELF-CHUNKED, similar to Q95, if its duration is unpredictable and potentially large), `requestIdleCallback` never firing because the page is consistently busy (the `timeout` option is the safeguard, but discuss whether truly low-priority work should even have a timeout, or whether eventual starvation is acceptable for THAT specific work — e.g., is pre-fetching the next page worth FORCING execution via timeout, vs just never doing it if the user is constantly busy interacting?).

---

## SECTION 30: Memory Management (Q178–Q183)
