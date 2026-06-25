## SECTION 17: DOM (Q96–Q102)

### Q96
- **Difficulty:** Easy
- **Topic:** DOM
- **Problem Statement:** Explain the difference between the DOM and the HTML source/document. Explain `document.querySelector` vs `getElementById` vs `getElementsByClassName` in terms of return types (single element vs live `NodeList`/`HTMLCollection` vs static `NodeList`) and performance characteristics. Write code demonstrating the "live collection" behavior of `getElementsByClassName` when elements are added/removed dynamically.
- **Expected Time Complexity:** O(n) for collection-returning queries where n = matching elements; live collections re-query on access
- **Expected Space Complexity:** O(1) for live collections (no snapshot); O(n) for static `NodeList` from `querySelectorAll`
- **Hints:** `querySelectorAll` returns a static snapshot; `getElementsByClassName`/`getElementsByTagName` return live collections that update automatically.
- **Edge Cases:** Iterating over a live `HTMLCollection` while removing elements from it during iteration (classic off-by-one/skip bug).

### Q97
- **Difficulty:** Medium
- **Topic:** DOM
- **Problem Statement:** Explain event delegation: how does it work via event bubbling, and why is it preferred over attaching individual listeners to many child elements (e.g., a list of 10,000 items)? Implement a delegated click handler on a `<ul>` that handles clicks on `<li>` items (including dynamically added ones, without re-binding), determines which `<li>` was clicked via `event.target.closest()`, and ignores clicks on the `<ul>` itself (outside any `<li>`).
- **Expected Time Complexity:** O(1) per click (vs O(n) listener registrations avoided)
- **Expected Space Complexity:** O(1) — single listener regardless of child count
- **Hints:** `event.target` is the actual clicked element (could be deeply nested inside the `<li>`, e.g., a `<span>`); `closest('li')` walks up to find the relevant ancestor.
- **Edge Cases:** Click on whitespace/padding of the `<ul>` itself (not inside any `<li>` — `closest` returns `null`), clicks on elements added to the DOM after the listener was attached (must work without re-binding — this is the whole point of delegation), `event.stopPropagation()` called by a nested handler preventing delegation from working.

### Q98
- **Difficulty:** Hard
- **Topic:** DOM
- **Problem Statement:** Explain the differences between `event.preventDefault()`, `event.stopPropagation()`, and `event.stopImmediatePropagation()`. Given three nested elements each with both a "capture" and "bubble" phase click listener, trace the exact execution order of all six listeners when the innermost element is clicked, and then explain how the order changes if the middle element's bubble-phase listener calls `stopPropagation()`.
- **Expected Time Complexity:** O(d) where d = DOM depth (number of ancestors)
- **Expected Space Complexity:** O(1)
- **Hints:** Capture phase goes top-down (document → target), bubble phase goes bottom-up (target → document); `addEventListener(type, handler, true)` registers for capture phase.
- **Edge Cases:** `stopImmediatePropagation()` called in the FIRST of two listeners on the SAME element/phase — does the second listener on that same element still run?

### Q99
- **Difficulty:** Hard
- **Topic:** DOM
- **Problem Statement:** Explain "layout thrashing" / "forced synchronous layout" (also called "reflow"): what causes it (interleaving DOM writes and reads of layout-dependent properties like `offsetHeight`, `getBoundingClientRect()` in a loop), and why it's a major performance issue. Refactor the following code, which resizes 1000 elements based on their current height, to avoid layout thrashing:
```js
const elements = document.querySelectorAll('.item');
elements.forEach(el => {
  const height = el.offsetHeight; // read (forces layout)
  el.style.height = (height * 1.1) + 'px'; // write (invalidates layout)
});
```
- **Expected Time Complexity:** O(n) reads + O(n) writes, but with O(n²)-like real-world cost due to repeated layout recalculation if interleaved; O(n) total with batching
- **Expected Space Complexity:** O(n) for storing intermediate read values
- **Hints:** Batch all reads first into an array, THEN perform all writes ("read phase" then "write phase"); consider `requestAnimationFrame` for visual updates.
- **Edge Cases:** What if a later element's height depends on an earlier element's NEW height (a genuine read-after-write dependency) — can batching still be applied, or is thrashing unavoidable in that case?

### Q100
- **Difficulty:** Staff
- **Topic:** DOM
- **Problem Statement:** Implement a `VirtualDOMDiff` algorithm (simplified, like a mini-React reconciler): given two simple virtual node trees `{ type: string, props: object, children: VNode[] | string }`, write `diff(oldVNode, newVNode)` that produces a list of patch operations (`REPLACE`, `UPDATE_PROPS`, `UPDATE_TEXT`, `ADD_CHILD`, `REMOVE_CHILD`, `REORDER`) needed to transform the old tree into the new one, and `applyPatches(domNode, patches)` that applies them to a real DOM node. Discuss the key-based reconciliation strategy for list children to avoid unnecessary DOM node recreation when items are reordered.
- **Expected Time Complexity:** O(n) with keyed reconciliation (vs O(n²) or worse for naive index-based diffing with reordering); O(n) for `applyPatches`
- **Expected Space Complexity:** O(n) for the patch list
- **Hints:** Without keys, reordering looks like "remove all, add all" (O(n) DOM operations but loses element identity/state); with keys, build a `Map` from key to old child for O(1) lookups during the new pass.
- **Edge Cases:** Node type changes entirely (e.g., `div` → `span`) — must be a `REPLACE`, not prop diffing; children array shrinks/grows; duplicate keys (how should this be handled — error, warning, or silently take the first match?).

### Q101
- **Difficulty:** Medium
- **Topic:** DOM
- **Problem Statement:** Explain the `MutationObserver` API and a real-world use case (e.g., detecting when a third-party widget injects DOM nodes you need to style/modify, without polling). Implement a function `waitForElement(selector, root = document.body)` that returns a promise resolving with the element once it appears in the DOM (using `MutationObserver`, not polling/`setInterval`), with a configurable timeout that rejects if the element never appears.
- **Expected Time Complexity:** O(1) amortized per mutation batch (depends on mutation frequency, not polling interval)
- **Expected Space Complexity:** O(1)
- **Hints:** Check if the element already exists before setting up the observer (avoid waiting unnecessarily); `observer.disconnect()` on resolve/timeout to avoid leaks.
- **Edge Cases:** The element exists at call time (resolve immediately, no observer needed), the element is added then immediately removed before the promise resolves (race condition — should the promise still resolve with a now-detached node, or should it keep waiting?), timeout of `0` or negative.

### Q102
- **Difficulty:** Hard
- **Topic:** DOM
- **Problem Statement:** Explain the Shadow DOM and its encapsulation guarantees (style and DOM scoping) in the context of Web Components. Write a custom element `<user-card>` using `customElements.define`, attaching a shadow root, with scoped CSS that doesn't leak to/from the rest of the page, and an attribute `name` that, when changed via `setAttribute`, triggers a re-render via `attributeChangedCallback` and `observedAttributes`.
- **Expected Time Complexity:** O(1) per attribute change
- **Expected Space Complexity:** O(1)
- **Hints:** `attachShadow({ mode: 'open' | 'closed' })`; `static get observedAttributes() { return ['name']; }`; `connectedCallback` for initial render.
- **Edge Cases:** Attribute set to the same value it already had (does `attributeChangedCallback` fire — and should the re-render be skipped for performance?), element removed from DOM then re-added (`disconnectedCallback`/`connectedCallback` lifecycle), `mode: 'closed'` shadow roots and how they affect `element.shadowRoot` access from outside.

---

## SECTION 18: Browser APIs (Q103–Q108)

### Q103
- **Difficulty:** Medium
- **Topic:** Browser APIs
- **Problem Statement:** Explain the `IntersectionObserver` API and implement a `lazyLoadImages()` function that lazily loads images (`<img data-src="...">`) only when they're about to enter the viewport (using a `rootMargin` to preload slightly before visibility), replacing `data-src` with `src` and disconnecting the observer for that image once loaded.
- **Expected Time Complexity:** O(1) per intersection callback invocation (not per-scroll-event, which is the key performance win over scroll listeners)
- **Expected Space Complexity:** O(n) for n observed images until each is unobserved
- **Hints:** Compare to the older approach of listening to `scroll`/`resize` and calling `getBoundingClientRect()` repeatedly (causes layout thrashing per Q99); `IntersectionObserver` runs off the main thread's synchronous layout path.
- **Edge Cases:** Image fails to load (`onerror` — should it retry, show a placeholder, and should the observer behavior differ?), images added to the DOM after `lazyLoadImages()` initially runs (does the function need to be re-invoked, or should it itself use a `MutationObserver` to catch new images?).

### Q104
- **Difficulty:** Hard
- **Topic:** Browser APIs
- **Problem Statement:** Explain Web Workers: how they enable true parallelism in JavaScript (separate thread, separate memory, message-passing via `postMessage`/`structuredClone` under the hood), and their limitations (no DOM access). Implement a `runInWorker(fn, ...args)` utility that takes a pure function, serializes it to a string, spins up a `Worker` from a `Blob` URL, executes the function with the given arguments inside the worker, and returns a promise with the result — effectively an ad-hoc "offload this computation" utility. Discuss the serialization limitations (closures over outer variables won't work).
- **Expected Time Complexity:** O(1) overhead for worker spin-up (non-trivial — discuss when this overhead outweighs the benefit for small tasks) plus O(f) for the function's own complexity
- **Expected Space Complexity:** O(1) for message passing (structured clone cost proportional to data size)
- **Hints:** `new Blob([\`self.onmessage = e => { const fn = ${fn.toString()}; self.postMessage(fn(...e.data)); }\`], { type: 'application/javascript' })`; remember to `URL.revokeObjectURL` and `worker.terminate()`.
- **Edge Cases:** `fn` references variables from its closure (will throw `ReferenceError` inside the worker — explain why, since `toString()` only captures the function's source text, not its closure environment), `fn` throws an error (must be caught and the promise must reject, not hang), large data arguments (structured clone cost).

### Q105
- **Difficulty:** Staff
- **Topic:** Browser APIs
- **Problem Statement:** Design a client-side request deduplication and caching layer using the `fetch` API combined with the `Cache` API (Service Worker) or an in-memory `Map`, for a Single Page Application. Requirements: identical GET requests made within a configurable TTL return cached responses; in-flight identical requests (before the first completes) share the same promise (no duplicate network calls); cache entries can be invalidated by URL pattern (e.g., after a mutation, invalidate all `/users/*` cached GETs); support `staleWhileRevalidate` (return cached data immediately but refresh in the background).
- **Expected Time Complexity:** O(1) for cache lookups (hash map by request key); O(p) for pattern-based invalidation where p = number of cached entries
- **Expected Space Complexity:** O(c) where c = number of cached entries, bounded by an eviction policy (discuss LRU)
- **Hints:** Cache key = method + URL + (optionally) relevant headers/body hash; `staleWhileRevalidate` returns the cached promise immediately AND kicks off a new fetch whose result replaces the cache entry for next time.
- **Edge Cases:** Two requests to the same URL but different query parameters (different cache keys — ensure correct key construction), a request that's cached but the underlying data changed via a different mutation path not covered by the invalidation pattern (stale data risk — discuss mitigations), cache growing unbounded (LRU eviction).

### Q106
- **Difficulty:** Hard
- **Topic:** Browser APIs
- **Problem Statement:** Explain the `History` API (`pushState`, `replaceState`, `popstate` event) and how Single Page Application routers are built on top of it without full page reloads. Implement a minimal client-side router `createRouter(routes)` where `routes` is a map of path patterns (supporting params like `/users/:id`) to handler functions, that intercepts clicks on `<a>` tags with matching `href`s (preventing default navigation), updates the URL via `pushState`, calls the matching handler with extracted params, and correctly handles browser back/forward buttons via `popstate`.
- **Expected Time Complexity:** O(r) per navigation where r = number of routes (linear matching; discuss trie-based optimization for large route tables)
- **Expected Space Complexity:** O(r)
- **Hints:** Convert route patterns to regex (`/users/:id` → `/^\/users\/([^/]+)$/` capturing `id`); `popstate` fires on back/forward but NOT on `pushState`/`replaceState` themselves — must manually invoke the handler after those too.
- **Edge Cases:** Clicking a link with a modifier key held (Ctrl/Cmd+click for new tab — should NOT be intercepted), an `<a>` with `target="_blank"` or external `href` (should NOT be intercepted), navigating to a URL with no matching route (404 handler), trailing slashes (`/users/1` vs `/users/1/`).

### Q107
- **Difficulty:** Hard
- **Topic:** Browser APIs
- **Problem Statement:** Explain the `BroadcastChannel` API and its use case for cross-tab communication (e.g., logging out a user in all open tabs when they log out in one). Implement a `useCrossTabState(key, initialValue)`-style utility (framework-agnostic core logic) that synchronizes a piece of state across tabs: when one tab updates the value, all other tabs receive the update via `BroadcastChannel` AND the value is persisted to `localStorage` (with the `storage` event as a fallback for browsers/contexts where `BroadcastChannel` might miss events, e.g., the tab that made the change doesn't receive its own `storage` event but DOES receive its own `BroadcastChannel` message — discuss this asymmetry).
- **Expected Time Complexity:** O(1) per update; O(t) broadcast to t tabs (handled by the browser, not application code)
- **Expected Space Complexity:** O(1) per key
- **Hints:** `localStorage`'s `storage` event fires in OTHER tabs/windows, not the originating one — `BroadcastChannel` fires in other contexts too but can be combined for redundancy; always serialize/deserialize via JSON for non-string values.
- **Edge Cases:** `BroadcastChannel` not supported (older Safari versions historically) — fallback purely to `storage` events, Two tabs updating the same key nearly simultaneously (last-write-wins — is this acceptable, or does the use case need conflict resolution?), tab closed while a broadcast is in flight.

### Q108
- **Difficulty:** Staff
- **Topic:** Browser APIs
- **Problem Statement:** Design an offline-first data synchronization layer for a web app using IndexedDB for local persistence and the `online`/`offline` events plus Background Sync API (conceptually, if not fully implementable in this environment) for queueing writes made while offline. When the app comes back online, queued writes should be sent to the server in order, with conflict resolution for writes that conflict with server-side changes made in the meantime (discuss strategies: last-write-wins via timestamps, operational transforms, or CRDTs — pick one and justify for a simple "todo list" use case).
- **Expected Time Complexity:** O(q) to flush q queued writes on reconnect; O(1) per IndexedDB transaction (amortized, async)
- **Expected Space Complexity:** O(q) for the offline queue, bounded by storage quota
- **Hints:** IndexedDB transactions are asynchronous and version-based (schema migrations via `onupgradeneeded`); for a todo list, last-write-wins with a `updatedAt` timestamp is often sufficient and far simpler than CRDTs — justify this trade-off explicitly.
- **Edge Cases:** App closed while offline with queued writes (must persist the queue itself in IndexedDB, not memory), the same item edited both offline and on the server (conflict — what does the user see?), IndexedDB quota exceeded (`QuotaExceededError`).

---

## SECTION 19: Fetch API (Q109–Q112)

### Q109
- **Difficulty:** Easy
- **Topic:** Fetch API
- **Problem Statement:** Explain why `fetch` does NOT reject on HTTP error statuses (404, 500, etc.) — only on network failures — and why this is a common source of bugs for developers coming from libraries like `axios` (which DOES reject on non-2xx by default). Write a wrapper `fetchJson(url, options)` that throws a custom `HttpError` (containing `status`, `statusText`, and parsed body if available) for non-2xx responses, and returns the parsed JSON for successful responses.
- **Expected Time Complexity:** O(1) plus network/parse time
- **Expected Space Complexity:** O(response size)
- **Hints:** Check `response.ok` (true for 200-299); attempt to parse the error body as JSON but fall back to text if parsing fails (error responses aren't always JSON).
- **Edge Cases:** A 204 No Content response (no body to parse — `response.json()` would throw on empty body), the error body itself failing to parse as JSON (e.g., an HTML error page from a misconfigured server), network failure (DNS, CORS) vs HTTP error — both should be distinguishable in the thrown error.

### Q110
- **Difficulty:** Medium
- **Topic:** Fetch API
- **Problem Statement:** Implement request cancellation using `AbortController` for a search-as-you-type feature: `searchUsers(query)` should cancel any in-flight previous request when a new one is made (so only the latest query's response is processed, preventing race conditions where an older, slower response overwrites a newer one's results).
- **Expected Time Complexity:** O(1) per keystroke (cancellation overhead); actual network requests bounded by debounce
- **Expected Space Complexity:** O(1) — only one `AbortController` reference held at a time
- **Hints:** Store the current `AbortController` in a variable accessible across calls (module-level or component state); call `.abort()` on the previous one before creating a new one for each new search.
- **Edge Cases:** A request that's already complete when a new search starts (no need to abort, but also must ensure its `.then()` doesn't process stale results — combine abort with a "is this still the latest request?" check as defense-in-depth), `AbortError` being caught and re-thrown vs silently ignored (it shouldn't be shown to the user as a "real" error).

### Q111
- **Difficulty:** Hard
- **Topic:** Fetch API
- **Problem Statement:** Explain streaming responses with `fetch` using `response.body` as a `ReadableStream`. Implement a function `streamJsonLines(url, onItem)` that fetches a newline-delimited JSON (NDJSON) endpoint and calls `onItem(parsedObject)` for each complete JSON object as it arrives, WITHOUT waiting for the entire response to download — handling the case where a chunk boundary splits a JSON object across two `read()` calls.
- **Expected Time Complexity:** O(n) total bytes processed; O(1) per complete line/object emitted
- **Expected Space Complexity:** O(buffer) where buffer holds at most one incomplete line at a time
- **Hints:** Use `response.body.getReader()` and `TextDecoder` with `stream: true` to handle multi-byte UTF-8 characters split across chunks; maintain a string buffer, split on `\n`, process all complete lines, keep the remainder in the buffer.
- **Edge Cases:** A line that's invalid JSON (skip with a warning, or abort the whole stream?), the response ending without a trailing newline (the final buffered content is a complete line that must still be processed), multi-byte UTF-8 characters split exactly at a chunk boundary (`TextDecoder`'s `stream: true` option handles this — explain how).

### Q112
- **Difficulty:** Staff
- **Topic:** Fetch API
- **Problem Statement:** Design a robust API client layer for a large frontend application that wraps `fetch` with: automatic retry with exponential backoff for transient errors (5xx, network errors) but NOT for 4xx errors; automatic auth token attachment and refresh-on-401 (with the `AsyncLock`/single-flight pattern from Q87 to avoid multiple simultaneous refresh attempts); request/response interceptors (middleware-style, for logging, request ID injection, etc.); and request deduplication for identical concurrent GETs. Provide the high-level architecture (class/module structure) and the implementation of the 401-refresh-and-retry flow specifically.
- **Expected Time Complexity:** O(1) overhead per request for interceptor chain (O(m) for m interceptors); retries bounded by configuration
- **Expected Space Complexity:** O(1) for the auth lock; O(d) for d in-flight deduplicated requests
- **Hints:** On 401: acquire the refresh lock, refresh the token (or wait if another request already triggered a refresh), then retry the ORIGINAL request once with the new token — must avoid infinite retry loops if the refreshed token ALSO gets a 401 (refresh token itself expired → force logout).
- **Edge Cases:** The token refresh endpoint itself returns 401 (refresh token expired — must not retry forever; should trigger logout/redirect to login), multiple requests failing with 401 simultaneously (only one refresh should occur; all should retry with the new token afterward), a request that explicitly opts out of auth (e.g., the login endpoint itself).

---

## SECTION 20: Local Storage, Session Storage, Cookies (Q113–Q117)

### Q113
- **Difficulty:** Easy
- **Topic:** Local Storage
- **Problem Statement:** Compare `localStorage`, `sessionStorage`, cookies, and `IndexedDB` across: storage capacity, persistence/lifetime, synchronous vs asynchronous API, accessibility from Web Workers, and whether they're sent with HTTP requests automatically. Implement a `safeLocalStorage` wrapper with `get`/`set`/`remove` that gracefully handles environments where `localStorage` is unavailable or throws (e.g., Safari private mode, storage quota exceeded, `localStorage` disabled by browser settings/extensions), falling back to an in-memory `Map`.
- **Expected Time Complexity:** O(1) for get/set (excluding serialization)
- **Expected Space Complexity:** O(n) for stored data, bounded by quota (~5-10MB typical for localStorage)
- **Hints:** Wrap all `localStorage` access in `try/catch`; some browsers throw on `localStorage.setItem` even when `localStorage` exists, in certain privacy modes.
- **Edge Cases:** `localStorage` throwing `SecurityError` on ACCESS (not just `setItem`) in some sandboxed iframe contexts, quota exceeded mid-operation (partial writes — `localStorage` operations are atomic per key, but discuss what happens to the overall app state), storing non-string values (must `JSON.stringify`/`parse`, handle parse errors for corrupted data).

### Q114
- **Difficulty:** Medium
- **Topic:** Local Storage
- **Problem Statement:** Explain the `storage` event: when does it fire, in which contexts (same-origin tabs/windows, NOT the originating tab), and for which storage types (`localStorage` only, not `sessionStorage`). Implement a `useSyncedLocalStorageState(key, initialValue)`-style core function (framework-agnostic) that keeps a value synchronized with `localStorage` AND reacts to changes made in other tabs via the `storage` event, calling a provided `onExternalChange` callback.
- **Expected Time Complexity:** O(1) per event
- **Expected Space Complexity:** O(1)
- **Hints:** `event.key`, `event.oldValue`, `event.newValue`, `event.storageArea` — filter for the relevant key; `event.newValue === null` indicates the key was removed (via `removeItem` or `clear()`).
- **Edge Cases:** `localStorage.clear()` called in another tab (the `storage` event fires with `key: null` and `newValue: null` for ALL keys — your handler must account for this), the value being set to the exact same string it already was (does the `storage` event still fire in other tabs? — it does NOT fire if old and new values are identical).

### Q115
- **Difficulty:** Hard
- **Topic:** Cookies
- **Problem Statement:** Explain cookie attributes critical for security: `HttpOnly`, `Secure`, `SameSite` (`Strict`/`Lax`/`None`), `Domain`, `Path`, and `Max-Age`/`Expires`. Explain why `HttpOnly` cookies cannot be read or set via `document.cookie` (JavaScript), and how this protects against XSS-based session theft. Given a scenario where an app stores a JWT in `localStorage` (vulnerable to XSS exfiltration) vs an `HttpOnly` cookie (vulnerable to CSRF without additional protection), compare the security trade-offs and describe a complete mitigation strategy for the cookie approach (CSRF tokens, `SameSite`).
- **Expected Time Complexity:** O(1)
- **Expected Space Complexity:** O(1)
- **Hints:** `SameSite=Strict` cookies aren't sent on cross-site navigation even for top-level GET requests (can break OAuth redirect flows); `SameSite=Lax` (the modern default) allows top-level navigation GETs but not cross-site POSTs/fetches.
- **Edge Cases:** Third-party cookies in iframes requiring `SameSite=None; Secure`, a cookie set without `SameSite` specified (browser-dependent default behavior — discuss the shift to `Lax` as default in modern browsers).

### Q116
- **Difficulty:** Medium
- **Topic:** Cookies
- **Problem Statement:** Implement `getCookie(name)`, `setCookie(name, value, options)`, and `deleteCookie(name)` utilities using `document.cookie`, correctly handling URL-encoding of names/values (since cookie values can't contain certain characters like `;` directly), parsing the semicolon-and-space-delimited cookie string, and supporting options like `maxAge`, `path`, `domain`, `secure`, `sameSite`.
- **Expected Time Complexity:** O(c) for `getCookie` where c = total cookie string length (must parse all cookies to find one)
- **Expected Space Complexity:** O(c)
- **Hints:** `document.cookie` is a single string of `key=value; key2=value2` pairs — reading it gives ALL cookies for the domain/path; setting it only affects the ONE cookie specified (it's a special "magic" property, not a normal string property); use `encodeURIComponent`/`decodeURIComponent`.
- **Edge Cases:** A cookie value containing `=` (must not be split incorrectly — split only on the FIRST `=`), cookie name collisions across different `path`/`domain` combinations (both may appear in `document.cookie` with no way to distinguish them from JS — `getCookie` will return ambiguous results), deleting a cookie requires matching `path`/`domain` exactly (setting `Max-Age=0` with the WRONG path silently fails to delete it).

### Q117
- **Difficulty:** Staff
- **Topic:** Cookies
- **Problem Statement:** Design a client-side session management strategy for a banking-grade web application requiring: short-lived access tokens (15 min) stored in memory only (never persisted, to minimize XSS exposure window), refresh tokens in `HttpOnly`/`Secure`/`SameSite=Strict` cookies (inaccessible to JS), automatic silent token refresh before expiry, and "logout from all devices" support. Explain how the in-memory access token survives (or doesn't) a page reload, and design the "silent refresh on page load" flow that re-establishes the in-memory access token using the `HttpOnly` refresh cookie (which is automatically sent to a refresh endpoint).
- **Expected Time Complexity:** O(1) per refresh
- **Expected Space Complexity:** O(1)
- **Hints:** On page load, immediately call the refresh endpoint (the browser automatically sends the `HttpOnly` cookie) to obtain a new access token before the app renders protected content; schedule the next silent refresh via `setTimeout` based on the token's expiry time (refresh slightly before actual expiry).
- **Edge Cases:** User has multiple tabs open — each tab's in-memory access token is independent; if one tab refreshes, others don't automatically get the new token (until their own refresh timer fires or they make a request) — is this acceptable, or does it need cross-tab coordination (combine with Q107's `BroadcastChannel`)? "Logout from all devices" invalidates refresh tokens server-side — how does an already-open tab with a still-valid (but soon revoked) in-memory access token discover this before its next API call?

---

## SECTION 21: Debouncing (Q118–Q121)

### Q118
- **Difficulty:** Easy
- **Topic:** Debouncing
- **Problem Statement:** Implement `debounce(fn, delay)` from scratch: the returned function should only invoke `fn` after `delay` ms have passed since the LAST invocation of the returned function (resetting the timer on each call). Demonstrate its use for a search input's `onChange` handler.
- **Expected Time Complexity:** O(1) per call
- **Expected Space Complexity:** O(1)
- **Hints:** Store a single `timeoutId` in closure scope; `clearTimeout` it on each new call before setting a new `setTimeout`.
- **Edge Cases:** `delay = 0`, the debounced function being called with different `this` contexts or arguments across calls (only the LAST call's arguments/context should be used when `fn` finally executes), the component/page being unmounted/navigated away before the timer fires (memory leak / calling `fn` on a detached element — needs a `cancel` method).

### Q119
- **Difficulty:** Medium
- **Topic:** Debouncing
- **Problem Statement:** Extend your `debounce` implementation to support a `leading` option (invoke `fn` immediately on the FIRST call, then debounce subsequent calls) and a `trailing` option (default true — invoke after the delay following the last call), matching lodash's `debounce` semantics where `{ leading: true, trailing: true }` invokes both at the start AND end of a burst (if more than one call occurred). Also add a `cancel()` method to cancel any pending invocation, and a `flush()` method to invoke immediately if pending.
- **Expected Time Complexity:** O(1) per call
- **Expected Space Complexity:** O(1)
- **Hints:** Track `lastCallTime`, `lastInvokeTime`, and whether an invocation is "pending"; `{leading: true, trailing: false}` with calls spaced LESS than `delay` apart should invoke only once (at the start of the burst), not on every call.
- **Edge Cases:** `{leading: true, trailing: true}` with only a SINGLE call (should it invoke once or twice? — lodash invokes once for leading if trailing wouldn't add new information... actually verify: a single call with both true invokes on leading edge only, since there's no "more recent" call to justify a trailing invocation — research and confirm), `flush()` called when nothing is pending (no-op), `cancel()` called mid-delay then the function called again (should start fresh).

### Q120
- **Difficulty:** Hard
- **Topic:** Debouncing
- **Problem Statement:** Implement an `asyncDebounce(asyncFn, delay)` that debounces an async function such that: only the LAST call within a burst actually executes `asyncFn`, BUT all callers (including those whose calls were "absorbed" by debouncing) receive a promise that resolves with the result of that single execution (or rejects if it rejects) — i.e., debouncing for async functions must not leave earlier callers' promises permanently pending or resolve them with stale/wrong data.
- **Expected Time Complexity:** O(1) per call; one actual `asyncFn` execution per burst
- **Expected Space Complexity:** O(c) where c = number of callers waiting in the current burst (each holds a `{resolve, reject}` pair)
- **Hints:** Maintain an array of pending `{resolve, reject}` pairs; when the debounce timer fires, execute `asyncFn` once and resolve/reject ALL pending pairs with that single result.
- **Edge Cases:** A new call arrives WHILE `asyncFn` from the previous burst is still executing (should it start a new timer immediately, wait for the in-flight execution, or cancel it? — define and justify a specific behavior), `asyncFn` throws synchronously vs returns a rejected promise (both must reject all pending callers).

### Q121
- **Difficulty:** Staff
- **Topic:** Debouncing
- **Problem Statement:** A real-time collaborative text editor needs to send the document content to the server for autosave. Design the autosave strategy combining debouncing with a maximum wait time (e.g., "save 2 seconds after the user stops typing, but ALWAYS save at least every 10 seconds if they keep typing continuously" — this is the `maxWait` option in lodash's `debounce`). Implement `debounceWithMaxWait(fn, delay, maxWait)` and explain the relationship to throttling (is this effectively a hybrid of debounce and throttle? Justify).
- **Expected Time Complexity:** O(1) per call
- **Expected Space Complexity:** O(1)
- **Hints:** Track the time of the FIRST call in the current burst; if `now - firstCallTime >= maxWait`, invoke immediately (resetting the burst), regardless of the regular debounce timer.
- **Edge Cases:** `maxWait < delay` (the max-wait would trigger before the debounce delay ever could — should this be disallowed/clamped, or is it a valid configuration with specific semantics?), `maxWait` exactly equal to `delay`.

---

## SECTION 22: Throttling (Q122–Q125)

### Q122
- **Difficulty:** Easy
- **Topic:** Throttling
- **Problem Statement:** Implement `throttle(fn, limit)` from scratch: the returned function invokes `fn` at most once every `limit` ms, regardless of how many times it's called, using a simple "ignore calls during the cooldown" (leading-edge only) strategy. Demonstrate its use for a `scroll` event handler that updates a "scroll progress" indicator.
- **Expected Time Complexity:** O(1) per call
- **Expected Space Complexity:** O(1)
- **Hints:** Track a boolean `inThrottle` flag, set via `setTimeout` to reset after `limit` ms.
- **Edge Cases:** The LAST call in a rapid burst is dropped entirely with leading-edge-only throttling — is this acceptable for a scroll progress bar (the bar might not reach 100% until the next scroll event)? Discuss when trailing-edge execution matters.

### Q123
- **Difficulty:** Medium
- **Topic:** Throttling
- **Problem Statement:** Implement a throttle variant that supports both `leading` and `trailing` invocation (matching lodash's `throttle` with `{leading: true, trailing: true}` as default): the first call in a window executes immediately (leading), and if additional calls occur during the cooldown window, the LAST one executes at the end of the window (trailing) — ensuring the most recent arguments are eventually processed even if intermediate calls are throttled.
- **Expected Time Complexity:** O(1) per call
- **Expected Space Complexity:** O(1)
- **Hints:** On each call during cooldown, store the latest `args`/`this` and set a flag; when the cooldown timer fires, if a call occurred during cooldown, invoke `fn` with the stored latest args and restart the cooldown.
- **Edge Cases:** `{leading: false, trailing: true}` (the very first call should NOT execute immediately — only after the first `limit` ms, with the latest args at that point), only ONE call total (with `trailing: true` and `leading: true`, does it fire once or twice?).

### Q124
- **Difficulty:** Hard
- **Topic:** Throttling
- **Problem Statement:** Compare debounce and throttle precisely: for a `mousemove` handler that updates a tooltip's position to follow the cursor, explain why throttle (not debounce) is the correct choice, and what the user-visible difference would be if debounce were used instead (the tooltip would only "catch up" to the cursor after the user stops moving it). Implement `rafThrottle(fn)` — a throttle variant that limits invocations to once per animation frame using `requestAnimationFrame`, which is the idiomatic approach for visual updates tied to high-frequency events (`scroll`, `mousemove`, `resize`).
- **Expected Time Complexity:** O(1) per call; actual `fn` invocations bounded by display refresh rate (~60/sec)
- **Expected Space Complexity:** O(1)
- **Hints:** On each call, store the latest args and, if no `requestAnimationFrame` is already scheduled, schedule one; inside the rAF callback, invoke `fn` with the latest stored args and clear the "scheduled" flag.
- **Edge Cases:** The tab becomes inactive/backgrounded (rAF callbacks are throttled/paused by browsers in background tabs — does this cause a "burst" of stale updates when the tab regains focus, and how should that be handled?), `fn` itself being expensive enough to take longer than one frame (16ms) — does this cause frame drops, and is that the responsibility of `rafThrottle` or the caller?

### Q125
- **Difficulty:** Staff
- **Topic:** Throttling
- **Problem Statement:** Design a client-side rate limiter for outgoing API calls that enforces a global limit (e.g., "no more than 10 requests per second across the entire app, to respect a third-party API's rate limit") using a token-bucket algorithm. Implement `RateLimiter` with `acquire()` returning a promise that resolves when a token is available (queueing if not), `getAvailableTokens()`, and configurable `capacity` and `refillRatePerSecond`. Explain why a sliding-window or token-bucket approach is more appropriate than naive throttling for this use case, and how it handles bursty traffic (allowing a burst up to `capacity` after idle periods).
- **Expected Time Complexity:** O(1) per `acquire` call (amortized); O(q) to drain q queued requests when tokens refill
- **Expected Space Complexity:** O(q) for the queue
- **Hints:** Track `tokens` and `lastRefillTimestamp`; on each `acquire`, first refill based on elapsed time (`tokens = min(capacity, tokens + elapsed * refillRate)`), then either consume a token immediately or queue the request and set a timer for when the next token will be available.
- **Edge Cases:** `capacity = 0` (should never allow requests — or should it always queue indefinitely?), the queue growing unbounded under sustained overload (should there be a max queue size with rejection?), `refillRatePerSecond` of `0` (tokens never replenish — only the initial `capacity` requests ever succeed).

---

## SECTION 23: Memoization (Q126–Q130)

### Q126
- **Difficulty:** Easy
- **Topic:** Memoization
- **Problem Statement:** Explain memoization and its prerequisites (the function must be "pure" — same inputs always produce same outputs, no side effects that matter). Using your `memoize` from Q21 as a base, demonstrate memoizing a recursive naive Fibonacci function `fib(n)`, and show the dramatic complexity improvement from O(2^n) to O(n), explaining exactly why (each unique `n` is computed once).
- **Expected Time Complexity:** O(n) memoized vs O(2^n) naive
- **Expected Space Complexity:** O(n) for the cache (and call stack)
- **Hints:** The memoized recursive calls still happen, but cache hits short-circuit the exponential branching.
- **Edge Cases:** `fib(0)`, `fib(1)` (base cases — ensure they're cached too), very large `n` (e.g., `fib(1000)`) causing stack overflow due to recursion depth despite memoization — discuss converting to an iterative or trampoline-based approach.

### Q127
- **Difficulty:** Medium
- **Topic:** Memoization
- **Problem Statement:** Implement an LRU (Least Recently Used) cache `LRUCache<K, V>` with `get(key)` and `put(key, value)`, both O(1), evicting the least-recently-used entry when `capacity` is exceeded. Then implement `memoizeWithLRU(fn, capacity)` that uses this LRU cache to bound memory usage of memoization, unlike an unbounded `Map`-based cache (relevant to Q21's edge case about unbounded growth).
- **Expected Time Complexity:** O(1) for `get`/`put`
- **Expected Space Complexity:** O(capacity)
- **Hints:** Combine a `Map` (which maintains insertion order in JS — re-inserting a key after `delete` moves it to the end) with this property to implement LRU without a separate doubly-linked list: on `get`, delete and re-insert the key to mark it as "recently used."
- **Edge Cases:** `capacity = 0` (every `put` immediately evicts — does `get` ever return a hit?), updating the value of an EXISTING key (should it count as "used" and move to the end, and should it evict if at capacity — no, since the key count doesn't increase), `get` on a non-existent key.

### Q128
- **Difficulty:** Hard
- **Topic:** Memoization
- **Problem Statement:** Explain why memoizing functions with OBJECT or ARRAY arguments is problematic with naive `JSON.stringify`-based cache keys: (a) performance cost of serialization for large objects, (b) key collisions for objects with different key ORDER but same content (`JSON.stringify({a:1,b:2})` !== `JSON.stringify({b:2,a:1})`), (c) reference-identity vs deep-equality semantics. Implement a `memoizeWeak(fn)` that uses a `WeakMap`-based cache keyed by object REFERENCE (for single-object-argument functions), avoiding serialization entirely, and discuss its trade-offs vs value-based caching (cache misses for "equal" but distinct object instances).
- **Expected Time Complexity:** O(1) for `WeakMap` get/set
- **Expected Space Complexity:** O(n) for n distinct object references seen, but entries are garbage-collectable when the key object is no longer referenced elsewhere
- **Hints:** `WeakMap` keys must be objects (not primitives) — this naturally fits "memoize by reference" for object arguments; for multi-argument functions, you'd need nested `WeakMap`s or a different structure for primitive args mixed with object args.
- **Edge Cases:** The function is called with two structurally-identical but referentially-distinct objects (`{a:1}` twice, different instances) — `memoizeWeak` treats these as cache misses; is this the desired behavior for the use case (e.g., memoizing a function that processes a specific DOM node or component instance — where reference identity IS the correct semantic)?

### Q129
- **Difficulty:** Staff
- **Topic:** Memoization
- **Problem Statement:** Design a memoization strategy for a function `computeExpensiveLayout(items, containerWidth)` called on every render of a React-like component, where `items` is a large array that's recreated on every render (new array reference each time, even if contents are unchanged) due to how the parent component constructs props. Explain why reference-based memoization (`useMemo` with `items` as a dependency, or `WeakMap`-keyed memoization) fails here, and propose solutions: (a) memoizing further up the tree so `items` has a STABLE reference, (b) a custom memoization that does a SHALLOW or deep comparison of `items` instead of reference comparison, with the performance trade-offs of each, (c) using a library like `reselect`'s memoized selectors with custom equality functions.
- **Expected Time Complexity:** O(n) for shallow/deep comparison per call (only beneficial if cheaper than `computeExpensiveLayout` itself) vs O(1) reference comparison
- **Expected Space Complexity:** O(n) to retain the previous `items` array for comparison
- **Hints:** The fundamental tension: comparison cost vs computation cost — memoization with expensive comparisons is only worth it if `computeExpensiveLayout` is even MORE expensive; reference stabilization (fixing the root cause — why is `items` recreated?) is usually the better architectural fix.
- **Edge Cases:** `items` array has the same length and same element VALUES but different element REFERENCES (e.g., new object literals with same data) — does shallow comparison of the array (checking each element with `===`) catch this as "different," requiring deep comparison? What's the right call for THIS specific function (does `computeExpensiveLayout` care about object identity of items, or just their `width`/`height` properties)?

### Q130
- **Difficulty:** Staff
- **Topic:** Memoization
- **Problem Statement:** Implement a generic `memoizeAsync(asyncFn, options)` supporting: TTL-based expiration (cache entries expire after `options.ttl` ms), the "single-flight" pattern (concurrent calls with the same key while a request is in-flight share the promise — from Q24's `onceAsync` generalized to multiple keys), stale-while-revalidate (return expired-but-cached data immediately while refreshing in the background, per Q105), and a `invalidate(key)` method for manual cache busting. This should serve as the foundational caching primitive for the API client in Q112.
- **Expected Time Complexity:** O(1) for cache hits/misses (excluding key serialization and the async function's own complexity)
- **Expected Space Complexity:** O(k) where k = number of distinct cached keys, with TTL-based eventual cleanup
- **Hints:** Each cache entry stores `{ value, timestamp, promise }`; `promise` is cleared once settled but `value`/`timestamp` persist for TTL-based serving; for stale-while-revalidate, check `Date.now() - timestamp > ttl` to decide whether to trigger a background refresh while still returning `value`.
- **Edge Cases:** `invalidate(key)` called WHILE a request for that key is in-flight (should the in-flight promise still resolve and populate the cache, or should it be discarded?), TTL of `0` or `Infinity`, the async function rejecting (should rejections be cached too — and for how long, to avoid hammering a failing endpoint, vs always retrying immediately on next call?).

---
