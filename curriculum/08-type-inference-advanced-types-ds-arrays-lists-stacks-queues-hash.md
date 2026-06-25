## SECTION 39: Type Inference (Q231–Q234)

### Q231
- **Difficulty:** Medium
- **Topic:** Type Inference
- **Problem Statement:** Explain TypeScript's CONTEXTUAL TYPING — how TypeScript infers types from context WITHOUT explicit annotations. Demonstrate with: (1) an array literal `const arr = [1, 2, 3]` (inferred as `number[]`, not `(1 | 2 | 3)[]`), (2) a function assigned to a typed variable `const fn: (x: number) => string = x => x.toString()` (the arrow function's parameter `x` gets its type from context), (3) an object destructuring with expected type `function process({ name, age }: User)` (no annotation needed on `name`/`age`), and (4) `as const` for WIDENING PREVENTION — preventing TypeScript from widening literal types to their primitive base.
- **Expected Time Complexity:** O(1)
- **Expected Space Complexity:** O(1)
- **Hints:** Without `as const`, `const directions = ['north', 'south', 'east', 'west']` infers `string[]`; with `as const`, it infers `readonly ['north', 'south', 'east', 'west']` — a readonly tuple of string LITERALS, enabling e.g. `type Direction = typeof directions[number]` = `'north' | 'south' | 'east' | 'west'`.
- **Edge Cases:** `as const` applied to a NESTED object (all levels become `readonly`, and all string/number values become their literal types — a very specific and narrow type that may be TOO narrow for function parameters expecting the BASE type; explain when `as const` is helpful vs when it's too aggressive a narrowing for reusable code).

### Q232
- **Difficulty:** Hard
- **Topic:** Type Inference
- **Problem Statement:** Explain TypeScript's CONTROL FLOW ANALYSIS (CFA) — how the compiler narrows types based on conditions, assignments, and other constructs WITHIN a scope. Demonstrate narrowing via: `typeof`, `instanceof`, truthiness checks (`if (x)` narrows out `null | undefined | 0 | '' | false`), equality checks (`if (x === 'admin')` narrows to the `'admin'` literal), the `in` operator (`'name' in obj` narrows to types containing `name`), and assignment narrowing (after `x = getNumber()`, `x` is narrowed to `number` even if declared as `string | number`). Then explain a common PITFALL: a narrowed type WIDENING BACK after a function call — TypeScript conservatively assumes CALLED FUNCTIONS may have side effects that modify shared state, so narrowings don't persist across most function boundaries.
- **Expected Time Complexity:** O(1)
- **Expected Space Complexity:** O(1)
- **Hints:** The "control flow re-widening" pitfall: `if (x !== null) { someFunction(); console.log(x.toFixed()); }` — TypeScript may widen `x` back to `T | null` after `someFunction()` even if the narrowing before `someFunction()` was valid, because `someFunction` could potentially reassign `x` (if `x` is a captured variable); the fix is to store the narrowed value in a CONST before the function call.
- **Edge Cases:** CFA through LOOPS (TypeScript conservatively widens at loop entry points, since the loop may change variable values on subsequent iterations — `let x: string | null = null; while (cond) { x = getString(); use(x); }` — TypeScript STILL considers `x` as `string | null` at the top of the loop body on the SECOND iteration, even though `x = getString()` assigns a non-null value — discuss this conservative-but-correct approximation).

### Q233
- **Difficulty:** Hard
- **Topic:** Type Inference
- **Problem Statement:** Explain GENERIC TYPE ARGUMENT INFERENCE — how TypeScript infers generic type parameters WITHOUT explicit `<TypeArg>` annotations. Demonstrate: (1) `identity(42)` inferring `T = number`, (2) `zip([1, 2], ['a', 'b'])` inferring `A = number, B = string`, (3) INFERENCE FROM RETURN TYPE (less common — TypeScript primarily infers from argument types), and (4) cases where inference FAILS and explicit type args are needed — specifically when TypeScript infers `unknown` due to insufficient information (e.g., calling `createEmptyArray<T>()` with no argument means T cannot be inferred from context, so explicit `createEmptyArray<string>()` is required).
- **Expected Time Complexity:** O(1)
- **Expected Space Complexity:** O(1)
- **Hints:** TypeScript infers generic parameters by UNIFYING the types of arguments with the function's parameter types; when multiple inference candidates exist (e.g., a `T[]` parameter receiving `[1, 2, 'three']`), TypeScript uses the "best common type" algorithm — which may infer `(number | string)[]` or fail and default to `never[]` depending on configuration.
- **Edge Cases:** CONFLICTING inference candidates: `<T>(a: T, b: T) => ...` called with `(1, 'hello')` — TypeScript must find a single `T` that satisfies both `number` and `string`, which is `number | string`; discuss whether this is the DESIRED behavior or whether the developer actually intended a TYPE ERROR (they may have wanted `a` and `b` to be the SAME type, not compatible-or-widened types — use separate type parameters `<A, B>(a: A, b: B)` if they're intended to be independently typed, or use stricter constraints like `<T extends number>(a: T, b: T)` to prevent the implicit `string | number` widening).

### Q234
- **Difficulty:** Staff
- **Topic:** Type Inference
- **Problem Statement:** Design and implement a `createStore<State, Actions>` factory function for a minimal type-safe state management library where: the `State` type is inferred from the initial state object passed to `createStore`, `Actions` is a record of reducer functions `(state: State, payload: P) => State` for various action types, and the returned store's `dispatch(action, payload)` method is FULLY TYPE-SAFE — the `action` parameter is constrained to the keys of `Actions`, and the `payload` parameter type is inferred as the SECOND PARAMETER type of the corresponding action's reducer (each action can have a DIFFERENT payload type). The entire type relationship must be inferred from the arguments passed to `createStore` with NO explicit type annotations by the caller.
- **Expected Time Complexity:** O(1) per dispatch (for the type logic); actual state update O(1) per reducer call
- **Expected Space Complexity:** O(1) for the store plus O(s) for subscribers
- **Hints:** `type PayloadOf<Actions, K extends keyof Actions> = Actions[K] extends (state: any, payload: infer P) => any ? P : never`; `dispatch<K extends keyof Actions>(action: K, payload: PayloadOf<Actions, K>): void`; this maps each action name to its SPECIFIC payload type via indexed access and `infer`.
- **Edge Cases:** An action reducer with NO payload (`(state: State) => State`) — `PayloadOf` should return `never` for this case, and `dispatch` for this action should accept no `payload` argument (use overloads or make `payload` optional when `PayloadOf<Actions, K>` extends `never`), a subscriber listening to state changes (`store.subscribe(listener: (state: State) => void)`) where the callback's parameter type is inferred as the SPECIFIC `State` type (not `unknown`).

---

## SECTION 40: Advanced Types (Q235–Q240)

### Q235
- **Difficulty:** Hard
- **Topic:** Advanced Types
- **Problem Statement:** Implement `TupleKeys<T extends readonly unknown[]>` (a union of the valid NUMERIC INDICES of a tuple as string literals: `TupleKeys<[string, number, boolean]>` → `'0' | '1' | '2'`), `TupleLength<T extends readonly unknown[]>` (the LENGTH of a tuple as a numeric literal type: `TupleLength<[A, B, C]>` → `3`), and `TupleAt<T extends readonly unknown[], N extends number>` (element at index N: `TupleAt<[string, number], 1>` → `number`). Then combine them to implement `PrependToTuple<T extends readonly unknown[], V>` (adds an element to the FRONT of a tuple) and `ReverseTuple<T extends readonly unknown[]>` (reverses a tuple's element order — the type-level equivalent of `Array.prototype.reverse`).
- **Expected Time Complexity:** O(1) for `TupleKeys`/`TupleLength`/`TupleAt`; O(n) type instantiations for `PrependToTuple` and `ReverseTuple` where n = tuple length
- **Expected Space Complexity:** O(n) for the result tuple type
- **Hints:** `TupleLength<T> = T['length']`; `TupleAt<T, N> = T[N]`; `PrependToTuple<T, V> = [V, ...T]`; `ReverseTuple` requires a RECURSIVE type helper that prepends the last element of the remaining tuple to the result accumulator — use a helper with an accumulator parameter: `Reverse<T, Acc extends unknown[] = []>`.
- **Edge Cases:** `TupleAt<[], 0>` = `never`; `TupleAt<[string], 5>` = `undefined` (out-of-bounds tuple access returns `undefined` in TypeScript's type system); `ReverseTuple<[]>` = `[]`; TypeScript's depth limit for long tuples (the recursive `ReverseTuple` implementation starts hitting limits around 40-50 element tuples — discuss practical mitigations like increasing the limit with an accumulator, or simply acknowledging that tuples of this length are rare in real code).

### Q236
- **Difficulty:** Hard
- **Topic:** Advanced Types
- **Problem Statement:** Implement a type-level ARITHMETIC system: `Add<N1 extends number, N2 extends number>` and `Subtract<N1 extends number, N2 extends number>` for small non-negative integers, using TUPLE LENGTH as the numeric encoding (a number `N` is represented as a tuple of length `N`: `3` → `[any, any, any]`). Explain the ENCODING, implement `NumberToTuple<N>` (builds a tuple of length `N`) and `TupleToNumber<T>` (returns `T['length']`), then implement `Add` as "concatenate two tuples and take the length" and `Subtract` as "remove N elements from the front of a tuple and take the remaining length." Discuss the practical limit of this approach (TypeScript's tuple length / recursion depth limit means this ONLY works for small numbers — up to ~45 in typical TS configs) and where it's actually useful (type-level validation of numeric constraints, array index range checks, etc.).
- **Expected Time Complexity:** O(n) type instantiations where n = the larger number operand
- **Expected Space Complexity:** O(n) for intermediate tuple representations
- **Hints:** `type NumberToTuple<N extends number, T extends unknown[] = []> = T['length'] extends N ? T : NumberToTuple<N, [...T, unknown]>`; `type Add<A extends number, B extends number> = [...NumberToTuple<A>, ...NumberToTuple<B>]['length']`.
- **Edge Cases:** `Subtract<3, 5>` (would require a negative-length tuple — impossible; should return `never` or `0`), `Add<20, 30>` = `50` — works, but at N = 45+ TypeScript starts refusing with "type instantiation is excessively deep"; REAL-WORLD use: a `FixedArray<T, N extends number>` type that validates the tuple length at compile time.

### Q237
- **Difficulty:** Staff
- **Topic:** Advanced Types
- **Problem Statement:** Implement a type-level JSON schema validator: `Validate<Schema, Data>` where `Schema` is a JSON schema-like type descriptor (a plain TS type, not a string or runtime object) and `Data` is the data to validate against it. Implement schema primitives: `{ type: 'string' }`, `{ type: 'number' }`, `{ type: 'object', properties: {...} }`, `{ type: 'array', items: Schema }`, `{ type: 'union', variants: Schema[] }`. The result `Validate<Schema, Data>` is either `Data` (typed as the correctly inferred type) if valid, or a descriptive error string literal type indicating WHY validation failed (a "type error message" encoded as a string type). This is conceptually similar to what `zod`'s `z.infer<typeof schema>` achieves but implemented entirely within TypeScript's type system.
- **Expected Time Complexity:** O(1) — compile-time only (though complex schemas add compile-time cost)
- **Expected Space Complexity:** O(1)
- **Hints:** Each schema type maps to a TypeScript TYPE via conditional types: `Schema extends { type: 'string' } ? string : Schema extends { type: 'object', properties: infer P } ? { [K in keyof P]: Validate<P[K], ???> } : ...`; the "error as string type" pattern uses template literal types: `type Err = \`Expected string, got ${TypeName<Data>}\`` for human-readable compile-time error messages.
- **Edge Cases:** NESTED schemas (an object schema's property values are themselves schemas — requires recursion); UNION schemas where the data must match ONE of several variants (use a distributive conditional type over the `variants` tuple); what happens when `Data` itself is `unknown` or `any` (the type checker can't validate against these — discuss whether `Validate` should return the inferred type, `unknown`, or an error in these cases).

### Q238
- **Difficulty:** Staff
- **Topic:** Advanced Types
- **Problem Statement:** Explain TypeScript's `satisfies` operator (TS 4.9) and how it differs from type assertion (`as`) and explicit type annotation (`:`). Demonstrate: `const config = { port: 8080, host: 'localhost' } satisfies ServerConfig` — this validates that the expression satisfies `ServerConfig` at the annotation site (like `:`), BUT preserves the NARROW inferred type of the value (so `config.port` is `8080` the literal type, not `number` as declared in `ServerConfig`). Contrast with `: ServerConfig` annotation (widens to `ServerConfig`, losing literal types) and `as ServerConfig` (silences errors rather than checking). Show a practical use case: a color palette object where each key MUST be a valid CSS color string (validated by `satisfies`), but the KEYS themselves are preserved as string literal types for type-safe access.
- **Expected Time Complexity:** O(1)
- **Expected Space Complexity:** O(1)
- **Hints:** `satisfies T` = "check that this expression is assignable to T at this site, but infer the expression's ACTUAL type for downstream use, not T" — unlike `: T` which says "use T as THIS binding's type from here on."
- **Edge Cases:** `satisfies` combined with `as const`: `{ config } satisfies T` vs `{ config } as const satisfies T` — the latter FIRST applies `as const` narrowing (making all values their literal types) THEN validates against `T`, potentially being STRICTER than just `satisfies T` alone (since the narrowed literal types may be more specific than T's property types require — but assignability goes the RIGHT way: a more specific/narrow type IS assignable to a broader type, so this is fine).

### Q239
- **Difficulty:** Hard
- **Topic:** Advanced Types
- **Problem Statement:** Explain TypeScript's `unique symbol` type and its role in achieving NOMINAL TYPING for PRIMITIVE values (as opposed to the class-branding technique from Q197 for OBJECT types). Demonstrate: `declare const MyBrand: unique symbol; type BrandedString = string & { [MyBrand]: true }` — this creates a type that's structurally IDENTICAL to `string` except for a brand marker, meaning plain strings cannot be assigned to it without explicit casting (providing nominal-ish typing for primitives). Implement a `createBrand<T, Brand>()` helper that creates properly branded types for a `UserId` (a `string` brand) and `CentAmount` (a `number` brand, ensuring prices are never accidentally mixed with other numbers), and a `brand(value: T): BrandedType<T, Brand>` constructor that serves as the "entry point" for creating branded values at runtime.
- **Expected Time Complexity:** O(1)
- **Expected Space Complexity:** O(1)
- **Hints:** `type UserId = string & { readonly _brand: 'UserId' }` (using an object type with a never-truly-present `_brand` property as the distinguishing structural marker) is the simpler approach that doesn't require `unique symbol`; `unique symbol` provides a stronger guarantee that the brand token itself can't be forged by another file (since `unique symbol` types are unique per declaration site and can't be intersected from another module without the original symbol).
- **Edge Cases:** A branded `CentAmount` used in arithmetic (`amount + tax` where both are `CentAmount`) — TypeScript still allows arithmetic on `number`-based brands (since `number & brand` IS structurally a `number` and arithmetic operators accept `number`) but the RESULT is `number` (the brand is lost after arithmetic — this is intentional, since `price + tax` might semantically warrant a different brand than just `CentAmount` in a strongly-typed money system, requiring explicit re-branding after each meaningful operation).

### Q240
- **Difficulty:** Staff
- **Topic:** Advanced Types
- **Problem Statement:** Implement a type-safe `parseArgs<Schema extends ArgSchema>()` function for a command-line argument parser, where `ArgSchema` defines the expected flags and their types, and the RETURN TYPE is fully inferred: `parseArgs({ '--port': { type: 'number', required: true }, '--host': { type: 'string', default: 'localhost' }, '--verbose': { type: 'boolean', required: false } })` should return a type like `{ '--port': number, '--host': string, '--verbose': boolean | undefined }`, where required fields without defaults are `T` (not optional), optional fields with defaults are `T` (not optional, since the default fills them in), and optional fields without defaults are `T | undefined`. Implement both the TYPE INFERENCE and the RUNTIME implementation (actually parsing `process.argv`).
- **Expected Time Complexity:** O(a) where a = `process.argv.length`
- **Expected Space Complexity:** O(f) where f = number of defined flags
- **Hints:** The return type requires mapping over the schema: `{ [K in keyof Schema]: Schema[K] extends { type: 'number' } ? number : Schema[K] extends { type: 'string' } ? string : boolean }`, then separately determining optionality: keys where `required: true` or `'default' in Schema[K]` are required, others are `T | undefined`; implement as two SEPARATE mapped type steps joined with `&` or use complex conditional types in one pass.
- **Edge Cases:** A flag present MULTIPLE TIMES in `process.argv` (last-one-wins, first-one-wins, or array accumulation — define and implement one), a `--port` value that can't be parsed as a number (runtime validation error — but the TYPE says `number`; discuss where the gap between compile-time types and runtime reality must be bridged explicitly), `--` separator (conventional end-of-flags marker in CLI tools — should be handled).

---

## SECTION 41: Data Structures — Arrays & Linked Lists (Q241–Q252)

### Q241
- **Difficulty:** Easy
- **Topic:** Data Structures — Arrays
- **Problem Statement:** Implement in TypeScript: `twoSum(nums: number[], target: number): [number, number]` — given an array of integers, return the INDICES of the two numbers that add up to `target`. Assume exactly one solution exists.
- **Expected Time Complexity:** O(n) — use a hash map; O(n²) brute force is not acceptable
- **Expected Space Complexity:** O(n) for the hash map
- **Hints:** Use a `Map<number, number>` storing `value → index` as you iterate; for each element, check if `target - element` already exists in the map.
- **Edge Cases:** `nums` with duplicate values (e.g., `[3, 3]` with `target = 6` — the two INDICES should be `[0, 1]`, not the same index twice), negative numbers, `target = 0` with `[0, 0]`.

### Q242
- **Difficulty:** Medium
- **Topic:** Data Structures — Arrays
- **Problem Statement:** Implement `maxSubarraySum(nums: number[]): number` — Kadane's algorithm for finding the maximum sum contiguous subarray. Return both the maximum sum AND the start/end indices of the subarray: `{ sum: number, start: number, end: number }`.
- **Expected Time Complexity:** O(n)
- **Expected Space Complexity:** O(1)
- **Hints:** Track `currentSum` (reset to 0 when it goes negative — but actually, reset to the CURRENT element when `currentSum + nums[i]` < `nums[i]`); track the start index of the CURRENT running subarray and update it when resetting.
- **Edge Cases:** All-negative array (the maximum subarray is the SINGLE least-negative element — ensure the algorithm handles this by initializing correctly, NOT allowing `currentSum` to fall below the current element), empty array (discuss — return `{ sum: 0, start: -1, end: -1 }` or throw?), single-element array.

### Q243
- **Difficulty:** Hard
- **Topic:** Data Structures — Arrays
- **Problem Statement:** Implement `trappingRainWater(height: number[]): number` — given an array of non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining. Implement ALL THREE approaches: brute force O(n²), dynamic programming with prefix/suffix max arrays O(n) time O(n) space, and the TWO-POINTER approach O(n) time O(1) space, and explain the intuition behind each.
- **Expected Time Complexity:** O(n) for optimal; O(n²) for brute force
- **Expected Space Complexity:** O(1) for two-pointer
- **Hints:** Water above position `i` = `min(maxLeft[i], maxRight[i]) - height[i]`; the two-pointer approach moves the SHORTER side inward because we know water at that side is bounded by its own maximum (since the other side is taller).
- **Edge Cases:** Empty array, array with fewer than 3 elements (no trapping possible), array where all bars have the same height (no water trapped), a single valley vs complex multi-valley terrain.

### Q244
- **Difficulty:** Hard
- **Topic:** Data Structures — Arrays
- **Problem Statement:** Implement `rotateMatrix(matrix: number[][]): void` — rotate an n×n matrix 90 degrees clockwise IN-PLACE. Then implement both clockwise and counter-clockwise rotation. Discuss the mathematical relationship: 90° clockwise = transpose then reverse each row; 90° counter-clockwise = transpose then reverse each column (or equivalently, reverse each row then transpose).
- **Expected Time Complexity:** O(n²)
- **Expected Space Complexity:** O(1) — in-place
- **Hints:** Transpose: `matrix[i][j] ↔ matrix[j][i]`; then reverse each row for clockwise. These two operations together achieve the rotation without any extra matrix allocation.
- **Edge Cases:** 1×1 matrix (rotation is a no-op), non-square matrices (the standard in-place algorithm doesn't apply — discuss what changes: in-place is much harder for non-square; a new matrix is typically used), the relationship between 90° clockwise × 4 = identity (a useful correctness check).

### Q245
- **Difficulty:** Medium
- **Topic:** Data Structures — Arrays
- **Problem Statement:** Implement `productExceptSelf(nums: number[]): number[]` — return an array where each element is the product of all OTHER elements in the input array, WITHOUT using division and in O(n) time. Solve it with and without using extra O(n) space (the O(1) extra space variant uses the OUTPUT ARRAY itself plus two running product variables).
- **Expected Time Complexity:** O(n)
- **Expected Space Complexity:** O(1) extra (excluding output) for the optimal version
- **Hints:** Two passes: LEFT prefix products (fill output with `output[i] = product of all elements to the LEFT of i`) then RIGHT suffix products multiplied in place using a running `rightProduct` variable.
- **Edge Cases:** Array containing ZERO: if exactly one zero, the product for NON-ZERO positions is 0 (since all-others-product includes that zero), and the product for the ZERO position is the product of all non-zero elements; if two or more zeros, ALL positions get 0. This can be computed with the general algorithm without special-casing, but verify.

### Q246
- **Difficulty:** Staff
- **Topic:** Data Structures — Arrays
- **Problem Statement:** Implement a fully-typed TypeScript class `SortedArray<T>` that maintains elements in sorted order using a binary search for O(log n) lookups and O(n) insertion (maintaining sort). Include: `insert(item: T): void`, `remove(item: T): boolean`, `contains(item: T): boolean`, `rangeQuery(low: T, high: T): T[]`, and `kthSmallest(k: number): T`. The comparison function should be injectable via the constructor for genericity. Then discuss: when is a sorted array preferable to a binary search tree (BST) for maintaining sorted order (cache locality, sequential access patterns, lower memory overhead), and when is a BST preferable (more frequent insertions/deletions — O(log n) vs O(n))?
- **Expected Time Complexity:** O(log n) for `contains`/`kthSmallest`; O(n) for `insert`/`remove` (due to shifting); O(k + log n) for `rangeQuery` where k = results
- **Expected Space Complexity:** O(n)
- **Hints:** Binary search for the insertion point in `insert` reduces the SEARCH phase to O(log n) but the SHIFT phase remains O(n); `rangeQuery` finds the start index via binary search then linearly collects until exceeding `high` — very cache-friendly due to contiguous memory layout.
- **Edge Cases:** Duplicate elements: should `SortedArray` allow duplicates or enforce uniqueness? Make it configurable and document the behavior of each method under both modes; `kthSmallest` with k out of bounds (throw or return `undefined`?), `rangeQuery` where `low > high` (return `[]` or throw?).

### Q247
- **Difficulty:** Easy
- **Topic:** Data Structures — Linked Lists
- **Problem Statement:** Implement a singly-linked list `LinkedList<T>` in TypeScript with `append(value: T)`, `prepend(value: T)`, `delete(value: T): boolean`, `find(value: T): ListNode<T> | null`, `toArray(): T[]`, and `reverse(): void` (in-place). Include proper TypeScript types for `ListNode<T> = { value: T, next: ListNode<T> | null }`.
- **Expected Time Complexity:** O(1) for `prepend`; O(n) for `append`/`delete`/`find`/`toArray`/`reverse`
- **Expected Space Complexity:** O(1) for in-place operations; O(n) for `toArray`
- **Hints:** For `reverse`: track `prev`, `current`, and `next` pointers — iterate forward, rewiring each `current.next` to point to `prev`, then advancing all three pointers.
- **Edge Cases:** Deleting the HEAD node (must update `this.head`), deleting a node that doesn't exist (return `false`), reversing an empty list or single-element list (no-op), `find` on an empty list.

### Q248
- **Difficulty:** Medium
- **Topic:** Data Structures — Linked Lists
- **Problem Statement:** Implement a doubly-linked list `DoublyLinkedList<T>` supporting O(1) insertion at both ends (head and tail), O(1) deletion GIVEN A NODE REFERENCE (the advantage over singly-linked), and standard iteration. Use it to implement an LRU (Least Recently Used) cache `LRUCache<K, V>` with O(1) `get` and `put` (combining a `Map<K, DLLNode>` for O(1) lookups with the doubly-linked list for O(1) eviction order maintenance — the "move accessed node to head" operation requires O(1) node deletion + O(1) head insertion = O(1) overall with a doubly-linked list).
- **Expected Time Complexity:** O(1) for `get`/`put` (amortized)
- **Expected Space Complexity:** O(capacity)
- **Hints:** Use sentinel (dummy) head and tail nodes to avoid edge-case handling for empty-list operations and head/tail node deletion — all insertions go "after head sentinel" and all deletions near "before tail sentinel" for the LRU eviction.
- **Edge Cases:** `capacity = 1` (every `put` evicts the previous entry unless it's the same key), `get` on a key that doesn't exist (return `undefined`/`-1`), `put` of a key that ALREADY EXISTS (update value + move to front — must not increase size), accessing the SAME key multiple times between other accesses (each access moves it to "most recently used" position).

### Q249
- **Difficulty:** Hard
- **Topic:** Data Structures — Linked Lists
- **Problem Statement:** Implement Floyd's cycle detection algorithm (`detectCycle(head: ListNode<T>): ListNode<T> | null`) — given a linked list that may contain a cycle, return the NODE at which the cycle begins (or `null` if no cycle). Explain MATHEMATICALLY why, after the slow and fast pointers meet, moving one pointer back to the HEAD and advancing both at SPEED 1 causes them to meet EXACTLY at the cycle's entry point.
- **Expected Time Complexity:** O(n)
- **Expected Space Complexity:** O(1)
- **Hints:** Phase 1: slow advances 1 step, fast advances 2 — they meet after F + C - F steps (where F = steps to cycle entry, C = cycle length) at a point `C - F` steps before the cycle entry going forward. Phase 2: moving head pointer forward F steps while cycling pointer also advances F steps (within the cycle) brings both to the cycle entry.
- **Edge Cases:** No cycle (fast pointer reaches `null` — return `null`), a cycle at the HEAD (the entire list is a cycle — both slow and fast start already "in" the cycle from step 0), a single-node self-loop (`node.next = node`).

### Q250
- **Difficulty:** Hard
- **Topic:** Data Structures — Linked Lists
- **Problem Statement:** Implement `mergeSortedLists<T>(lists: LinkedList<T>[], compareFn: (a: T, b: T) => number): LinkedList<T>` — merge K sorted linked lists into a single sorted linked list. Implement using a MIN-HEAP approach (comparing the HEAD of each list to always extract the globally minimum next node in O(log K) per extraction) rather than the naive K-way merge that would be O(n × K) per element.
- **Expected Time Complexity:** O(n log k) where n = total nodes, k = number of lists
- **Expected Space Complexity:** O(k) for the heap
- **Hints:** Since JS/TS has no built-in heap, implement a min-heap as part of this solution (or use a `SortedArray` from Q246 as a sorted queue for simplicity, noting its O(k) insertion vs O(log k) for a true heap); initialize the heap with the head node of EACH non-empty list; on each extraction, push the extracted node's `.next` (if not null) into the heap.
- **Edge Cases:** Some lists being empty (skip/ignore them during initialization), all lists empty (return an empty result list), a single list (trivially returned as-is with no merging needed), all lists having length 1 (reduces to finding the minimum of k elements k times).

### Q251
- **Difficulty:** Medium
- **Topic:** Data Structures — Linked Lists
- **Problem Statement:** Implement `palindromeCheck(head: ListNode<number>): boolean` — determine if a singly-linked list forms a palindrome in O(n) time and O(1) space. The approach: (1) find the middle using slow/fast pointers, (2) reverse the SECOND half of the list in-place, (3) compare first and second halves node by node, (4) RESTORE the list to its original structure before returning (a good interview detail showing consideration for the caller).
- **Expected Time Complexity:** O(n)
- **Expected Space Complexity:** O(1)
- **Hints:** For an EVEN-length list (e.g., 4 nodes), the slow pointer should land on the second of the two middle nodes after `ceil(n/2)` steps; for ODD-length, the middle node has no pair and can be skipped.
- **Edge Cases:** A single-node list (palindrome — trivially yes), a two-node list (palindrome if and only if both values are equal), all elements equal (always a palindrome), the RESTORATION step — ensure the second half is re-reversed back before returning so the list is not left in a mutated state.

### Q252
- **Difficulty:** Staff
- **Topic:** Data Structures — Linked Lists
- **Problem Statement:** Implement a SKIP LIST `SkipList<K, V>` in TypeScript — a probabilistic data structure providing expected O(log n) search, insertion, and deletion (like a BST but using LAYERED linked lists for efficient search). Implement `search(key: K): V | null`, `insert(key: K, value: V): void`, and `delete(key: K): boolean`. Each node has multiple "forward" pointers at different levels; insertion randomly determines a node's height (with probability 1/2 per additional level). Explain how the probabilistic height distribution achieves expected O(log n) performance without guaranteed worst-case O(log n) (unlike AVL/red-black trees), and when a skip list's practical performance and implementation simplicity might make it preferable to a balanced BST.
- **Expected Time Complexity:** O(log n) expected for all operations; O(n) worst case (with low probability for random heights)
- **Expected Space Complexity:** O(n log n) expected for forward pointers (each node has O(log n) expected forward pointers)
- **Hints:** Use a sentinel header node at maximum level; during search, iterate from the HIGHEST level down, advancing forward at each level as long as the next node's key is less than the target; during insertion, track the "update" array of nodes that need their forward pointers updated at each level where the new node is inserted.
- **Edge Cases:** The randomly determined height exceeding the current maximum level of the list (must increase the list's max level — update the header's forward pointers accordingly), deleting the ONLY element in the list, `search`/`delete` for a key that doesn't exist.

---

## SECTION 42: Stacks & Queues (Q253–Q257)

### Q253
- **Difficulty:** Easy
- **Topic:** Data Structures — Stacks
- **Problem Statement:** Implement a generic `Stack<T>` in TypeScript backed by an array with `push(item: T)`, `pop(): T | undefined`, `peek(): T | undefined`, `isEmpty(): boolean`, and `size(): number`. Then use it to solve: `isValidParentheses(s: string): boolean` — given a string containing `(`, `)`, `{`, `}`, `[`, `]`, determine if the brackets are valid (correctly opened and closed in order).
- **Expected Time Complexity:** O(n) for `isValidParentheses`
- **Expected Space Complexity:** O(n) for the stack
- **Hints:** Push opening brackets; when a closing bracket is encountered, pop and check it matches the corresponding opener; if the stack is empty when we need to pop, or non-empty when the string ends, it's invalid.
- **Edge Cases:** Empty string (valid — `true`), string with ONLY opening brackets, string starting with a closing bracket (immediately invalid), interleaved different bracket types that are individually valid but mutually incorrect (e.g., `([)]`).

### Q254
- **Difficulty:** Medium
- **Topic:** Data Structures — Stacks
- **Problem Statement:** Implement `MinStack` — a stack that supports `push(val: number)`, `pop()`, `top()`, and `getMin()` ALL in O(1) time. Implement TWO approaches: (a) using a second "min-tracking" stack in parallel (for clarity), and (b) using a single stack by storing PAIRS `[value, currentMin]` at each level. Then solve the NEXT GREATER ELEMENT problem: given an array, find for each element the next element to its RIGHT that is GREATER, using a MONOTONIC STACK approach (O(n) time, O(n) space).
- **Expected Time Complexity:** O(1) for all `MinStack` operations; O(n) for next greater element
- **Expected Space Complexity:** O(n) for both
- **Hints:** For `MinStack`: when pushing onto the min-stack, only push if the new value ≤ current min (approach a) — pop from min-stack only when the main stack's popped value equals the current min; for the monotonic stack: iterate RIGHT to LEFT, maintaining a stack of elements that haven't yet found a "greater right neighbor" — for each element, pop all SMALLER elements from the stack (they found their answer: the current element), then push the current element.
- **Edge Cases:** `MinStack` with all elements the same value (the min-stack must push every value, or use a count — consider which variant handles all duplicates correctly), popping from an empty stack, `nextGreaterElement` for the rightmost element(s) that have no greater element to their right (output `-1` or `null`).

### Q255
- **Difficulty:** Medium
- **Topic:** Data Structures — Queues
- **Problem Statement:** Implement a generic `Queue<T>` with O(1) `enqueue`/`dequeue` using a DOUBLY-LINKED LIST (avoiding O(n) array-shift overhead). Then implement `QueueFromStacks<T>` — a queue built from TWO stacks with AMORTIZED O(1) `enqueue` and `dequeue` (the classic "two-stack queue" interview problem). Explain the amortized analysis: each element is pushed and popped at most twice total across both stacks.
- **Expected Time Complexity:** O(1) amortized for `enqueue`/`dequeue`; O(1) worst-case with doubly-linked list
- **Expected Space Complexity:** O(n)
- **Hints:** For `QueueFromStacks`: `enqueue` always pushes onto stack1; `dequeue` pops from stack2 if non-empty, otherwise moves ALL elements from stack1 to stack2 (reversing order) then pops from stack2; moving ALL at once (not one at a time) is what achieves amortized O(1).
- **Edge Cases:** `dequeue` when BOTH stacks are empty (return `undefined` or throw), calling `dequeue` repeatedly with interleaved `enqueue` calls (ensure elements come out in FIFO order despite the two-stack mechanism — write a trace through a specific example to verify).

### Q256
- **Difficulty:** Hard
- **Topic:** Data Structures — Queues
- **Problem Statement:** Implement a DEQUE (Double-Ended Queue) `Deque<T>` supporting O(1) `pushFront`, `pushBack`, `popFront`, `popBack`, `peekFront`, `peekBack`. Then use it to solve the SLIDING WINDOW MAXIMUM problem: given an array and window size `k`, return the maximum element in each sliding window position — the classic O(n) solution using a MONOTONIC DEQUE (maintaining indices of useful candidates for the maximum in decreasing order).
- **Expected Time Complexity:** O(n) for sliding window maximum
- **Expected Space Complexity:** O(k) for the deque
- **Hints:** The deque stores INDICES (not values); when adding index `i`, pop from the BACK any indices whose VALUES are ≤ `nums[i]` (they can never be the maximum while `i` is in the window); pop from the FRONT if the FRONT index is outside the current window `[i-k+1, i]`; the front of the deque is always the index of the current window's maximum.
- **Edge Cases:** `k = 1` (each window is a single element — trivially equal to that element), `k = nums.length` (single window spanning the entire array), elements with EQUAL values at window edges (the deque should handle equal values correctly — pop back elements strictly LESS than current, or ≤ — explain the choice and its effect on index tracking).

### Q257
- **Difficulty:** Staff
- **Topic:** Data Structures — Stacks & Queues
- **Problem Statement:** Design and implement a THREAD-SAFE (conceptually, since JS is single-threaded but using Web Workers introduces actual concurrency via `SharedArrayBuffer` and `Atomics`) bounded blocking queue `SharedQueue<T>` using `SharedArrayBuffer` and `Atomics.wait`/`Atomics.notify` for inter-worker communication. The queue should have a fixed capacity, block (via `Atomics.wait`) when full (`enqueue`) or empty (`dequeue`), and be safe for concurrent access from multiple worker threads. Explain the memory layout in the `SharedArrayBuffer` (head index, tail index, count, and the data region), and why all operations on the shared indices must use atomic operations to prevent race conditions even in the absence of traditional locks.
- **Expected Time Complexity:** O(1) per enqueue/dequeue (excluding blocking wait time)
- **Expected Space Complexity:** O(capacity) for the SharedArrayBuffer
- **Hints:** Use `Atomics.compareExchange` for lock-free head/tail advancement; `Atomics.wait` blocks the worker thread until notified (only works in Workers, NOT the main thread — the main thread can't block); `Atomics.notify` wakes blocked waiters after a slot becomes available or an item is added.
- **Edge Cases:** Serialization of arbitrary TypeScript values into the `SharedArrayBuffer` (only typed-array data fits directly; need JSON serialization to `SharedArrayBuffer` via `TextEncoder` or a more complex protocol for structured data), a worker terminating while blocked on `Atomics.wait` (other workers should not deadlock waiting for the terminated worker to "consume" its slot).

---

## SECTION 43: Hash Tables (Q258–Q262)

### Q258
- **Difficulty:** Medium
- **Topic:** Data Structures — Hash Tables
- **Problem Statement:** Implement a hash table `HashMap<K extends string | number, V>` from scratch in TypeScript with `get(key: K): V | undefined`, `set(key: K, value: V): void`, `delete(key: K): boolean`, `has(key: K): boolean`, using SEPARATE CHAINING for collision resolution. Include a `loadFactor()` method and automatic RESIZING (doubling capacity and rehashing all entries) when `loadFactor > 0.75`. Implement a simple string hash function (`djb2` or similar).
- **Expected Time Complexity:** O(1) amortized for all operations (O(n) for resize, but amortized over n insertions = O(1) amortized per insertion)
- **Expected Space Complexity:** O(n) where n = number of stored entries
- **Hints:** Each bucket is an array (chain) of `[key, value]` pairs; on resize, create a new backing array of double the size and re-hash ALL existing entries into it; the hash function maps keys to bucket indices in `[0, capacity)`.
- **Edge Cases:** Hash collisions (multiple keys hashing to the same bucket — chaining handles this correctly); resizing triggered MID-ITERATION (should be safe since resize is triggered by set, and iteration is not concurrent in single-threaded JS); integer keys (hash function for numbers vs strings).

### Q259
- **Difficulty:** Medium
- **Topic:** Data Structures — Hash Tables
- **Problem Statement:** Solve THREE classic hash-table-based interview problems in TypeScript: (1) `groupAnagrams(strs: string[]): string[][]` — group strings that are anagrams of each other, (2) `longestConsecutiveSequence(nums: number[]): number` — find the length of the longest consecutive elements sequence in O(n) time, (3) `fourSum(nums: number[], target: number): number[][]` — find all unique quadruplets summing to target (reducing to two-sum with a hash map for the last two elements). For each, explicitly justify the data structure choice and analyze the complexity.
- **Expected Time Complexity:** O(n log n) for groupAnagrams (sorting each string is O(m log m)); O(n) for longestConsecutive; O(n²) for fourSum
- **Expected Space Complexity:** O(n) for all three
- **Hints:** `groupAnagrams`: key = sorted string (`[...s].sort().join('')`); `longestConsecutive`: build a `Set`, then for each number, only start a "count chain" if `num - 1` is NOT in the set (to avoid restarting chains from the middle); `fourSum`: reduce to 3-sum then 2-sum, with hash map for the final two-element lookup.
- **Edge Cases:** `groupAnagrams` with empty strings (all empty strings are anagrams of each other — they all sort to `''`), `longestConsecutive` with all-duplicate numbers (`[1, 1, 1]` → sequence of length 1, not 3), `fourSum` with duplicates in input and requiring UNIQUE quadruplets.

### Q260
- **Difficulty:** Hard
- **Topic:** Data Structures — Hash Tables
- **Problem Statement:** Implement `topKFrequent(nums: number[], k: number): number[]` in O(n) time (NOT O(n log n)) using BUCKET SORT: since frequencies range from 1 to n (where n = array length), create n+1 buckets indexed by frequency, then scan from highest frequency to lowest collecting the top K elements.
- **Expected Time Complexity:** O(n) — bucket sort by frequency avoids the O(n log n) of a heap or comparison sort
- **Expected Space Complexity:** O(n) for frequency map + buckets
- **Hints:** First pass: `Map<number, number>` of frequencies; second pass: `Array<number[]>` of length `n+1` where `buckets[freq]` contains all numbers appearing exactly `freq` times; third pass: iterate `buckets` from index `n` down to 1, collecting results until K elements gathered.
- **Edge Cases:** Multiple numbers tied for K-th highest frequency (collect ALL or just `k` — the problem typically asks for EXACTLY k elements; if there are ties at position k, any valid subset of k is acceptable — document your choice), `k = nums.length` (return all elements sorted by frequency descending, or just all elements in any order if all have the same frequency).

### Q261
- **Difficulty:** Hard
- **Topic:** Data Structures — Hash Tables
- **Problem Statement:** Implement `findDuplicateSubtrees(root: TreeNode | null): TreeNode[]` — given a binary tree, return all duplicate subtrees. Two trees are duplicates if they have the same structure and the same node values. Use a SERIALIZATION + HASH MAP approach: recursively serialize each subtree to a string, use a `Map<string, [TreeNode, count]>` to detect duplicates, and return each duplicate root exactly ONCE (not multiple copies of the same duplicate).
- **Expected Time Complexity:** O(n²) for string serialization + map operations (each serialization is O(n) in the worst case due to string building, done n times); can be improved to O(n) with integer-encoded subtree IDs via a separate "canonical form" map
- **Expected Space Complexity:** O(n²) for all serialized strings; O(n) with integer encoding
- **Hints:** Post-order traversal; serialize as `"${leftSerial},${rightSerial},${val}"`; a count of 1 means first seen (store the node but don't add to result yet); a count of 2 means first DUPLICATE (add to result); count > 2 means already added to result (skip to avoid multiple copies of the same duplicate in the output).
- **Edge Cases:** Null subtrees must be serialized consistently (e.g., as `"#"`) so that leaf nodes serialize distinctly from nodes with children; a tree where EVERY node is a duplicate of every other (maximally duplicate), `null` root (return `[]`).

### Q262
- **Difficulty:** Staff
- **Topic:** Data Structures — Hash Tables
- **Problem Statement:** Design and implement a COUNT-MIN SKETCH in TypeScript — a probabilistic data structure for approximate frequency counting of stream elements using sub-linear space (supporting `add(item: string): void` and `estimate(item: string): number` where the estimate is guaranteed to NEVER UNDERESTIMATE the true frequency but may OVERESTIMATE by at most `epsilon × n` with probability at least `1 - delta` for configurable `epsilon` and `delta`). Use `width = ceil(e / epsilon)` and `depth = ceil(ln(1 / delta))` as dimensions for the count matrix, with `depth` independent hash functions (can be simulated from 2 or 4 universal hash functions via linear combination). Explain the error guarantees and why this is useful for tracking "heavy hitter" frequencies in streaming data (e.g., most common search queries in a web server's log stream) when the data volume precludes storing exact counts for every distinct item.
- **Expected Time Complexity:** O(depth) = O(log(1/delta)) per `add`/`estimate` — effectively O(1) for fixed parameters
- **Expected Space Complexity:** O(width × depth) = O((e/epsilon) × ln(1/delta)) — sub-linear in the stream length
- **Hints:** Each `add(item)` increments the count at `(h_i(item) % width)` for each of the `depth` hash rows; `estimate(item)` returns the MINIMUM across all rows (since hash collisions can only ADD to a cell's count, never remove — so the minimum is the least-overestimated value across all rows).
- **Edge Cases:** All items being the same (every cell in one hash column gets all the increments — the estimate for that item is exactly the true count, since no collisions occur within a SINGLE row for a single item, and with `depth > 1` hash functions, the MINIMUM is still exact); hash function quality (poor hash functions with many systematic collisions degrade accuracy beyond theoretical guarantees — discuss the theoretical requirement for pairwise independence and a practical implementation using MurmurHash or CRC32-based pseudo-random families).

---
