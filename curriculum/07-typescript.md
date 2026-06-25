## SECTION 33: TypeScript Basics (Q197–Q205)

### Q197
- **Difficulty:** Easy
- **Topic:** TypeScript Basics
- **Problem Statement:** Explain the difference between TypeScript's structural typing (duck typing) and nominal typing. Given two classes `class Dog { bark() {} }` and `class Cat { bark() {} }`, explain why TypeScript considers them COMPATIBLE (a `Cat` can be assigned to a variable of type `Dog`) even though they are semantically different animal types, and discuss when this causes real bugs. Show how to implement NOMINAL-style typing in TypeScript using a "brand" technique (adding a private nominal field like `private _brand: 'Dog'`).
- **Expected Time Complexity:** O(1)
- **Expected Space Complexity:** O(1)
- **Hints:** Structural typing checks SHAPE (does the value have the required properties/methods?) not IDENTITY (is it literally an instance of this class?); the brand technique adds a phantom property that only the intended class has, forcing the structural check to distinguish them.
- **Edge Cases:** The brand field approach at RUNTIME (the field doesn't actually exist in emitted JS — it's purely a compile-time fiction) — explain that branding is a PURELY STATIC type-level trick with NO runtime overhead or guarantees; a value could be fraudulently cast via `as Dog` to bypass the brand check, making it a lint/compiler aid rather than a true runtime safeguard.

### Q198
- **Difficulty:** Easy
- **Topic:** TypeScript Basics
- **Problem Statement:** Explain TypeScript's `any`, `unknown`, `never`, and `void` types — the four "special" types — and when to use each. Specifically: why `unknown` is the SAFE alternative to `any` (requires a type-guard before use, unlike `any` which bypasses all checks), why `never` represents the type of values that can NEVER exist (bottom type — the return type of functions that always throw or have infinite loops, and the result of narrowing a union to exhaustion), and why `void` ≠ `undefined` (a function returning `void` CAN return `undefined` at runtime, but `void` signals "callers should NOT use the return value").
- **Expected Time Complexity:** O(1)
- **Expected Space Complexity:** O(1)
- **Hints:** `unknown` is the type-safe "I don't know yet" type; `never` is the "this is impossible" type; `any` is the "TypeScript please just trust me" escape hatch (avoid); `void` is a "don't rely on this return value" signaling type used on function return positions.
- **Edge Cases:** `never` in union types: `string | never` simplifies to `string` (since `never` contributes no values); `never` in intersection types: `string & never` = `never` (an impossible type — no value is both a string AND impossible); a function that MAY throw (but doesn't always) still has a `void`/normal return type, NOT `never` — `never` requires the function to ALWAYS throw or NEVER return.

### Q199
- **Difficulty:** Medium
- **Topic:** TypeScript Basics
- **Problem Statement:** Implement a type-safe `EventEmitter` class in TypeScript where the event names and their payload types are defined via a generic type map, e.g., `EventEmitter<{ 'user:login': { userId: string }, 'data:loaded': number[] }>`, and `on(event, handler)` and `emit(event, payload)` are FULLY TYPE-SAFE: calling `emit('user:login', { userId: 42 })` should be a COMPILE-TIME error (wrong type for `userId`), and the handler in `on('data:loaded', (payload) => ...)` should have `payload` inferred as `number[]` WITHOUT any explicit annotation.
- **Expected Time Complexity:** O(1) per emit; O(h) per event where h = handlers
- **Expected Space Complexity:** O(e * h) for e event types, h handlers each
- **Hints:** Use a generic parameter `T extends Record<string, unknown>` for the event map; `on<K extends keyof T>(event: K, handler: (payload: T[K]) => void)` and `emit<K extends keyof T>(event: K, payload: T[K])`.
- **Edge Cases:** An event type with NO payload (e.g., `'app:ready': void`) — `emit('app:ready')` should be callable WITHOUT a second argument; use overloads or conditional types to make the payload parameter optional when the type is `void`.

### Q200
- **Difficulty:** Medium
- **Topic:** TypeScript Basics
- **Problem Statement:** Explain TypeScript's type assertion (`as`) vs type narrowing via guards. Given a function that accepts `value: unknown`, write FIVE different type guards to safely narrow it: (1) `typeof` check (primitives), (2) `instanceof` check (class instances), (3) a custom user-defined type guard function `isUser(v): v is User`, (4) an assertion function `assertIsString(v): asserts v is string` that throws if the type doesn't match (vs merely returning false like a type guard), and (5) the `satisfies` operator (TS 4.9) for validating an expression matches a type WITHOUT widening it.
- **Expected Time Complexity:** O(1)
- **Expected Space Complexity:** O(1)
- **Hints:** User-defined type guards (`v is Type`) narrow the type in subsequent code IF the function returns `true` — the return type IS the guard itself; `asserts v is Type` narrows after the function call in the calling scope (the call itself is the "assertion," throwing if false rather than returning boolean).
- **Edge Cases:** A custom type guard that INCORRECTLY claims `v is User` when it's not (TypeScript trusts the developer — there's no runtime enforcement of the `is` annotation beyond what the function body actually checks, making wrong type guards a source of bugs that TypeScript can't protect against).

### Q201
- **Difficulty:** Hard
- **Topic:** TypeScript Basics
- **Problem Statement:** Explain and demonstrate TypeScript's DISCRIMINATED UNIONS (also called "tagged unions" or "algebraic data types"): a union of object types each with a SHARED LITERAL-TYPE "discriminant" field (e.g., `type Shape = { kind: 'circle', radius: number } | { kind: 'rect', width: number, height: number }`). Show how `switch` on the discriminant enables EXHAUSTIVE type narrowing with NO explicit casts, and implement an `area(shape: Shape)` function that TypeScript guarantees handles all cases. Then demonstrate the exhaustiveness check using a `never`-typed `default` case that produces a compile-time error if a new variant is added to `Shape` without updating `area`.
- **Expected Time Complexity:** O(1)
- **Expected Space Complexity:** O(1)
- **Hints:** `default: const _exhaustive: never = shape; throw new Error(...)` — assigning `shape` to `never` fails at COMPILE TIME if TypeScript has NOT narrowed `shape` to `never` by the `default` branch (which means some variant wasn't handled above).
- **Edge Cases:** A union with TWO variants that share the SAME discriminant literal value (a type-level bug — TypeScript will catch this as the type being `never` for that branch, since no value can simultaneously satisfy both types' other properties while having the same `kind`), a discriminated union used as a function PARAMETER vs RETURN TYPE (both work, but exhaustiveness checking is most valuable for function bodies processing discriminated union inputs).

### Q202
- **Difficulty:** Hard
- **Topic:** TypeScript Basics
- **Problem Statement:** Explain TypeScript's `interface` vs `type` alias: their similarities (both describe object shapes, can be used interchangeably in many cases) and key differences: (1) DECLARATION MERGING — `interface` can be declared multiple times and they merge (useful for extending third-party types); `type` aliases CANNOT be merged, (2) EXTENDING — `interface extends` vs `type &` intersection (both achieve composition but with subtle differences when conflicts arise — `interface` errors on incompatible member types, `&` intersection creates an impossible/`never` type for conflicting properties), (3) MAPPED TYPES/CONDITIONAL TYPES can only use `type` aliases, not `interface`, (4) computed/complex types REQUIRE `type`. Give a concrete use case where EACH is the definitively correct choice over the other.
- **Expected Time Complexity:** O(1)
- **Expected Space Complexity:** O(1)
- **Hints:** Prefer `interface` for PUBLIC API definitions of library code (declaration merging allows consumers to extend/augment), and `type` for complex computed/derived types and unions. In application code, either works and team consistency often matters more than the specific choice.
- **Edge Cases:** An `interface` extended by another `interface` where the child tries to NARROW a property type (e.g., parent has `value: string | number`, child tries `value: string`) — TypeScript ERRORS on this with `interface`, whereas `type` intersection of `{ value: string | number }` and `{ value: string }` silently resolves to `{ value: string }` (the intersection of the two value types) — which behavior is more useful depends on intent.

### Q203
- **Difficulty:** Hard
- **Topic:** TypeScript Basics
- **Problem Statement:** Explain TypeScript's module augmentation and declaration merging for extending THIRD-PARTY library types without forking or modifying the original package. Given that a library exports `interface Request { userId?: string }` but doesn't include a property your application always adds (e.g., via middleware), show how to augment it: `declare module 'some-library' { interface Request { userId: string } }` — extending it to be NON-OPTIONAL for your codebase's purposes. Then explain the relationship between global augmentation (`declare global`) and module augmentation (requires `export {}` to make the file a MODULE rather than a script, otherwise `declare global` doesn't apply correctly).
- **Expected Time Complexity:** O(1)
- **Expected Space Complexity:** O(1)
- **Hints:** The file containing the augmentation MUST itself be a module (contain at least one `import` or `export`) for the `declare module` block to be a MODULE augmentation (vs a new ambient module declaration — they look similar but have different semantics).
- **Edge Cases:** Augmenting a third-party `interface` to change an EXISTING property's type (not just add new ones) — TypeScript MERGES declarations, so the augmented type becomes an INTERSECTION of the original and augmented types, which may produce an impossible type if you try to NARROW an existing property rather than simply adding new ones (e.g., trying to change `value: string | number` to `value: string` via merge produces `value: string & (string | number)` = `value: string`, which actually WORKS as expected for narrowing — but is confusing and relies on intersection type semantics).

### Q204
- **Difficulty:** Staff
- **Topic:** TypeScript Basics
- **Problem Statement:** Design a type-safe builder pattern in TypeScript for constructing a complex `QueryBuilder<T>` that accumulates query conditions, and guarantees at COMPILE TIME that `.execute()` can only be called AFTER `.from(table)` has been called (a prerequisite), and that `.limit(n)` can only be called after `.orderBy(field)` (ordering before limiting is required for deterministic pagination). Implement this using the builder returning DIFFERENT TYPE-LEVEL STATES at each step (a fluent interface where the RETURN TYPE of each method changes based on what's been called — state machine encoding at the type level).
- **Expected Time Complexity:** O(1) per builder method call
- **Expected Space Complexity:** O(1) (the builder object itself; the accumulated query state is O(c) for c conditions added)
- **Hints:** Use phantom type parameters or distinct interface types for each builder state: `QueryBuilderEmpty`, `QueryBuilderWithFrom`, `QueryBuilderWithFromAndOrderBy` — each method that "advances" the state returns the NEXT state type; `.execute()` only exists on types that have gone through `.from()`.
- **Edge Cases:** A consumer who tries to CAST the builder to an earlier state type to "skip" prerequisites (TypeScript's structural typing means this would work if the states have compatible shapes — use the nominal branding technique from Q197 or private phantom fields to make the state types structurally DISTINCT and not casually assignable to each other), the builder needing to support METHOD CHAINING in ARBITRARY ORDER for NON-PREREQUISITE methods (e.g., `.where(condition)` can be called at any point after `.from()` and any number of times — the return type still stays in the "has from" state, not regressing).

### Q205
- **Difficulty:** Staff
- **Topic:** TypeScript Basics
- **Problem Statement:** Explain TypeScript's `strict` mode flag and its constituent sub-flags: `strictNullChecks` (the most impactful — `null` and `undefined` are not assignable to other types without explicit opt-in), `noImplicitAny` (variables must have explicit or inferable types), `strictFunctionTypes` (functions are checked CONTRAVARIANTLY on parameters — a common source of surprise), `strictPropertyInitialization` (class properties must be initialized in the constructor unless `!` is used — the "definite assignment assertion"), and `useUnknownInCatchVariables` (TS 4.4+: caught errors are `unknown` rather than `any`, requiring type-narrowing before use). For each, demonstrate a code pattern that compiles FINE with `strict: false` but ERRORS with `strict: true`, and explain why the strict version PREVENTS a real runtime bug.
- **Expected Time Complexity:** O(1)
- **Expected Space Complexity:** O(1)
- **Hints:** `strictNullChecks` is responsible for eliminating entire CLASSES of null-pointer-style bugs at compile time rather than discovering them at runtime as TypeErrors; `strictFunctionTypes` prevents assigning a handler expecting a BROADER argument type to a position expecting a handler for a NARROWER argument (a subtle covariance/contravariance issue that can cause runtime errors if unchecked).
- **Edge Cases:** `strictPropertyInitialization` and the `!` "definite assignment assertion" (sometimes called the "bang operator" in this context) — explain WHEN it's genuinely warranted (a property initialized by a lifecycle method rather than the constructor, such as in an Angular `@Component` with `ngOnInit`) vs when it's a CODE SMELL that masks a genuine uninitialization bug (using `!` just to silence the error without actually ensuring the property IS initialized before use).

---

## SECTION 34: Advanced TypeScript (Q206–Q212)

### Q206
- **Difficulty:** Medium
- **Topic:** Advanced TypeScript
- **Problem Statement:** Implement a fully-typed `pipe` function in TypeScript (building on the JS version from Q52) where the RETURN TYPE of each function must be assignable to the ARGUMENT TYPE of the next function in the chain, enforced at compile time. This requires function overloads for different arities (a pipe of 1 function, 2 functions, 3 functions, etc.) OR a clever variadic/recursive generic approach. Implement overloads for up to 5 functions, demonstrating that `pipe(f1: (a: A) => B, f2: (b: B) => C): (a: A) => C` is correctly inferred.
- **Expected Time Complexity:** O(1) per call
- **Expected Space Complexity:** O(1)
- **Hints:** Each arity needs its own overload signature; TypeScript can infer intermediate types by matching the RETURN TYPE of one overload signature's parameter against the ARGUMENT TYPE of the next, as long as the generic parameters are threaded through correctly.
- **Edge Cases:** What happens when you try to create a 6-function pipe (beyond the last overload) — TypeScript falls through to an `any`-typed overload or errors, depending on how you've structured the fallback; discuss why generating arbitrary-arity overloads via code generation is the pragmatic approach used by production utility libraries (e.g., fp-ts's `pipe`).

### Q207
- **Difficulty:** Hard
- **Topic:** Advanced TypeScript
- **Problem Statement:** Explain TypeScript's DECLARATION FILES (`.d.ts`): their purpose (describing the TYPES of JavaScript code without emitting any runtime code — used for typing third-party JS libraries not written in TS, and for TS libraries published to npm to provide types for consumers without requiring them to process TS source), how the `@types/` namespace on npm works (DefinitelyTyped), and how to WRITE a `.d.ts` file for a fictional vanilla-JS module `mathUtils.js` that exports `add(a, b)`, `multiply(a, b)`, and a `PI` constant. Include `declare module`, function overloads within the declaration (e.g., `add` works for both `number` AND `string` operands), and a default export.
- **Expected Time Complexity:** O(1)
- **Expected Space Complexity:** O(1)
- **Hints:** `.d.ts` files contain ONLY type declarations — no actual code (function bodies, variable initializers) — since the actual implementation is in the `.js` file; `declare function`, `declare const`, `declare module`, and `export default` are the key constructs.
- **Edge Cases:** A JS library that uses CommonJS `module.exports = function(...)` at the top level (not ES module exports) — the corresponding `.d.ts` must use `export = ...` syntax (a TS-specific construct for CJS default exports) AND consumers must use `import X = require('...')` or `esModuleInterop: true` in their `tsconfig.json` to use standard `import X from '...'` syntax — a common source of confusion when consuming CJS libraries from ESM TypeScript code.

### Q208
- **Difficulty:** Hard
- **Topic:** Advanced TypeScript
- **Problem Statement:** Implement a type-safe `Record`-like structure `TypedObject<K extends string, V>` but where SPECIFIC KEY-VALUE PAIRINGS are enforced: e.g., a configuration type where key `'timeout'` must have a `number` value but key `'url'` must have a `string` value — a "heterogeneous record" type. Then demonstrate this using MAPPED TYPES and INDEX SIGNATURES together, and explain the difference between an INDEX SIGNATURE (`{ [key: string]: ValueType }` — all keys have the SAME value type) and a type with specific required keys (`{ timeout: number, url: string }` — each key has its own value type), and when EACH is appropriate (index signature for unknown/dynamic keys; specific keys for known/fixed config shapes).
- **Expected Time Complexity:** O(1)
- **Expected Space Complexity:** O(1)
- **Hints:** Mixing an index signature WITH specific keys of DIFFERENT types than the index signature's value type is restricted in TypeScript (all specific key types must be assignable to the index signature's value type — this is a common friction point when BOTH dynamic and typed keys are needed in the SAME object).
- **Edge Cases:** A type that has BOTH an index signature AND specific required keys of incompatible types — TypeScript will REJECT this (`{ [key: string]: number; name: string }` errors because `string` (the type of `name`) is not assignable to `number` (the index signature's value type)) — discuss solutions: use `{ [key: string]: number | string }` or use `Map<string, number | string>` + separate typed fields, or restructure to avoid the index signature.

### Q209
- **Difficulty:** Hard
- **Topic:** Advanced TypeScript
- **Problem Statement:** Explain TypeScript's `infer` keyword within `extends` conditional types. Implement the following type utilities FROM SCRATCH without using TypeScript's built-in utility types: `ReturnType<T>` (extracts a function's return type), `Parameters<T>` (extracts a function's parameter types as a tuple), `PromiseType<T>` (extracts the resolved type of a `Promise<T>`), and `UnpackArray<T>` (extracts the element type of an array `T[]`). Then compose them: `PromiseType<ReturnType<typeof someAsyncFn>>` should give the RESOLVED value type of an async function.
- **Expected Time Complexity:** O(1) — compile-time only
- **Expected Space Complexity:** O(1)
- **Hints:** `type ReturnType<T extends (...args: any) => any> = T extends (...args: any) => infer R ? R : never`; `infer R` introduces a NEW type variable `R` that TypeScript infers from matching the pattern on the LEFT of `extends` against the actual type.
- **Edge Cases:** `ReturnType<typeof someOverloadedFn>` — for overloaded functions, TypeScript uses the LAST overload signature's return type (a known limitation/behavior); `PromiseType` applied to a NON-promise type (should it return `never`, or the type itself — discuss which is a more useful default and why `never` is typically better for preventing silent misuse).

### Q210
- **Difficulty:** Staff
- **Topic:** Advanced TypeScript
- **Problem Statement:** Implement a deep-readonly utility type `DeepReadonly<T>` that recursively makes ALL nested properties of a type readonly — not just the top-level ones (TypeScript's built-in `Readonly<T>` is shallow). Handle: plain objects (recursively apply), arrays (readonly array elements), functions (leave unchanged — making a function's parameters/return type readonly doesn't make sense in the same way), `Map`/`Set` (conceptually discuss, since TypeScript doesn't have built-in "readonly Map" in the same structural way). Then implement `DeepMutable<T>` that is the INVERSE — removes `readonly` from all nested properties.
- **Expected Time Complexity:** O(1) — compile-time only
- **Expected Space Complexity:** O(1)
- **Hints:** `type DeepReadonly<T> = T extends (...args: any[]) => any ? T : T extends object ? { readonly [K in keyof T]: DeepReadonly<T[K]> } : T`; for `DeepMutable`, use `-readonly [K in keyof T]` (the `-` modifier REMOVES `readonly`).
- **Edge Cases:** Circular/recursive types (e.g., a type `type TreeNode = { value: number, children: TreeNode[] }`) — TypeScript handles recursive type aliases with conditional types by deferring evaluation, but can hit depth limits; in practice `DeepReadonly<TreeNode>` works correctly for most real-world types though TypeScript may emit a warning about "excessive stack depth" for deeply recursive actual INSTANCES.

### Q211
- **Difficulty:** Hard
- **Topic:** Advanced TypeScript
- **Problem Statement:** Explain TypeScript's TEMPLATE LITERAL TYPES (introduced in TS 4.1) and implement several type-level string manipulations: `CamelToSnake<'helloWorldFoo'>` → `'hello_world_foo'`, `SnakeToCamel<'hello_world_foo'>` → `'helloWorldFoo'`, `EventName<T extends string>` → `` `on${Capitalize<T>}` `` (e.g., `EventName<'click'>` = `'onClick'`), and a type that extracts all ROUTE PARAMS from a route string: `ExtractRouteParams<'/users/:id/posts/:postId'>` → `{ id: string, postId: string }`.
- **Expected Time Complexity:** O(1) — compile-time only
- **Expected Space Complexity:** O(1)
- **Hints:** Template literal types use backtick syntax at the TYPE level: `` type Greeting = `Hello ${string}` ``; combining with `infer` within conditional types enables parsing string literal types character by character or segment by segment for more complex transformations; `Capitalize<T>`, `Uncapitalize<T>`, `Uppercase<T>`, `Lowercase<T>` are built-in intrinsic string manipulation types.
- **Edge Cases:** `CamelToSnake` with CONSECUTIVE capitals (e.g., `'parseHTML'` → should it be `'parse_h_t_m_l'` or `'parse_html'`?); `ExtractRouteParams` with OPTIONAL params (`:param?` in some routing conventions) or WILDCARD segments (`*`); TypeScript's template literal type manipulation has depth limits for very complex transformations — discuss when this becomes a practical concern and what to do about it (simplify the type, use string directly with a comment, or use a codegen approach instead).

### Q212
- **Difficulty:** Staff
- **Topic:** Advanced TypeScript
- **Problem Statement:** Explain TypeScript's TYPE COMPATIBILITY rules for FUNCTIONS specifically — covariance and contravariance: (a) return types are COVARIANT (a function returning `Cat` is assignable to a position expecting a function returning `Animal`, since `Cat` is a subtype of `Animal` — the returned value can be used anywhere an `Animal` is needed), (b) parameter types are CONTRAVARIANT under `strictFunctionTypes` (a function ACCEPTING `Animal` is assignable to a position expecting a function accepting `Cat` — the OPPOSITE direction — because the handler is called with `Cat` values, and if it handles ANY `Animal`, it certainly handles a `Cat`). Demonstrate EXACTLY what code compiles vs errors under strict mode, and explain why TypeScript historically used BIVARIANT function parameter checking (assignable BOTH ways) before `strictFunctionTypes` and why methods on object types STILL use bivariant checking by default (a known pragmatic compromise for common OOP patterns that strict contravariance would break).
- **Expected Time Complexity:** O(1)
- **Expected Space Complexity:** O(1)
- **Hints:** The method bivariance "loophole": `interface Animal { eat(food: Food): void }` and `interface Cat extends Animal { eat(food: CatFood): void }` — TypeScript allows narrowing of method parameters in subtype interfaces (bivariant) because requiring full contravariance would make many reasonable OOP patterns impossible; only STANDALONE function types (using `type Fn = (x: X) => Y`, not method syntax) get strict contravariant checking under `strictFunctionTypes`.
- **Edge Cases:** A higher-order function that takes another function as a parameter — demonstrating nested variance flip (a function PARAMETER of function type is contravariant in the overall result, so the PARAMETER of that nested function is actually covariant from the outer perspective — variance INVERTS at each level of function nesting); show a concrete example where getting this wrong causes a RUNTIME type error that TypeScript correctly prevents under strict mode.

---

## SECTION 35: Generics (Q213–Q218)

### Q213
- **Difficulty:** Easy
- **Topic:** Generics
- **Problem Statement:** Implement generic versions of five common utility functions: `identity<T>(x: T): T`, `first<T>(arr: T[]): T | undefined`, `last<T>(arr: T[]): T | undefined`, `zip<A, B>(a: A[], b: B[]): [A, B][]`, and `groupBy<T, K extends string>(arr: T[], keyFn: (item: T) => K): Record<K, T[]>`. Explain how generics provide BOTH type-safety (the return type is inferred correctly without explicit annotation) and REUSABILITY (the same implementation works for arrays of any element type without `any`).
- **Expected Time Complexity:** O(n) for all except `identity` (O(1))
- **Expected Space Complexity:** O(n) for `zip` and `groupBy`; O(1) for `identity`/`first`/`last`
- **Hints:** `K extends string` in `groupBy` constrains the key type to be a string (ensuring it's usable as a `Record` key); the return type `Record<K, T[]>` correctly types the output so that only the actual key values returned by `keyFn` are valid keys in the result (not ALL strings).
- **Edge Cases:** `zip` with arrays of different lengths (result length = shorter array's length — how is this reflected in the return type? Narrowly typed tuples `[A, B][]` only; the LENGTH discrepancy is a runtime behavior, not encoded in this simpler type), `groupBy` with `keyFn` returning values NOT in the type `K` at runtime (TypeScript trusts the annotation but can't prevent runtime violations — discuss whether this warrants a runtime check for defensive library code).

### Q214
- **Difficulty:** Medium
- **Topic:** Generics
- **Problem Statement:** Implement a generic `Result<T, E extends Error = Error>` type (from Q167's JS discussion, now fully typed in TypeScript) with: `ok<T>(value: T): Result<T, never>`, `err<E extends Error>(error: E): Result<never, E>`, `map<T, E extends Error, U>(result: Result<T, E>, fn: (value: T) => U): Result<U, E>`, `flatMap<T, E extends Error, U, F extends Error>(result: Result<T, E>, fn: (value: T) => Result<U, F>): Result<U, E | F>`, and `match<T, E extends Error, U>(result: Result<T, E>, handlers: { ok: (value: T) => U, err: (error: E) => U }): U`. All without any `any` or type assertions.
- **Expected Time Complexity:** O(1) per operation
- **Expected Space Complexity:** O(1)
- **Hints:** The discriminated union `{ ok: true, value: T } | { ok: false, error: E }` enables TypeScript to correctly narrow inside `if (result.ok)` branches without any casts; using `never` in `ok<T>` (return type `Result<T, never>`) means the success case provably has NO error, which composes well — `never` in a union `E | never` simplifies to just `E`.
- **Edge Cases:** `flatMap` with functions that return DIFFERENT error types (`E` vs `F`) — the result combines them into `E | F` (the union of possible errors), which is correct but grows the error union type with each chain step; discuss at what point this becomes unwieldy in practice and whether a simpler "catch-all `Error`" union type is more pragmatic than full type-level error tracking for most codebases.

### Q215
- **Difficulty:** Hard
- **Topic:** Generics
- **Problem Statement:** Implement a generic `Repository<T, Id extends keyof T>` interface where `Id` is the name of the property serving as the unique identifier (e.g., `Repository<User, 'id'>`), and a concrete `InMemoryRepository<T, Id extends keyof T>` implementing it. The `findById(id: T[Id])` method's parameter type must be inferred FROM `T[Id]` (e.g., for `Repository<User, 'id'>` where `User.id: number`, `findById` must accept a `number`, not `string`). Implement `findAll`, `save(entity: T)`, `delete(id: T[Id])`, and `query(predicate: (entity: T) => boolean): T[]`.
- **Expected Time Complexity:** O(1) for `findById`/`save`/`delete` (using a `Map`); O(n) for `findAll`/`query`
- **Expected Space Complexity:** O(n)
- **Hints:** `Id extends keyof T` constrains `Id` to be a valid key of `T`; `T[Id]` is a LOOKUP TYPE — the type of the property `Id` in `T`; the `Map` key type should be `T[Id]` for type safety.
- **Edge Cases:** An entity type where the ID field's type changes between instances (shouldn't happen in a well-typed domain, but `T[Id]` being `string | number` for a UNION entity type — e.g., `type User = { id: string, ... } | { id: number, ... }` — means `findById` accepts `string | number`; discuss whether to further constrain `Id extends keyof T` to require `T[Id] extends string | number | symbol` for Map key compatibility).

### Q216
- **Difficulty:** Hard
- **Topic:** Generics
- **Problem Statement:** Explain generic CONSTRAINTS and their interaction with CONDITIONAL TYPES. Implement `Flatten<T>` — a type that recursively flattens NESTED arrays: `Flatten<number[][][]>` → `number`, `Flatten<string[]>` → `string`, `Flatten<string>` → `string` (non-arrays left unchanged). Then implement `IsArray<T>` → `true | false` as a conditional type, and `Head<T extends readonly unknown[]>` / `Tail<T extends readonly unknown[]>` that extract the first element's type and the remaining elements' types as a tuple, respectively — building blocks for type-level tuple manipulation.
- **Expected Time Complexity:** O(1) — compile-time only
- **Expected Space Complexity:** O(1)
- **Hints:** `Flatten<T> = T extends (infer U)[] ? Flatten<U> : T` — the recursion terminates when `T` is no longer an array type; `Head<[A, B, C]>` = `A` via `T extends [infer H, ...infer _] ? H : never`; `Tail<[A, B, C]>` = `[B, C]` via `T extends [infer _, ...infer R] ? R : never`.
- **Edge Cases:** `Flatten<(string | number)[][]>` → should give `string | number`; `Head<[]>` and `Tail<[]>` on empty tuples (both give `never`); TypeScript's recursion limit for deeply nested arrays (TypeScript will issue a "Type instantiation is excessively deep" error beyond a certain nesting depth — approximately 100 levels — which is rarely a real-world problem for this specific utility).

### Q217
- **Difficulty:** Staff
- **Topic:** Generics
- **Problem Statement:** Implement a type-safe generic `Cache<K, V>` class backed by a `Map` with the following additional typed operations: `getOrCompute(key: K, compute: () => V): V` (returns cached value or computes, caches, and returns), `getOrComputeAsync(key: K, compute: () => Promise<V>): Promise<V>`, `transform<U>(fn: (value: V, key: K) => U): Cache<K, U>` (returns a NEW cache with values transformed — lazy: values are transformed on GET, not eagerly on creation, requiring the transform to be stored for deferred application), and `merge<V2>(other: Cache<K, V2>): Cache<K, V | V2>`. All return types must be correctly inferred with no explicit `any` or type assertions.
- **Expected Time Complexity:** O(1) for `get`/`set`/`getOrCompute`; O(n) for `transform` (deferred) and `merge`
- **Expected Space Complexity:** O(n) entries
- **Hints:** `transform`'s lazy variant stores a list of transform functions composed together (so multiple `.transform()` calls chain without eagerly computing); `merge` must handle key collisions (last-write-wins, or a merger function — pick one and parameterize it).
- **Edge Cases:** `getOrComputeAsync` called concurrently for the SAME key before the first computation completes (the "single-flight" problem from Q130 — the TYPED version must ensure concurrent calls return the SAME `Promise<V>`, not trigger duplicate computations), `transform` of a `Cache<K, V>` producing `Cache<K, U>` where `U extends V` (should be valid — contravariance in cache values — but TypeScript's structural typing may permit or reject depending on the specific types).

### Q218
- **Difficulty:** Staff
- **Topic:** Generics
- **Problem Statement:** Design a type-safe API client using TypeScript generics that eliminates the need for explicit type annotations on EVERY API call while remaining fully type-safe. Given an API schema definition: `type ApiSchema = { '/users': { GET: { response: User[] }, POST: { body: CreateUserDto, response: User } }, '/users/:id': { GET: { response: User }, DELETE: { response: void } } }`, implement a `createApiClient<Schema>(baseUrl: string): ApiClient<Schema>` where the returned client's `.get('/users')` returns `Promise<User[]>`, `.post('/users', body)` requires `body: CreateUserDto` and returns `Promise<User>`, and `.delete('/users/:id', { params: { id: string } })` returns `Promise<void>` — ALL INFERRED from the schema with NO explicit annotations at call sites. The client should give compile-time errors for non-existent routes or wrong HTTP methods.
- **Expected Time Complexity:** O(1) per API call (excluding network)
- **Expected Space Complexity:** O(1)
- **Hints:** Use `keyof Schema` to constrain the `path` parameter; index into the schema to get the METHOD map, then into the method to get `body`/`response` types; conditional types to make `body` parameter optional when the method has no `body` in the schema.
- **Edge Cases:** Path parameters in the route string (`'/users/:id'`) that MUST be provided as a separate `params` argument — use template literal types (Q211) to extract param names from the route string for type-level validation; what if the developer passes `'/users/123'` literally instead of `'/users/:id'` (the schema key) — the schema key IS the pattern, not a literal match, so this is a design decision about whether to also accept literal paths or ONLY the parameterized patterns as defined in the schema.

---

## SECTION 36: Utility Types (Q219–Q222)

### Q219
- **Difficulty:** Easy
- **Topic:** Utility Types
- **Problem Statement:** Implement the following TypeScript built-in utility types FROM SCRATCH (without using the built-ins): `Partial<T>`, `Required<T>`, `Readonly<T>`, `Pick<T, K extends keyof T>`, `Omit<T, K extends keyof T>`, `Exclude<T, U>`, `Extract<T, U>`, and `NonNullable<T>`. For each, write the definition, explain how it uses mapped types or conditional types, and provide a concrete usage example with the inferred result type annotated in a comment.
- **Expected Time Complexity:** O(1) — compile-time only
- **Expected Space Complexity:** O(1)
- **Hints:** `Partial<T>` = `{ [K in keyof T]?: T[K] }` (adds `?`); `Required<T>` = `{ [K in keyof T]-?: T[K] }` (the `-?` REMOVES optionality); `Pick<T, K>` iterates only over `K`, not all of `keyof T`; `Exclude<T, U>` = `T extends U ? never : T` (distributes over a union `T`).
- **Edge Cases:** `Omit<T, K>` is NOT simply the inverse of `Pick<T, K>` in all edge cases — specifically, `Omit` with `K` that includes keys NOT in `T` is allowed (TypeScript doesn't error, it's a no-op for non-existent keys) but `Pick` with non-existent keys DOES error (because `K extends keyof T` is a constraint on `Pick`'s second parameter, but NOT on `Omit`'s — a historical design asymmetry in the built-in utility types worth knowing for interviews).

### Q220
- **Difficulty:** Medium
- **Topic:** Utility Types
- **Problem Statement:** Implement `Parameters<T>`, `ReturnType<T>`, `ConstructorParameters<T>`, `InstanceType<T>`, and `Awaited<T>` from scratch. Then compose them to solve: given a class constructor, infer the instance type; given an async function, infer its resolved return type. Explain `Awaited<T>`'s recursive definition (since `Promise<Promise<T>>` should unwrap to `T`, not `Promise<T>`).
- **Expected Time Complexity:** O(1) — compile-time only
- **Expected Space Complexity:** O(1)
- **Hints:** `Awaited<T> = T extends null | undefined ? T : T extends object & { then(onfulfilled: infer F, ...args: infer _): any } ? F extends (value: infer V, ...args: infer _) => any ? Awaited<V> : never : T` — handles thenable duck typing, not just `Promise` specifically, matching how JavaScript actually awaits values.
- **Edge Cases:** `Awaited<number>` (non-thenable, passes through as `number`); `Awaited<Promise<Promise<string>>>` (recursively unwraps to `string`); `Awaited<{ then: string }>` — an object with a `then` PROPERTY that's a string (not a function) — should NOT be treated as a thenable (TypeScript's actual `Awaited` implementation handles this correctly; your scratch version should too).

### Q221
- **Difficulty:** Hard
- **Topic:** Utility Types
- **Problem Statement:** Implement advanced custom utility types: `DeepPartial<T>` (recursive `Partial`), `DeepRequired<T>` (recursive `Required`), `Mutable<T>` (removes `readonly` from all top-level properties, the opposite of `Readonly`), `FunctionKeys<T>` (a union of KEYS of `T` whose values are function types), `NonFunctionKeys<T>` (the complement), `OptionalKeys<T>` (keys that are optional in `T`), `RequiredKeys<T>` (keys that are required in `T`). Demonstrate how `RequiredKeys<T>` can be implemented using the fact that optional properties become `undefined` in certain type-level constructions (specifically, the trick of creating an object with each key mapped to `undefined` if optional and `never` if required, then extracting keys whose type is NOT `never`).
- **Expected Time Complexity:** O(1) — compile-time only
- **Expected Space Complexity:** O(1)
- **Hints:** `OptionalKeys<T> = { [K in keyof T]-?: {} extends Pick<T, K> ? K : never }[keyof T]` — the trick: `{} extends Pick<T, K>` is `true` if and only if property `K` is optional (because an empty object `{}` satisfies an object type with ONLY optional properties, but NOT one with required ones).
- **Edge Cases:** `DeepPartial<T>` applied to types with ARRAY properties — does `T[K][]` become `(DeepPartial<T[K]>)[] | undefined`, and is this the desired behavior (making arrays optional AND making their elements partial recursively)? Discuss that for most real-world use cases, making array CONTENTS `DeepPartial` is usually WRONG (you'd get `{ name?: string, email?: string }[]` for an array of users, meaning each element is a partial user — which may be intentional for a "partial update" type but confusing for a "default/optional" type).

### Q222
- **Difficulty:** Staff
- **Topic:** Utility Types
- **Problem Statement:** Design a comprehensive set of FORM-SPECIFIC utility types for a typed form library (think: a type-safe version of React Hook Form or Formik's internals). Given a `FormValues` type (the shape of the form's data), derive: `FormErrors<T>` (same shape as `T` but all leaf values are `string | undefined` for error messages, and all intermediate objects are wrapped in the same `FormErrors` recursively), `FormTouched<T>` (same shape but all leaf values are `boolean | undefined`), `FieldPath<T>` (a union of ALL valid dot-separated string paths into `T`, e.g., for `{ user: { name: string, age: number } }`, `FieldPath<T>` = `'user' | 'user.name' | 'user.age'`), and `FieldPathValue<T, Path extends FieldPath<T>>` (the value TYPE at the given path, enabling type-safe `getValues('user.name')` → `string`). Implement each type and explain the recursive conditional type patterns involved.
- **Expected Time Complexity:** O(1) — compile-time only
- **Expected Space Complexity:** O(1)
- **Hints:** `FieldPath<T>` = `` { [K in keyof T & string]: T[K] extends object ? K | `${K}.${FieldPath<T[K]>}` : K }[keyof T & string] ``; `FieldPathValue` uses `infer` within a type that pattern-matches against `\`${infer K}.${infer Rest}\`` to recursively look up nested paths.
- **Edge Cases:** `FieldPath` for types with OPTIONAL properties (the paths are still valid even if the intermediate object is `undefined` at runtime — TypeScript types the PATHS statically; the runtime access with optional chaining is the developer's responsibility), CIRCULAR types in `FormValues` (e.g., a tree type `{ value: T, children: FormValues[] }`) causing `FieldPath` to produce an infinitely deep union type (TypeScript will truncate with a "circular" type error — discuss that truly recursive form data is an unusual edge case that most form libraries handle specially or don't support in their type-level path utilities).

---

## SECTION 37: Mapped Types (Q223–Q226)

### Q223
- **Difficulty:** Medium
- **Topic:** Mapped Types
- **Problem Statement:** Explain mapped types thoroughly — the `{ [K in keyof T]: ... }` pattern — including: KEY REMAPPING with `as` (TS 4.1+), the `+`/`-` modifiers for adding/removing `?` and `readonly`, and filtering keys within a mapped type by returning `never` for unwanted keys (which removes them from the output). Implement: `Getters<T>` (maps `{ name: string }` to `{ getName: () => string }`), `Setters<T>` (maps to `{ setName: (value: string) => void }`), and `EventHandlers<T>` (maps `{ click: MouseEvent, input: InputEvent }` to `{ onClick: (e: MouseEvent) => void, onInput: (e: InputEvent) => void }`) using key remapping.
- **Expected Time Complexity:** O(1) — compile-time only
- **Expected Space Complexity:** O(1)
- **Hints:** Key remapping: `{ [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K] }` — the `as` clause transforms the key using template literal types; `string & K` extracts only string keys (filtering out potential `symbol`/`number` keys for which `Capitalize` wouldn't work).
- **Edge Cases:** A `T` with `symbol` keys (symbols can't be used in template literal types — the `string & K` intersection filters them out of `Getters`/`Setters`/`EventHandlers`, but they ALSO disappear from the output entirely, not being mapped at all — is this desirable, or should symbol keys pass through unchanged? Discuss and implement the "pass symbols through" variant).

### Q224
- **Difficulty:** Hard
- **Topic:** Mapped Types
- **Problem Statement:** Implement `Stringify<T>` — a mapped type that converts all LEAF (primitive) property values in `T` to `string`, leaving the STRUCTURE intact (nested objects remain nested, just with leaf types changed): `Stringify<{ a: number, b: { c: boolean } }>` → `{ a: string, b: { c: string } }`. Then implement the inverse `Parse<T, Source>` that — given the ORIGINAL type `Source` alongside its stringified version `T` — restores the original types (in practice, this requires the original type AS A PARAMETER since JavaScript can't reliably infer types from string values at compile time). Use this to model a "query string serialization/deserialization" use case where a route's query parameters must be stringified for the URL then parsed back to the correct types.
- **Expected Time Complexity:** O(1) — compile-time only
- **Expected Space Complexity:** O(1)
- **Hints:** Leaf detection: a property type that's not `object` (and not an array, Date, etc.) is a "leaf" for this purpose — use `T[K] extends object ? Stringify<T[K]> : string` for the recursive case.
- **Edge Cases:** Arrays in `T` — should `Stringify<{ items: number[] }>` produce `{ items: string[] }` (stringified elements) or `{ items: string }` (the whole array stringified)? Either can be argued; define and implement a specific behavior; `Date` objects — are they "leaf" primitives for this purpose (they're `object` instances but typically treated as scalar/serializable values in APIs) — discuss and make a choice.

### Q225
- **Difficulty:** Hard
- **Topic:** Mapped Types
- **Problem Statement:** Implement `FlattenObject<T>` — a type that FLATTENS a deeply nested object type into a SINGLE LEVEL with DOT-SEPARATED KEYS: `FlattenObject<{ a: { b: { c: string }, d: number } }>` → `{ 'a.b.c': string, 'a.d': number }`. This builds on `FieldPath` from Q222 but produces an OBJECT type (mapping each path string to its value type) rather than a union of paths. Then implement the INVERSE: `UnflattenObject<T>` that reconstructs the nested structure from a flat object with dot-notation keys (this is significantly harder at the type level and involves recursive conditional types to build up nested object types from path segments).
- **Expected Time Complexity:** O(1) — compile-time only
- **Expected Space Complexity:** O(1)
- **Hints:** `FlattenObject<T> = { [K in FieldPath<T>]: FieldPathValue<T, K> }` — composing the utilities from Q222; `UnflattenObject` requires splitting each key on `.` and recursively building a nested type, which stretches TypeScript's type system to its limits but is possible for finite depths.
- **Edge Cases:** A key that is BOTH an intermediate path AND a leaf value simultaneously (e.g., `{ a: { b: string } }` has path `'a'` pointing to an object AND `'a.b'` pointing to a string — should `'a'` appear in the flat type? Discuss and define behavior), very deeply nested types hitting TypeScript's recursive type instantiation depth limit.

### Q226
- **Difficulty:** Staff
- **Topic:** Mapped Types
- **Problem Statement:** Design a typed "schema-to-type" mapper: given a RUNTIME schema object (a plain JS object describing types), generate the CORRESPONDING TypeScript type via mapped types and conditional types. Specifically, implement `InferSchema<S>` where `S` is a schema like `{ name: StringField, age: NumberField, address: ObjectField<{ city: StringField, zip: StringField }> }`, and `InferSchema<typeof mySchema>` → `{ name: string, age: number, address: { city: string, zip: string } }`. Define the `StringField`, `NumberField`, `ObjectField<T>`, `ArrayField<T>`, and `OptionalField<T>` discriminants and how `InferSchema` processes them via conditional types. This models the type-inference core of libraries like `zod`, `yup`, or `io-ts`.
- **Expected Time Complexity:** O(1) — compile-time only
- **Expected Space Complexity:** O(1)
- **Hints:** Each field type carries a PHANTOM TYPE parameter (e.g., `interface StringField { _type: 'string' }`) that `InferSchema` pattern-matches against via conditional types; for `ObjectField<T>`, `InferSchema<ObjectField<T>>` recurses with `{ [K in keyof T]: InferSchema<T[K]> }`.
- **Edge Cases:** `OptionalField<T>` should map to `InferSchema<T> | undefined` (or just make the key optional in the output object via a separate mapped type pass); what happens with CIRCULAR schema references (e.g., a `TreeNodeField` that contains `childrenField: ArrayField<TreeNodeField>`) — TypeScript can handle circular type aliases up to its depth limit, but runtime schema objects containing circular references need special handling in the VALIDATOR logic (not just the type inference).

---

## SECTION 38: Conditional Types (Q227–Q230)

### Q227
- **Difficulty:** Medium
- **Topic:** Conditional Types
- **Problem Statement:** Explain TypeScript's DISTRIBUTIVE conditional types: when a conditional type `T extends U ? X : Y` has a NAKED (unwrapped) type parameter `T` that is a UNION, TypeScript DISTRIBUTES the condition over each member of the union: `string | number extends string ? 'yes' : 'no'` → `'yes' | 'no'` (not just `'no'`). Demonstrate this behavior, explain how to OPT OUT of distribution using `[T] extends [U]` (wrapping in a tuple), and show the practical utility: implementing `NonNullable<T>` relies on distribution (`T extends null | undefined ? never : T`), while implementing an "is this EXACTLY the type `never`" check requires the non-distributive form (`[T] extends [never] ? true : false`, since `never extends never ? true : false` would distribute over the empty union, resulting in `never` rather than `true`).
- **Expected Time Complexity:** O(1) — compile-time only
- **Expected Space Complexity:** O(1)
- **Hints:** An easy way to remember: `[T] extends [U]` checks if the tuple `[T]` is assignable to `[U]` — since the tuple is NOT a naked type parameter, distribution doesn't apply; this changes `T | U extends V` (distributes) to `[T | U] extends [V]` (treats `T | U` as a single unit to compare against `[V]`).
- **Edge Cases:** `IsNever<never>` with the distributive form `never extends never ? true : false` — result is `never` (NOT `true`) because distributing over the EMPTY union (which `never` is) produces the empty union `never`; with the non-distributive form `[never] extends [never] ? true : false` — result is `true` as expected; this is the canonical example demonstrating why the tuple-wrapping trick matters.

### Q228
- **Difficulty:** Hard
- **Topic:** Conditional Types
- **Problem Statement:** Implement a comprehensive set of TYPE PREDICATE utilities using conditional types: `IsString<T>`, `IsNumber<T>`, `IsArray<T>`, `IsObject<T>` (but NOT arrays, NOT functions), `IsFunction<T>`, `IsUnion<T>` (detects if `T` is a union type with 2+ members — tricky to implement!), `IsNever<T>`, `IsTuple<T>` (an array type with a FIXED length, i.e., `[string, number]` vs `string[]`). For each, the result is `true` or `false` (boolean literal types). Pay special attention to `IsUnion<T>` since checking if something is a union is non-trivial and requires exploiting the distributive behavior from Q227.
- **Expected Time Complexity:** O(1) — compile-time only
- **Expected Space Complexity:** O(1)
- **Hints:** `IsUnion<T> = [T] extends [UnionToIntersection<T>] ? false : true` where `UnionToIntersection` converts a union to an intersection — if `T` IS a union, the intersection of its members is NARROWER than any single member, so `[T]` cannot extend `[intersection]`; a simpler but less principled approach: `IsUnion<T, U = T> = T extends any ? ([U] extends [T] ? false : true) : never`.
- **Edge Cases:** `IsObject<null>` — `null` is technically `typeof null === 'object'` in JavaScript, but should `IsObject<null>` return `false` for a TypeScript utility (almost certainly yes, since `null` is not a useful "object" for typical purposes); `IsTuple<[]>` (empty tuple) vs `IsTuple<never[]>` (an array of `never`) — the former IS a tuple (a 0-length fixed-size tuple), the latter is NOT; how to distinguish them at the type level.

### Q229
- **Difficulty:** Hard
- **Topic:** Conditional Types
- **Problem Statement:** Explain and implement `UnionToIntersection<T>` — a utility type that converts a UNION to an INTERSECTION (e.g., `UnionToIntersection<A | B | C>` → `A & B & C`). Then explain its main use cases: (1) converting a union of function types to an intersection (which, due to function overload resolution rules, effectively produces the most general overload), (2) as a building block for `IsUnion` from Q228, and (3) extracting the "last type" from a union (used in complex type-level programming). Explain the MECHANISM: it exploits the fact that a type in CONTRAVARIANT position (function parameter) over a distributed conditional type causes the union to become an intersection.
- **Expected Time Complexity:** O(1) — compile-time only
- **Expected Space Complexity:** O(1)
- **Hints:** `type UnionToIntersection<U> = (U extends any ? (x: U) => void : never) extends (x: infer I) => void ? I : never` — distributes `U` over a function parameter (contravariant position), then uses `infer I` to extract the intersection; the key insight is that INFERRING a type from a union of function types `((x: A) => void) | ((x: B) => void)` in the SINGLE parameter position gives `A & B` (TypeScript must find a type for `x` that satisfies ALL the function variants simultaneously — which is the intersection).
- **Edge Cases:** `UnionToIntersection<string | number>` = `string & number` = `never` (since no value is simultaneously a string and number in TypeScript's type system — expected and correct); `UnionToIntersection<never>` = `unknown` (the intersection of zero types — the TOP type, per semilattice theory — also correct but potentially surprising); function type unions producing intersections that look like overloaded function types.

### Q230
- **Difficulty:** Staff
- **Topic:** Conditional Types
- **Problem Statement:** Implement `TupleToUnion<T extends readonly unknown[]>` (converts a tuple `[A, B, C]` to `A | B | C`) and its inverse `UnionToTuple<U>` (converts `A | B | C` to `[A, B, C]` — notoriously difficult and ORDER-UNSPECIFIED). Explain why `UnionToTuple` is fundamentally order-non-deterministic (TypeScript does NOT guarantee union member order), why this makes it INADVISABLE for production code (the "last union member" trick used to implement it relies on UNDEFINED/IMPLEMENTATION-SPECIFIC TypeScript behavior that can change between TS versions), and what PRACTICAL use cases could drive someone to want `UnionToTuple` despite these caveats (e.g., generating function overloads from a union, or validating that two UNORDERED sets of types are equal via `UnionToIntersection` comparison rather than tuple comparison). Then implement a SAFER alternative: `UnionToOverloadedFn<U extends string>` that converts a string union to an overloaded function type accepting any of the union members.
- **Expected Time Complexity:** O(1) — compile-time only
- **Expected Space Complexity:** O(1)
- **Hints:** `TupleToUnion<T> = T[number]` (indexing a tuple with `number` gives the union of all element types — straightforward); `UnionToTuple` requires `UnionToIntersection` to extract one type at a time from the union, which relies on the overloaded-function intersection behavior, which relies on the LAST overload being picked during inference — and "last" in a union is implementation-defined.
- **Edge Cases:** `TupleToUnion<[]>` = `never` (empty union); `TupleToUnion<[string]>` = `string` (single-element union = the type itself); `UnionToTuple<never>` should ideally be `[]` (empty tuple) but the typical implementation produces `[never]` instead — a known limitation of the trick.

---
