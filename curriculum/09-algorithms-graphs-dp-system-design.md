## SECTION 44: Trees (Q263–Q270)

### Q263
- **Difficulty:** Easy
- **Topic:** Data Structures — Trees
- **Problem Statement:** Implement a Binary Search Tree `BST<T>` in TypeScript with `insert(value: T)`, `search(value: T): boolean`, `delete(value: T): void`, `inOrder(): T[]`, `preOrder(): T[]`, `postOrder(): T[]`, and `levelOrder(): T[][]` (BFS, returning each level as a separate array). The `compareFn` is injectable for generics.
- **Expected Time Complexity:** O(h) for `insert`/`search`/`delete` where h = tree height; O(n) for traversals; O(n) for `levelOrder`
- **Expected Space Complexity:** O(h) for recursive traversal stack; O(n) for `levelOrder` BFS queue
- **Hints:** `delete` has three cases: leaf node (just remove), node with one child (replace with child), node with TWO children (replace with the in-order SUCCESSOR — the smallest node in the right subtree — then delete the successor from its original position); `levelOrder` uses a queue, processing nodes level by level.
- **Edge Cases:** Deleting the root node with two children, deleting a node that doesn't exist (no-op), a degenerate BST (all elements inserted in sorted order → height = n, all operations degrade to O(n)), inserting duplicate values (define behavior: ignore, allow, or replace — document the choice).

### Q264
- **Difficulty:** Medium
- **Topic:** Data Structures — Trees
- **Problem Statement:** Implement THREE classic binary tree problems in TypeScript: (1) `maxDepth(root: TreeNode | null): number`, (2) `isBalanced(root: TreeNode | null): boolean` — check if the tree is height-balanced (height difference between left and right subtrees ≤ 1 for EVERY node, not just the root), (3) `lowestCommonAncestor(root: TreeNode | null, p: TreeNode, q: TreeNode): TreeNode | null`. For `isBalanced`, avoid the O(n²) naive approach (computing height separately per node) and implement the O(n) bottom-up approach that returns height (or -1 to signal imbalance) in a single DFS pass.
- **Expected Time Complexity:** O(n) for all three
- **Expected Space Complexity:** O(h) recursion stack; O(n) worst case for a degenerate tree
- **Hints:** `isBalanced` O(n): return a helper that returns the actual height if balanced or a sentinel value (e.g., `-1`) if unbalanced; `LCA`: if current node is `p` or `q`, return it; recurse both sides — if BOTH sides return non-null, current node IS the LCA; if only one side returns non-null, propagate that result up.
- **Edge Cases:** `LCA` where one node is an ANCESTOR of the other (`p` is `q`'s ancestor — the LCA is `p` itself), `LCA` where both `p` and `q` are in DIFFERENT subtrees, `LCA` on an empty tree or tree with only one of `p`/`q` present (return `null`).

### Q265
- **Difficulty:** Hard
- **Topic:** Data Structures — Trees
- **Problem Statement:** Implement `serializeDeserialize(root: TreeNode | null): string` and `deserialize(data: string): TreeNode | null` — encode a binary tree to a string and decode the string back to the original tree structure (LeetCode #297 Serialize and Deserialize Binary Tree). Implement BOTH BFS-based and pre-order DFS-based approaches, explaining the trade-offs (BFS serialization is more "human-readable" as level-by-level; DFS pre-order serialization is simpler to implement iteratively/recursively). The serialization must preserve the EXACT tree structure including null children.
- **Expected Time Complexity:** O(n) for both serialize and deserialize
- **Expected Space Complexity:** O(n) for the serialized string; O(n) for the queue/recursion stack
- **Hints:** DFS pre-order: serialize as `value,null,null,...` with `#` for null nodes; deserialization reads values one by one, recursively building the tree; use a queue/iterator to avoid recomputing "which value is next" in each recursive call.
- **Edge Cases:** Empty tree (serialize to an empty string or `"#"` — be consistent), a tree with all nulls except root, very deep linear trees (recursion depth for DFS approaches O(n) — may hit stack limits for trees of 10,000+ nodes; discuss iterative alternatives).

### Q266
- **Difficulty:** Hard
- **Topic:** Data Structures — Trees
- **Problem Statement:** Implement a self-balancing AVL tree `AVLTree<T>` in TypeScript with `insert` and `delete` operations that automatically maintain the balance invariant (height difference ≤ 1 at every node) via single and double rotations (left rotation, right rotation, left-right rotation, right-left rotation). Explain each rotation case (LL, LR, RL, RR imbalance), and demonstrate that the tree height is always O(log n) after each operation, guaranteeing O(log n) worst-case for `insert`/`search`/`delete` (unlike an unbalanced BST which degrades to O(n) on sorted input).
- **Expected Time Complexity:** O(log n) for all operations (guaranteed, not amortized)
- **Expected Space Complexity:** O(n) for the tree; O(log n) for the recursive call stack during operations
- **Hints:** Each node stores its HEIGHT; during insertion/deletion, update heights bottom-up and check the balance factor (`left.height - right.height`) at each ancestor; when `|balance| > 1`, determine the imbalance case by checking the balance factor of the HEAVIER child (same-sign = single rotation; opposite-sign = double rotation).
- **Edge Cases:** Inserting an element into an already-balanced tree that causes a cascade of rebalancing up multiple levels (verify that rotations propagate correctly via unit tests with specific sequences like inserting 1,2,3,4,5,6,7 into an empty AVL tree), deleting the root of a balanced tree.

### Q267
- **Difficulty:** Hard
- **Topic:** Data Structures — Trees
- **Problem Statement:** Solve `pathSumIII(root: TreeNode | null, targetSum: number): number` — count the number of paths in a binary tree that sum to `targetSum`, where paths do NOT need to start at the root or end at a leaf (they must go downward — parent to child). Implement the O(n) approach using PREFIX SUMS and a hash map (analogous to the classic subarray sum problem), avoiding the O(n²) approach of trying all start-end node pairs.
- **Expected Time Complexity:** O(n) — prefix sum DFS
- **Expected Space Complexity:** O(h) for the recursion stack + O(n) for the prefix sum map
- **Hints:** DFS tracking the running prefix sum from the root; at each node, check if `currentSum - targetSum` exists in the prefix sum frequency map (meaning some prefix of the path from root to HERE sums to exactly `currentSum - targetSum`, so the REMAINING SUFFIX sums to `targetSum`); ADD the current prefix sum to the map BEFORE recursing, and REMOVE it AFTER recursing (backtracking) to avoid counting paths from DIFFERENT branches.
- **Edge Cases:** `targetSum = 0` (any prefix sum that repeats means there's a zero-sum sub-path — valid to count), negative values in the tree (the prefix sum approach handles negatives correctly, unlike greedy approaches), the same node value appearing multiple times on a path (all counted independently — the prefix sum approach handles this).

### Q268
- **Difficulty:** Hard
- **Topic:** Data Structures — Trees
- **Problem Statement:** Implement `kthSmallestInBST(root: TreeNode | null, k: number): number` using in-order traversal (O(h + k) time O(h) space using an ITERATIVE in-order traversal with an explicit stack to avoid O(n) full traversal for large trees). Then implement a `BSTIterator` class (LeetCode #173) with `next(): number` (returns next smallest) and `hasNext(): boolean`, supporting O(h) memory by lazily traversing only as much of the tree as needed.
- **Expected Time Complexity:** O(h + k) for kth smallest; O(h) average per `next()` call amortized across all calls; O(1) amortized for `hasNext()`
- **Expected Space Complexity:** O(h) for the iterator's internal stack
- **Hints:** The iterator maintains a stack of nodes representing the LEFT SPINE of the subtree rooted at the current position; `next()` pops the top node (returning its value), then pushes the LEFT SPINE of its RIGHT subtree; this achieves O(h) space (the stack never exceeds the height of the current unvisited subtree) rather than flattening the entire tree upfront.
- **Edge Cases:** `k` > number of nodes in the BST (implementation should handle without crashing — return some sentinel or throw a clear error), calling `next()` after `hasNext()` returns `false` (undefined behavior — document and optionally guard with a check), trees with duplicate values (the k-th smallest in a BST with duplicates depends on whether duplicates are stored in the left or right subtree — document your convention).

### Q269
- **Difficulty:** Staff
- **Topic:** Data Structures — Trees
- **Problem Statement:** Implement a B-TREE (minimum order `t=2`, i.e., 2-3-4 tree) in TypeScript supporting `search`, `insert` (with node SPLITTING on overflow), and discuss `delete` conceptually (full B-tree deletion is complex — describe the algorithm including the cases of borrowing from siblings and node MERGING). Explain WHY B-trees (or their variant, B+ trees) are used in DATABASE INDEXES and FILE SYSTEMS: high branching factor (hundreds to thousands of keys per node vs BST's 1 key per node) minimizes tree HEIGHT, reducing the number of DISK I/O reads required to traverse from root to leaf (which is the dominant cost for disk-backed data, not CPU comparisons as in RAM-based structures).
- **Expected Time Complexity:** O(log_t n) for search/insert (log base t, where t = minimum degree/branching factor — dramatically better than O(log n) base 2 for large t)
- **Expected Space Complexity:** O(n)
- **Hints:** For order-t B-tree: each internal node holds between `t-1` and `2t-1` keys and between `t` and `2t` children; a node with `2t-1` keys is FULL and must be split before insertion proceeds into it (SPLIT-BEFORE-DESCEND strategy avoids needing to walk back up to fix overflows).
- **Edge Cases:** Splitting the ROOT (creates a new root, the ONLY time the tree height increases), inserting into a tree that starts empty (first insertion creates the root with 1 key), the relationship between B-tree node size and DISK BLOCK SIZE in real storage engines (a key engineering constraint: choose `t` so that a node fits exactly in one disk block — typically 4KB-16KB, fitting hundreds of integer keys or dozens of compound keys).

### Q270
- **Difficulty:** Staff
- **Topic:** Data Structures — Trees
- **Problem Statement:** Design a SEGMENT TREE in TypeScript for efficient RANGE QUERIES and POINT UPDATES on an array of numbers. Support `buildTree(nums: number[]): void`, `rangeSum(left: number, right: number): number` (sum of elements in `[left, right]` inclusive), and `update(index: number, value: number): void`. Then extend to support LAZY PROPAGATION for RANGE UPDATES (`rangeUpdate(left, right, delta)` — adds `delta` to every element in the range) in O(log n) time (vs O(n) for naive updates), demonstrating the classic segment tree with lazy propagation pattern used in competitive programming and interval-based problems.
- **Expected Time Complexity:** O(n) to build; O(log n) for range query and point update; O(log n) for lazy range update and range query with lazy propagation
- **Expected Space Complexity:** O(n) for the tree array (4n is sufficient for a 1-indexed implementation)
- **Hints:** Store the tree as a flat array of size `4n` (1-indexed, where node at index `i` has children at `2i` and `2i+1`); range query decomposes the range into O(log n) precomputed subtree sums; lazy propagation stores a "pending delta" at each node, pushed down to children only when the children are actually accessed (not immediately when the range update is applied).
- **Edge Cases:** Range queries where `left > right` (return 0 or throw — document), `update` with the same value (no-op in terms of sum tree, but still O(log n) — discuss whether a "no-op" check is worth adding), lazy propagation with OVERLAPPING range updates applied in sequence (each should compound correctly — verify with a test case: update `[1,5]` by +10, then update `[3,7]` by -5, then query `[1,7]`).

---

## SECTION 45: Graphs & Algorithms (Q271–Q285)

### Q271
- **Difficulty:** Medium
- **Topic:** Data Structures — Graphs
- **Problem Statement:** Implement a `Graph<T>` in TypeScript supporting both DIRECTED and UNDIRECTED modes, with adjacency LIST representation. Include: `addVertex(value: T)`, `addEdge(from: T, to: T, weight?: number)`, `removeEdge(from: T, to: T)`, `hasPath(from: T, to: T): boolean` (DFS-based), `bfs(start: T): T[]` (level-order traversal), and `dfs(start: T): T[]` (pre-order traversal). Support WEIGHTED edges for later use in Dijkstra's (Q272).
- **Expected Time Complexity:** O(V + E) for BFS/DFS where V = vertices, E = edges; O(1) amortized for addVertex/addEdge with adjacency list
- **Expected Space Complexity:** O(V + E) for the adjacency list
- **Hints:** Use `Map<T, Map<T, number>>` as the adjacency list (vertex → (neighbor → weight)); BFS uses a queue + visited set; DFS uses a stack (iterative) or recursion + visited set.
- **Edge Cases:** Disconnected graphs (BFS/DFS from a starting node only visits the CONNECTED component containing it — discuss whether a "full BFS/DFS" visiting ALL components is needed), self-loops (`addEdge(a, a)`), duplicate edges in an undirected graph (adding edge A-B twice — does the second overwrite the first with a different weight?).

### Q272
- **Difficulty:** Hard
- **Topic:** Algorithms — Graphs
- **Problem Statement:** Implement Dijkstra's shortest path algorithm `dijkstra(graph: WeightedGraph, start: string): Map<string, number>` — returns the shortest distance from `start` to ALL other vertices. Implement a MIN-HEAP priority queue for O((V + E) log V) performance. Then implement `shortestPath(graph, start, end)` that returns the actual SEQUENCE of vertices forming the shortest path (not just the distance), by maintaining a `previous` map during Dijkstra's.
- **Expected Time Complexity:** O((V + E) log V) with a min-heap; O(V²) with a naive array-based priority queue
- **Expected Space Complexity:** O(V) for distances/previous/heap
- **Hints:** Initialize all distances to `Infinity` except `start = 0`; use a min-heap of `{node, distance}` entries; when extracting the minimum, SKIP if the recorded distance is already SHORTER than the heap entry (lazy deletion — a classic optimization avoiding the need for a "decrease key" operation).
- **Edge Cases:** Negative edge weights (Dijkstra's is INCORRECT with negative weights — it may miss shorter paths; Bellman-Ford is required — mention this limitation explicitly), disconnected graph (unreachable vertices remain at `Infinity`), the start vertex not existing in the graph (throw a clear error), a graph with a single vertex.

### Q273
- **Difficulty:** Hard
- **Topic:** Algorithms — Graphs
- **Problem Statement:** Implement TOPOLOGICAL SORT for a Directed Acyclic Graph (DAG) using BOTH approaches: (1) Kahn's algorithm (BFS-based, using in-degree counts), and (2) DFS-based post-order. Use it to solve `courseSchedule(numCourses: number, prerequisites: [number, number][]): boolean` — determine if it's possible to finish all courses given prerequisites (detect if the directed graph has a cycle, making completion impossible).
- **Expected Time Complexity:** O(V + E) for both topological sort approaches
- **Expected Space Complexity:** O(V + E) for the adjacency list + in-degree array/visited set
- **Hints:** Kahn's: start with all zero-in-degree nodes in a queue; repeatedly remove a node, add to the sort output, and decrement neighbors' in-degrees (adding to queue when they reach 0); if the final sorted list has FEWER than V nodes, a cycle exists (some nodes were never enqueued); DFS: post-order (add to result AFTER fully processing all successors) naturally produces a topological order for a DAG; use a "current path" set (not just "visited") to detect BACK EDGES (cycles) vs already-completed branches.
- **Edge Cases:** Multiple valid topological orderings (both algorithms produce VALID but possibly different orderings — any valid topological sort is acceptable unless a specific one is required), a fully disconnected graph (all nodes have in-degree 0 — Kahn's enqueues all of them initially; the result includes all vertices in some valid order).

### Q274
- **Difficulty:** Hard
- **Topic:** Algorithms — Graphs
- **Problem Statement:** Implement UNION-FIND (Disjoint Set Union) in TypeScript with `union(a: number, b: number)` and `find(a: number): number` supporting both UNION BY RANK and PATH COMPRESSION optimizations (achieving nearly O(1) amortized per operation — formally O(α(n)) where α is the inverse Ackermann function). Use it to solve `numberOfIslands(grid: string[][]): number` and `redundantConnection(edges: number[][]): number[]` (find the edge that, if removed, makes the graph a tree — return the LAST redundant edge if multiple exist).
- **Expected Time Complexity:** O(α(n)) ≈ O(1) amortized per union-find operation with both optimizations
- **Expected Space Complexity:** O(n) for parent/rank arrays
- **Hints:** Path compression: in `find`, make every node on the path to the root point DIRECTLY to the root (recursive or iterative flattening); union by rank: always attach the SHORTER tree under the TALLER tree (avoid degenerating to a linked list); `redundantConnection`: process edges one by one — if an edge connects two nodes ALREADY in the same component, it's redundant; the last such edge is the answer.
- **Edge Cases:** `find(a)` where `a` is already the root (no-op), `union(a, a)` (self-union — no-op), `numberOfIslands` with all water or all land, `redundantConnection` where multiple redundant edges exist (return the one appearing LAST in the input).

### Q275
- **Difficulty:** Hard
- **Topic:** Algorithms — Graphs
- **Problem Statement:** Implement `wordLadder(beginWord: string, endWord: string, wordList: string[]): number` — find the length of the shortest transformation sequence from `beginWord` to `endWord`, changing ONE LETTER AT A TIME, where each intermediate word must exist in `wordList`. Use BIDIRECTIONAL BFS for efficiency (simultaneously BFS from both `beginWord` and `endWord`, stopping when the frontiers meet) which reduces the search space from O(b^d) to O(b^(d/2)) where b = branching factor, d = shortest path length.
- **Expected Time Complexity:** O(M² × N) where M = word length, N = wordList size (generating neighbors: O(M²) per word × O(N) words traversed)
- **Expected Space Complexity:** O(M² × N) for the BFS queues and visited sets
- **Hints:** For each word in the BFS frontier, generate ALL words differing by ONE character (O(M × 26) candidates per word, filter against the `wordList` set for O(1) lookups); bidirectional BFS always expands the SMALLER frontier to minimize work.
- **Edge Cases:** `endWord` not in `wordList` (return 0 immediately — impossible), `beginWord = endWord` (return 1 — the sequence has length 1, just the start), wordList containing duplicates (the `Set` structure handles this naturally).

### Q276
- **Difficulty:** Medium
- **Topic:** Algorithms — Recursion
- **Problem Statement:** Implement `generateParentheses(n: number): string[]` — generate all valid combinations of `n` pairs of parentheses using BACKTRACKING. Explain the pruning conditions (only add `(` if open count < n; only add `)` if close count < open count), and implement `countValidParentheses(n: number): number` as a PURE mathematical calculation (it equals the n-th Catalan number: `C(n) = (2n choose n) / (n+1)`).
- **Expected Time Complexity:** O(4^n / √n) — the number of valid strings grows as the Catalan number; this bounds the total work done by the backtracking
- **Expected Space Complexity:** O(n) for the recursion stack; O(result size) for the output
- **Hints:** Backtracking: `recurse(current, open, close)` where `open` = number of `(` used so far, `close` = number of `)` used; two branching choices at each step (add `(` if allowed, add `)` if allowed), with clear termination when `open = close = n`.
- **Edge Cases:** `n = 0` (return `['']` — the empty string is the only valid combination with 0 pairs; debate: return `[]` vs `['']`), `n = 1` (return `['()']`), large `n` causing exponential output (the FUNCTION itself is O(Catalan(n)) which is fine for n ≤ 10, but quickly becomes impractical for n > 15).

### Q277
- **Difficulty:** Hard
- **Topic:** Algorithms — Recursion
- **Problem Statement:** Implement `nQueens(n: number): string[][]` — the N-Queens problem: place N queens on an N×N chessboard such that no two queens attack each other (same row, column, or diagonal). Return ALL distinct solutions, each as an array of strings representing the board. Implement with BITMASK optimization for O(1) column/diagonal conflict checking using three bitmasks tracking used columns, left diagonals, and right diagonals.
- **Expected Time Complexity:** O(n!) in the worst case (the backtracking explores at most n × (n-1) × ... × 1 placements), but in practice much less due to aggressive pruning via the bitmask conflict checks
- **Expected Space Complexity:** O(n) for the recursion stack and queen position tracking; O(n²) per solution to build the board string representation
- **Hints:** Represent each solution as an array of N numbers (queen column positions per row, one queen per row); bitmask approach: maintain `cols` (which columns are taken), `leftDiag` (which `col - row` diagonals are taken), `rightDiag` (which `col + row` diagonals are taken); at each row, `available = allBits & ~(cols | leftDiag | rightDiag)`.
- **Edge Cases:** `n = 1` (one solution: a single queen), `n = 2` and `n = 3` (no solutions — return `[]`), `n = 4` (2 solutions), large `n` (the count of solutions grows very rapidly; `n = 15` has 2,279,184 solutions — returning all of them is impractical; discuss returning just the COUNT in that case).

### Q278
- **Difficulty:** Medium
- **Topic:** Algorithms — Dynamic Programming
- **Problem Statement:** Implement `coinChange(coins: number[], amount: number): number` — given coin denominations and a target amount, return the MINIMUM number of coins needed to make the amount (or -1 if impossible). Implement BOTH top-down (memoization) and bottom-up (tabulation) DP approaches, and identify the recurrence: `dp[i] = min(dp[i - coin] + 1)` for each `coin ≤ i`.
- **Expected Time Complexity:** O(amount × coins.length) for both approaches
- **Expected Space Complexity:** O(amount) for the dp array/memo cache
- **Hints:** Bottom-up: initialize `dp[0] = 0` and `dp[1..amount] = Infinity`; iterate from 1 to amount, for each coin, update `dp[i] = min(dp[i], dp[i - coin] + 1)` if `i ≥ coin` and `dp[i - coin] !== Infinity`.
- **Edge Cases:** `amount = 0` (return 0 — zero coins needed), coins not forming any valid combination for the target (return -1), coins including a denomination larger than `amount` (irrelevant — simply never used), duplicate denominations in `coins` array (harmless — same result, just redundant computation).

### Q279
- **Difficulty:** Hard
- **Topic:** Algorithms — Dynamic Programming
- **Problem Statement:** Implement `longestIncreasingSubsequence(nums: number[]): number` using BOTH approaches: the O(n²) DP approach (textbook, clean) AND the O(n log n) approach using a "patience sorting" BINARY SEARCH optimization (maintaining a `tails` array where `tails[i]` is the smallest tail element of all increasing subsequences of length `i+1`). Also implement `reconstructLIS(nums)` that returns the actual subsequence (not just its length), requiring backtracking through the DP choices.
- **Expected Time Complexity:** O(n²) for DP; O(n log n) for binary search optimization
- **Expected Space Complexity:** O(n) for dp array and tails array
- **Hints:** O(n log n): for each `num`, binary search in `tails` for the first element ≥ `num` (using `lower_bound`) and REPLACE it (or APPEND if `num > all tails`); this gives the LIS LENGTH as `tails.length`, though `tails` itself is NOT a valid LIS; to reconstruct, maintain a separate `parents` and `positions` array tracking which index was replaced/extended at each step.
- **Edge Cases:** All elements equal (LIS length = 1), all elements in DECREASING order (LIS length = 1), all elements in INCREASING order (LIS = entire array), negative numbers and zeros in the array.

### Q280
- **Difficulty:** Hard
- **Topic:** Algorithms — Dynamic Programming
- **Problem Statement:** Implement `editDistance(word1: string, word2: string): number` (Levenshtein distance) — the minimum number of SINGLE-CHARACTER edits (insertions, deletions, or substitutions) required to transform `word1` into `word2`. Explain the DP recurrence thoroughly, then implement the SPACE-OPTIMIZED O(min(m,n)) space version (using only two rows at a time instead of a full m×n matrix). Also implement `editDistanceWithOps(word1, word2)` that reconstructs the SEQUENCE of operations (not just the minimum count) by backtracking through the DP table.
- **Expected Time Complexity:** O(m × n) where m, n = lengths of the two strings
- **Expected Space Complexity:** O(min(m, n)) for the space-optimized version
- **Hints:** `dp[i][j]` = min edit distance to transform `word1[0..i-1]` to `word2[0..j-1]`; if chars match: `dp[i][j] = dp[i-1][j-1]`; else `dp[i][j] = 1 + min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1])` (delete, insert, substitute); space optimization: only the PREVIOUS ROW is needed to compute the current row.
- **Edge Cases:** Empty string inputs (`word1 = ""` → distance = `word2.length`; both empty → distance = 0), identical strings (distance = 0), single-character strings, strings with repeated characters.

### Q281
- **Difficulty:** Hard
- **Topic:** Algorithms — Dynamic Programming
- **Problem Statement:** Implement `regularExpressionMatching(s: string, p: string): boolean` — implement regex matching with `.` (matches any single character) and `*` (matches ZERO OR MORE of the preceding element). This is one of the hardest DP problems in common interviews. Implement the DP approach defining `dp[i][j]` = whether `s[0..i-1]` matches `p[0..j-1]`, working through the recurrence carefully for the `*` case (either ignore the `x*` pair entirely — `dp[i][j] = dp[i][j-2]` — or if the character before `*` matches `s[i-1]`, extend the match — `dp[i][j] = dp[i-1][j]`).
- **Expected Time Complexity:** O(m × n) where m = |s|, n = |p|
- **Expected Space Complexity:** O(m × n); O(n) space-optimized
- **Hints:** Base cases are critical and tricky: `dp[0][0] = true`; `dp[0][j]` = `true` if `p[0..j-1]` can match an empty string (patterns like `a*b*c*` can); `dp[i][0] = false` for i > 0 (non-empty string can't match empty pattern).
- **Edge Cases:** Pattern `.*` (matches everything), empty pattern with non-empty string (false), empty string with pattern containing only `x*` pairs (true), consecutive `*` in the pattern (e.g., `a**` — this may be an invalid pattern depending on the spec; define whether to handle or reject).

### Q282
- **Difficulty:** Hard
- **Topic:** Algorithms — Dynamic Programming
- **Problem Statement:** Implement `burstBalloons(nums: number[]): number` — given n balloons, each with a number on it, bursting balloon `i` earns `nums[i-1] * nums[i] * nums[i+1]` coins (where out-of-bounds neighbors are treated as 1). Find the MAXIMUM coins obtainable by bursting all balloons. This is a classic "interval DP" problem where the key insight is thinking about which balloon to burst LAST (not first) in each subinterval.
- **Expected Time Complexity:** O(n³)
- **Expected Space Complexity:** O(n²) for the DP table
- **Hints:** Pad `nums` with `1` on both ends; `dp[i][j]` = max coins from bursting all balloons BETWEEN indices `i` and `j` (exclusive); try each `k` in `(i, j)` as the LAST balloon to burst in this interval: `dp[i][j] = max(dp[i][k] + nums[i]*nums[k]*nums[j] + dp[k][j])`.
- **Edge Cases:** Single balloon (burst it for `1 * nums[0] * 1 = nums[0]`), two balloons (try both orders), all balloons with value 1 (answer = n — each burst earns 1 coin since all neighbors are 1 or the padding 1s).

### Q283
- **Difficulty:** Staff
- **Topic:** Algorithms — Dynamic Programming
- **Problem Statement:** Implement the KNAPSACK problem family in TypeScript: (1) `zeroOneKnapsack(weights: number[], values: number[], capacity: number): number` (each item used at most once), (2) `unboundedKnapsack(weights, values, capacity)` (each item used unlimited times — nearly identical but the inner loop direction changes!), and (3) `multipleKnapsack(items: {weight, value, count}[], capacity)` (each item has a limited count — reduce to 0/1 knapsack using BINARY SPLITTING of item counts for O(n log maxCount) reduction vs naive O(n × maxCount)). Then implement a VARIANT: `subsetSum(nums: number[], target: number): boolean` — does a subset of `nums` sum to `target`? (Equivalent to 0/1 knapsack with `values = weights` and asking if max value = target.)
- **Expected Time Complexity:** O(n × capacity) for 0/1 and unbounded; O(n log maxCount × capacity) for multiple knapsack
- **Expected Space Complexity:** O(capacity) space-optimized (rolling 1D array instead of 2D)
- **Hints:** 0/1 knapsack space optimization: iterate capacity BACKWARDS (high to low) to prevent an item being used TWICE in the same pass; unbounded: iterate capacity FORWARDS (an item can be reused, so reusing the updated values within the same pass is DESIRED); binary splitting: represent `count` copies of an item as `floor(log2(count)) + 1` pseudo-items of sizes 1, 2, 4, ..., `count - (2^k - 1)`, where these powers of 2 can combine to represent any count from 1 to `count`.
- **Edge Cases:** Capacity = 0 (max value = 0, no items can be taken), all items heavier than capacity (max value = 0), `subsetSum` with negative numbers (the standard DP approach requires an offset or a different formulation — discuss), duplicate items in the `nums` array for `subsetSum` (they're treated as distinct elements even if equal values, since the INDICES distinguish them in 0/1 knapsack semantics).

### Q284
- **Difficulty:** Staff
- **Topic:** Algorithms — Dynamic Programming
- **Problem Statement:** Implement `palindromePartitioningMinCuts(s: string): number` — find the MINIMUM number of cuts to partition a string `s` into palindromes (Palindrome Partitioning II). The O(n²) DP solution uses: (1) a precomputed `isPalin[i][j]` table built using the "expand from center" technique (O(n²) preprocessing), (2) a `cuts[i]` DP where `cuts[i]` = min cuts for `s[0..i]`, updated as `cuts[i] = min(cuts[j-1] + 1)` for all `j ≤ i` where `s[j..i]` is a palindrome. Explain why the naive approach (just trying all partitions) is exponential, and why the precomputed palindrome table enables the polynomial solution.
- **Expected Time Complexity:** O(n²) time and space for the palindrome table; O(n²) total
- **Expected Space Complexity:** O(n²) for `isPalin`; O(n) for `cuts`
- **Hints:** Build `isPalin` in a bottom-up manner by length: for length 1 (all true), length 2 (true if chars equal), length 3+ (true if outer chars equal AND `isPalin[i+1][j-1]` is true); note `cuts[0] = 0` (no cuts needed for a 1-character string that's already a palindrome) and carefully define `cuts` indexing.
- **Edge Cases:** An empty string (0 cuts), a string that's already a palindrome (0 cuts), a string of all SAME characters (0 cuts — the whole string is a palindrome), the all-different-characters case (each character is its own palindrome; worst case `n-1` cuts).

### Q285
- **Difficulty:** Staff
- **Topic:** System Design for Frontend
- **Problem Statement:** Design the frontend architecture for a REAL-TIME COLLABORATIVE CODE EDITOR (like CodeSandbox or StackBlitz) supporting: (1) a MONACO EDITOR integration with multiple files/tabs, (2) real-time collaboration between multiple users (showing each user's cursor/selection, merging edits without conflicts using OPERATIONAL TRANSFORMS or CRDTs), (3) in-browser code EXECUTION (via WebAssembly or an iframe sandbox for safe execution), (4) a virtual file system (VFS) representing the project, (5) hot-reloading of the preview whenever code changes. Focus on the DATA FLOW architecture (how a keystroke in one user's editor propagates to another user's view and the live preview), component/module boundaries, and the specific APIs/technologies used at each layer (WebSocket for collaboration, `SharedArrayBuffer` for the WASM execution worker, `BroadcastChannel` for cross-tab state, Service Worker for offline asset caching).
- **Expected Time Complexity:** Discussion-based; target <100ms end-to-end latency for collaborative cursor updates, <500ms for hot-reload preview refresh on code change
- **Expected Space Complexity:** Browser memory budget discussion: the in-browser VFS should be backed by IndexedDB (persistent) with an in-memory cache layer (fast); the collaboration state (OT/CRDT document history) should be bounded to avoid unbounded memory growth for long editing sessions
- **Hints:** CRDT libraries like Yjs or Automerge handle the core OT/CRDT data structure; WebSocket integration via Yjs providers (`y-websocket`); Monaco editor's `ITextModel` can be bound to a Yjs `Y.Text` object; the preview iframe receives updated module URLs via `postMessage` for hot-reloading; esbuild compiled to WASM runs in a Worker for fast in-browser bundling.
- **Edge Cases:** Network partition (one user goes offline mid-editing — their local CRDT state diverges; on reconnect, the CRDT merges without data loss or conflicts by design), a file being deleted by one user while another has it open (notify the second user gracefully — don't crash), latency between the code change and the hot-reload preview being perceptibly long (discuss debouncing the rebuild trigger — similar to Q121 — and showing a "building..." spinner to set user expectations).

---

## SECTION 46: System Design & Scalable Applications (Q286–Q296)

### Q286
- **Difficulty:** Staff
- **Topic:** System Design for Frontend
- **Problem Statement:** Design a DESIGN SYSTEM component library for a large organization (100+ engineers, 5+ distinct product teams) that must: (a) be FRAMEWORK-AGNOSTIC at its core (web components or headless/unstyled primitive components) while providing React bindings, (b) support THEMING (multiple brand themes — a consumer-facing theme and an admin-facing theme with different color palettes, typography, spacing scales), (c) achieve ACCESSIBLE DEFAULTS out of the box (WCAG AA, ARIA patterns for all interactive components), (d) ship with zero-runtime-CSS options (CSS-in-JS with extraction) OR CSS custom properties + utility classes, (e) enable TREE SHAKING so teams import only what they use. Discuss the monorepo structure, versioning strategy (calendar vs semantic versioning), BREAKING CHANGE management (a component API change affects 50 different consuming applications — how to coordinate migration?), and automated visual regression testing with tools like Chromatic.
- **Expected Time Complexity:** N/A — architecture discussion
- **Expected Space Complexity:** Bundle size targets per component (e.g., < 5KB gzipped for a Button component including its accessible focus management logic)
- **Hints:** Headless UI / Radix UI / Ark UI as reference implementations of "unstyled accessible primitives + bring your own styles"; design tokens as the theming primitive (CSS custom property trees that can be entirely swapped per brand); automated accessibility testing via `axe-core` integrated into your Storybook/component tests.
- **Edge Cases:** A breaking API change to a "foundation" component used by 50 teams — discuss: codemods (automated AST-based code transformations that migrate consuming code), deprecation warnings with a timeline, running the old and new API simultaneously (dual exports) during a migration window, vs a hard cutover with announcement and migration guide.

### Q287
- **Difficulty:** Staff
- **Topic:** System Design for Frontend
- **Problem Statement:** Design a frontend MICRO-FRONTEND architecture for a large e-commerce platform where multiple teams (Search, Product Detail, Cart, Checkout, Account) own separate vertical slices of the UI and deploy INDEPENDENTLY without coordinating release schedules. Choose and justify one of the three main composition strategies: (a) Build-time composition (a "shell" app imports micro-frontends as npm packages — simple, type-safe, but requires coordinated deployments for updates), (b) Runtime composition via Module Federation (webpack 5 or native ESM import maps — teams deploy independently and the shell dynamically loads each MFE's LATEST version at runtime), (c) Server-side composition (an edge/BFF assembles HTML fragments from multiple services before sending to the browser — simpler for SEO, avoids client-side module federation complexity). Discuss: shared dependencies (React, a design system — how to ensure both the shell AND MFEs use the SAME React instance to avoid "two Reacts" hook errors), cross-MFE communication (events via `CustomEvent`/`BroadcastChannel`, or a shared Redux store), and independent deployments with version negotiation.
- **Expected Time Complexity:** N/A
- **Expected Space Complexity:** Discuss bundle duplication risk (each MFE bundling its own React if singletons aren't correctly shared = larger total page weight)
- **Hints:** Module Federation's `shared` configuration in webpack explicitly designates packages as singletons (only ONE instance loaded, whichever version first loaded "wins" if versions differ — discuss version range compatibility as a constraint on the shared deps); import maps (native browser feature, no bundler needed) assign a global URL to each bare specifier, achieving the same singleton guarantee at the browser level.
- **Edge Cases:** Two MFEs requiring INCOMPATIBLE versions of a shared library (e.g., Cart needs React 18 features while a legacy MFE still uses React 17 APIs) — no silver bullet; discuss: "bring the legacy MFE up to React 18" migration path vs "run it in an iframe with full isolation" (the iframe approach breaks cross-MFE communication but guarantees zero interference), and the organizational governance question of who owns the version upgrade decision.

### Q288
- **Difficulty:** Staff
- **Topic:** Scalable Applications
- **Problem Statement:** Design a CLIENT-SIDE STATE MANAGEMENT architecture for a large-scale React SPA (~500+ components, 20+ engineers, 30+ distinct pieces of global state) that addresses: (a) PERFORMANCE — prevent unnecessary re-renders when unrelated state changes (selector memoization with Reselect or Zustand's subscribe-with-selector), (b) ASYNC DATA vs LOCAL STATE separation (react-query/SWR for server state, Zustand/Redux for truly global client state — avoid storing server data in Redux just to make it "accessible everywhere"), (c) DEVTOOLS for debugging (time-travel debugging with Redux DevTools or Zustand's devtools middleware), (d) TYPESCRIPT INTEGRATION — all state slices and actions are fully typed with no `any`, (e) TESTABILITY — state logic is testable independently of UI components (pure reducer functions or store factories that accept initial state for test isolation). Justify your specific tool choices vs alternatives and discuss the key trade-offs.
- **Expected Time Complexity:** N/A — architecture discussion
- **Expected Space Complexity:** Discuss the memory impact of caching server responses in react-query (configurable via `staleTime`/`cacheTime`) vs storing everything in a Redux store indefinitely
- **Hints:** The "server state vs client state" distinction (popularized by react-query) is crucial: most "global" state in typical SPAs IS actually server state (user profile, todos, orders — data that lives on the server and must be synced); treating this as "global Redux state" leads to complex synchronization logic that react-query handles automatically (caching, refetching, background updates, optimistic updates).
- **Edge Cases:** Optimistic updates that fail server-side (the UI showed a success state but the network request failed — need to roll back the UI to the pre-optimistic state); cross-tab state synchronization for auth state (user logs out in one tab — other tabs should reflect logout without requiring a reload, per Q107's BroadcastChannel discussion); hydrating client-side state from server-rendered HTML for SSR/SSG pages.

### Q289
- **Difficulty:** Staff
- **Topic:** Scalable Applications
- **Problem Statement:** Design a REAL-TIME NOTIFICATION SYSTEM for a web application (e.g., a project management tool like Jira/Linear) that delivers notifications to online users with <1 second latency. Choose and justify the transport mechanism among: (a) Long-polling (simple, works everywhere, high server resource consumption per user), (b) Server-Sent Events (SSE) (HTTP-based, unidirectional server→client, auto-reconnect built in, works through HTTP/2 multiplexing, doesn't require WebSocket upgrade — appropriate when client→server messaging goes through separate REST calls), (c) WebSockets (bidirectional, lowest latency for bidirectional use cases, requires sticky sessions or a pub-sub relay for horizontal scaling). Implement a simple SSE client handler `createSSEConnection(url, onMessage)` with automatic exponential-backoff reconnection. Discuss the SCALING challenge: with 100,000 concurrent SSE connections, how do you ensure that when event X occurs (e.g., "ticket updated"), only the 200 users who have that ticket open receive the notification — describe a pub-sub architecture using Redis Pub/Sub to fan-out notifications from any backend instance to the SSE servers holding the relevant users' connections.
- **Expected Time Complexity:** O(1) per notification delivery (from the frontend's perspective); O(subscribers) at the backend pub-sub level
- **Expected Space Complexity:** One persistent SSE connection per open browser tab — discuss connection pooling for users with multiple tabs open (shared worker managing a single SSE connection, distributing messages to each tab via BroadcastChannel — relate to Q107).
- **Hints:** The `EventSource` API natively supports SSE with automatic reconnection; for custom reconnect logic with backoff (which `EventSource` doesn't natively support for custom intervals), wrap `fetch` with a streaming response reader, implementing reconnect with `Last-Event-ID` tracking manually.
- **Edge Cases:** The SSE connection dropping silently (some proxies/load balancers close idle TCP connections after a timeout — the server should send periodic heartbeat/comment events `": heartbeat\n\n"` to prevent this; the client should detect "no events for N seconds" as a reconnection trigger), a notification arriving WHILE the SSE connection is down and reconnecting (the client should include `Last-Event-ID` in the reconnect request so the server can replay missed events — requires the server to maintain a short event buffer).

### Q290
- **Difficulty:** Staff
- **Topic:** System Design for Frontend
- **Problem Statement:** Design a WEB ANALYTICS SDK for first-party analytics (think: a simplified Google Analytics / Amplitude / Mixpanel that your own backend ingests) that can be embedded in any web application. Requirements: (a) auto-capture page views (SPA-aware, listening to History API changes), (b) auto-capture clicks on elements with `data-analytics` attributes, (c) explicit event tracking API `analytics.track('purchase', { amount, currency })`, (d) BATCHING — collect events and flush them in batches every 5 seconds or when the batch reaches 50 events or when the page unloads (using `sendBeacon` for the unload flush to ensure delivery even during tab close), (e) SAMPLING — only track 1% of users for high-frequency page-view-heavy apps (configurable), (f) SESSION MANAGEMENT with cross-tab session identity (using a `sessionStorage`-like mechanism that's still cross-tab within the same session), (g) ANONYMOUS → KNOWN USER IDENTITY LINKING when a user logs in (`analytics.identify(userId)`).
- **Expected Time Complexity:** O(1) per event capture; O(b) per batch flush where b = batch size
- **Expected Space Complexity:** O(b) for the in-memory event buffer; bounded by the configured batch size cap
- **Hints:** `navigator.sendBeacon(url, data)` sends a request asynchronously even when the page is unloading (unlike `fetch` which may be cancelled on beforeunload); sample at the SDK initialization time (assign a random number, persist in localStorage for session continuity) — don't sample per-event (or the 1% of captured events won't form coherent user sessions).
- **Edge Cases:** The sendBeacon payload size limit (typically 64KB — a large batch of rich events could exceed this; split into multiple `sendBeacon` calls or fall back to a sync XHR for the overflow), adblock / privacy-focused browsers blocking the analytics endpoint (the SDK should fail silently, not crash the host application), multiple instances of the SDK accidentally initialized (common when the host app is a micro-frontend — implement a global guard and singleton pattern so only the first initialization takes effect, subsequent ones log a warning and no-op).

### Q291
- **Difficulty:** Hard
- **Topic:** React-oriented JavaScript Concepts
- **Problem Statement:** Explain React's RECONCILIATION algorithm (the "Fiber" architecture): how React's virtual DOM diffing works (the heuristics: O(n) with same-level-only comparison, key-based identity for lists, bailing out when element type changes). Then explain the difference between CONCURRENT MODE rendering (React 18's default) and LEGACY synchronous rendering: how concurrent mode allows React to INTERRUPT, PAUSE, and RESUME rendering work (via Fiber's time-sliced scheduler), enabling features like `useTransition` (marking an update as "non-urgent" to prevent blocking the UI during heavy re-renders) and `startTransition`. Implement a demonstration component showing the VISIBLE difference between a list filtered with vs without `useTransition` on a 10,000-item list.
- **Expected Time Complexity:** Rendering O(n) for n components; filtering O(items × filter_cost); `useTransition` doesn't reduce TOTAL work but improves responsiveness by deferring non-urgent work
- **Expected Space Complexity:** O(n) for the virtual DOM tree; O(fiber_tree_depth) for the work-in-progress tree during interrupted renders
- **Hints:** With synchronous rendering + no `useTransition`: fast typing in a filter input feels "janky" because EVERY keystroke triggers a synchronous re-render of all 10,000 rows before the input visually updates; with `useTransition`, React updates the input value synchronously (urgent) and defers the filtered list re-render (non-urgent), making the input feel instantly responsive even while the heavy re-render is in progress.
- **Edge Cases:** `useTransition` is NOT suitable for state updates that SHOULD feel instant even when expensive (e.g., a toggle switch — use `useDeferredValue` for the derived/expensive part while keeping the toggle state update urgent), an effect that READS the "non-urgent" state that's in a pending transition (it sees the OLD state until the transition commits — can cause visual inconsistencies if not accounted for in component design).

### Q292
- **Difficulty:** Hard
- **Topic:** React-oriented JavaScript Concepts
- **Problem Statement:** Implement a React `useEventCallback` hook that returns a stable function reference (never changes between renders, so it's safe to use in dependency arrays of `useEffect`/`useCallback` without causing infinite loops) while always closing over the LATEST render's values (the opposite of `useCallback`, which captures stale values if dependencies are missing or a stable reference if dependencies are correct but might cause stale-closure bugs when dependencies are incorrectly specified). Explain WHY this is sometimes needed (event handlers in effects, animation frame callbacks) and the UNDERLYING mechanism (`useRef` to store the latest callback version, updating it synchronously during render via `useLayoutEffect`, and the returned stable wrapper calling the ref's current value).
- **Expected Time Complexity:** O(1)
- **Expected Space Complexity:** O(1)
- **Hints:** `const callbackRef = useRef(callback); useLayoutEffect(() => { callbackRef.current = callback; }); return useCallback((...args) => callbackRef.current(...args), [])` — the outer `useCallback([], [])` makes the wrapper stable (never changes reference); the inner `callbackRef.current` always points to the LATEST callback.
- **Edge Cases:** Calling the stable wrapper DURING RENDER (before the `useLayoutEffect` fires to update the ref) — it would call the PREVIOUS render's callback, not the current one; document that `useEventCallback` is for EVENT HANDLERS (called after render commits) not for calling during render, and that React's upcoming `useEffectEvent` (React Canary/experimental) solves this pattern natively with proper guarantees.

### Q293
- **Difficulty:** Staff
- **Topic:** React-oriented JavaScript Concepts
- **Problem Statement:** Design a type-safe, ZERO-RUNTIME-OVERHEAD data-fetching layer for React that integrates with TypeScript's type system at the ROUTE level: given a route definition with a LOADER function (like React Router v6's loaders), the component for that route should automatically know the EXACT type returned by the loader WITHOUT manual type annotation — `const data = useLoaderData()` should infer `data` as exactly the return type of the route's loader. Implement a minimal routing/data-fetching abstraction (`createRoute({ path, loader, component })`) where the `useLoaderData` hook within the `component` is automatically typed based on the `loader`'s return type, enforced at compile time by TypeScript generics threading the type from the loader through the route definition to the hook's return type.
- **Expected Time Complexity:** O(1) per hook call
- **Expected Space Complexity:** O(1) per route's cached loader data
- **Hints:** Store the route's typed data in a React context where the CONTEXT VALUE TYPE is parameterized by the route's loader return type; `createRoute<L extends () => any>` captures the loader type `L`, and returns a `useLoaderData` hook whose return type is `Awaited<ReturnType<L>>` — the resolved value of whatever promise the loader returns.
- **Edge Cases:** A loader that returns different shapes based on conditions (`return auth ? { user: User } : { redirect: string }` — the hook's return type correctly becomes `{ user: User } | { redirect: string }`, and the component must handle both cases with type narrowing); a route with NO loader (the hook should return `undefined` or not exist on the returned route object — use function overloads or a separate `createRouteWithLoader` vs `createRouteWithoutLoader` to maintain type safety even for this case).

### Q294
- **Difficulty:** Staff
- **Topic:** React-oriented JavaScript Concepts
- **Problem Statement:** Explain and demonstrate React's SUSPENSE and CONCURRENT FEATURES in depth: (1) `Suspense` as a mechanism for declaratively handling async loading states (any component can "suspend" by THROWING a promise, which Suspense catches and shows a fallback until the promise resolves — relate to how `use(promise)` works in React 19), (2) `React.lazy` for code splitting (lazy-loaded components suspend until their chunk loads), (3) `Suspense` with data fetching (the "render-as-you-fetch" pattern vs "fetch-then-render" — how Suspense enables starting the fetch BEFORE the component needs to render, eliminating waterfall loading), (4) `useDeferredValue` as a primitive for "keep showing the old stale value while the expensive new render is in progress" (similar to debouncing but integrated with React's scheduler), and (5) how `SuspenseList` (experimental) coordinates MULTIPLE suspended children to prevent "popcorn loading" (components loading one by one, causing layout shifts). Implement a `searchResults` component that demonstrates the render-as-you-fetch pattern, initiating the fetch at the USER INTERACTION event (the keypress) and rendering via Suspense rather than initiating the fetch INSIDE the component during render.
- **Expected Time Complexity:** Fetch latency reduction: render-as-you-fetch starts the request earlier than fetch-on-render (which waits for the component to mount before fetching), reducing perceived load time by the time difference between the user interaction and the component's first render
- **Expected Space Complexity:** O(1) per resource's cached promise
- **Hints:** The "resource" pattern for Suspense: `const resource = fetchSearchResults(query)` (initiated at event time); inside the component, `const results = resource.read()` — where `resource.read()` throws the resource's promise if not yet resolved, or returns the value if resolved; `use(resource.promise)` in React 19 is the standardized version of this pattern.
- **Edge Cases:** A component that suspends indefinitely (the promise never resolves) — the `Suspense` fallback shows forever; implement a timeout via `Promise.race([resource, timeoutPromise])` where `timeoutPromise` resolves to an error after N ms, switching the Suspense from "loading" to "error" state (captured by an Error Boundary), rather than leaving the user staring at a spinner forever.

### Q295
- **Difficulty:** Staff
- **Topic:** React-oriented JavaScript Concepts
- **Problem Statement:** Implement a production-grade FORM LIBRARY CORE in TypeScript/React (the internal logic, not the UI components) inspired by React Hook Form's architecture. It should: track field values, errors, dirty/touched states, and validation status; support SCHEMA VALIDATION (accepting a Zod schema, a Yup schema, or a custom validator function — dependency-injected, not hard-coded to any specific library); implement FIELD ARRAYS (dynamic lists of fields, supporting add/remove/reorder with minimal re-renders); minimize re-renders by using UNCONTROLLED INPUTS with `refs` for field registration (registering each field via a `register(name)` function that returns `{ ref, onChange, onBlur, name }` to spread onto `<input>`) rather than React state per field (avoiding re-render on every keystroke); and provide `handleSubmit(fn)` that runs validation and calls `fn` only if valid.
- **Expected Time Complexity:** O(1) per field registration and keystroke; O(v × f) for full validation where v = validators, f = fields
- **Expected Space Complexity:** O(f) for storing form state (values, errors, dirty flags) for f fields
- **Hints:** React Hook Form's key insight: use a `Map<string, ref>` to track field DOM references and READ values directly from the DOM (`ref.current.value`) during validation and submit rather than keeping a React state mirror — this eliminates the "re-render on every keystroke" problem completely; only update React state (and re-render) when errors change, form is submitted, or explicitly needed for watched fields.
- **Edge Cases:** Field arrays with DYNAMIC names (e.g., `items.0.name`, `items.1.name`) that must be correctly tracked even as items are added/removed mid-array (indices shift — removing item 0 means item 1 becomes item 0; all cached values and errors must be reindexed or a non-index-based key must be used to maintain identity through reorders), a field that is CONDITIONALLY rendered (the field unmounts and remounts — should its value be preserved between unmounts or reset? React Hook Form provides a `shouldUnregister` option — implement both behaviors).

### Q296
- **Difficulty:** Staff
- **Topic:** React-oriented JavaScript Concepts
- **Problem Statement:** Design and implement an OPTIMISTIC UI library for React — a reusable system for applying optimistic updates to any mutation (not tied to a specific state manager), supporting: (1) `useOptimistic(state, reducer)` — a hook that applies optimistic deltas to local state immediately while the async mutation is pending (similar to React 19's experimental `useOptimistic`), (2) ROLLBACK on failure (restoring the pre-optimistic state and showing an error), (3) handling MULTIPLE CONCURRENT optimistic updates correctly (a user submits two comments quickly in succession — both should appear optimistically, and each should independently commit or roll back without affecting the other), and (4) RETRY on failure (showing a "failed to post — retry?" UI and allowing re-submission using the same optimistic delta). Demonstrate with a real-time comment feed as the use case.
- **Expected Time Complexity:** O(1) per optimistic update application; O(p) for reconciling p in-flight optimistic updates on commit/rollback
- **Expected Space Complexity:** O(p) for the pending optimistic update queue
- **Hints:** Key data structure: an ordered list of `{ id, delta, status: 'pending' | 'committed' | 'failed' }` optimistic entries applied in ORDER on top of the "true" committed state; on each render, the visible state = committed state + all pending deltas applied in order; when an entry's mutation commits (succeeds), mark it `'committed'` (the server state should now reflect it); when it fails, mark `'failed'` and remove the delta from the visible state (rollback) — potentially leaving later optimistic deltas still applied if they were for DIFFERENT resources.
- **Edge Cases:** Two CONFLICTING optimistic updates (user rates an item 5 stars, then immediately changes to 3 stars before the first request completes — the second update should "win" in the UI; when the first request completes [possibly with the OLD value from before the second update started], the server state needs to be reconciled with the second request's outcome, not blindly accepted as correct), an optimistic update for a DELETED item (user deletes a comment then the deletion fails — the comment should reappear in the correct position in the list, not just be appended to the end).

---

## SECTION 47: Final Staff-Level Questions (Q297–Q300)

### Q297
- **Difficulty:** Staff
- **Topic:** System Design for Frontend
- **Problem Statement:** You are the lead frontend architect for a company migrating a 500,000-line legacy jQuery application to modern React/TypeScript. Design a STRANGLER FIG migration strategy that allows INCREMENTAL replacement of jQuery components without a big-bang rewrite, maintaining a working application at all times. Cover: (1) a top-level React root that COEXISTS with the jQuery application (both in the same page, communicating via events or a shared global state object during the transition), (2) a "wrapper component" pattern for replacing individual jQuery widgets with React components one at a time, (3) TypeScript introduction strategy (add TypeScript incrementally with `allowJs: true` and `checkJs: false` initially, enabling strictness gradually), (4) testing strategy during migration (adding tests for NEWLY-WRITTEN React code, adding regression tests for critical jQuery functionality before replacing it), (5) the DECISION FRAMEWORK for prioritization (which jQuery components to replace first — high-traffic, high-bugrate, and ones being actively changed are typically the highest ROI targets vs stable, rarely-modified utility code that works fine as-is).
- **Expected Time Complexity:** N/A — migration timeline measured in months to years, not milliseconds
- **Expected Space Complexity:** N/A
- **Hints:** The "strangler fig" pattern (from Martin Fowler) progressively wraps and eventually replaces the legacy system, like a strangler fig vine that eventually replaces the host tree; a two-way bridge layer (jQuery emitting custom events that React components can subscribe to via `useEffect`, and React dispatching custom events or updating a shared observable that jQuery components read) enables coexistence without either side needing to know the other's internals.
- **Edge Cases:** A jQuery plugin that directly manipulates the DOM in ways that conflict with React's virtual DOM diffing (e.g., a jQuery date picker that adds/removes DOM nodes inside a React-controlled element) — the solution is to use `refs` to give jQuery exclusive control of a DOM node (preventing React from diffing inside it), and using React ONLY as the container/lifecycle manager while jQuery still owns the inner DOM for that specific component until it can be fully replaced.

### Q298
- **Difficulty:** Staff
- **Topic:** Performance Optimization
- **Problem Statement:** A senior engineer's pull request adds a new feature to a heavily-used utility function used 50,000 times in the hot path of your data visualization library. The feature is correct but a code review reveals a potential performance regression — the function now creates one additional object per call. Perform a RIGOROUS performance analysis: (1) calculate the THEORETICAL memory and GC pressure impact (50,000 × average object size × calls per second × GC collection frequency), (2) design a MICROBENCHMARK using `performance.now()` or a library like `benchmark.js` that correctly accounts for JIT warm-up, GC timing variance, and the confounding effect of microbenchmark optimizations that don't reflect real-world usage (e.g., dead code elimination by the JIT if the benchmark doesn't actually USE the result), (3) propose an object POOLING solution (Q186/Q188) specific to this case, and (4) ultimately RECOMMEND whether to optimize, explaining when "perfect" performance comes at too high a cost in code complexity for the actual measured impact.
- **Expected Time Complexity:** Discussion-based; the MEASURED baseline must inform the decision, not theoretical concerns alone
- **Expected Space Complexity:** Discussion-based
- **Hints:** The correct recommendation is often "don't optimize yet" — measure first; 50,000 small short-lived objects PER SECOND might be perfectly handled by V8's young-gen GC with negligible real-world impact (sub-millisecond GC pauses), vs causing 5ms pauses once per minute — the difference only becomes clear from an actual profiling run, not theoretical analysis alone.
- **Edge Cases:** The microbenchmark showing a 30% slowdown but real-world profiling on actual user data showing < 1ms difference per user interaction (the hotpath runs far less frequently in practice than the microbenchmark's tight loop suggested) — emphasize that microbenchmarks measure MICROBENCHMARK PERFORMANCE, not application performance; always validate with realistic workloads.

### Q299
- **Difficulty:** Staff
- **Topic:** Advanced TypeScript
- **Problem Statement:** You are designing the TypeScript type system for a QUERY BUILDER library (extending Q204's builder pattern) that generates FULLY TYPE-SAFE SQL-like queries at runtime, where the return type of `execute()` is STATICALLY INFERRED from the query operations performed. Specifically: `db.from<User>().select('id', 'name').where('age > 18').execute()` should return `Promise<Pick<User, 'id' | 'name'>[]>` — exactly the columns selected, with no extra properties and no manual annotation. Extend the system to support: typed JOINs (`from<User>().join<Post>('userId', '=', 'id').select('User.name', 'Post.title')` returning `{ name: string, title: string }[]`), typed aggregations (`select(count('id').as('userCount'))` returning `{ userCount: number }[]`), and type-safe ORDER BY (only accepting strings that are KEYS of the currently selected fields). This is staff/principal-level TypeScript work combining template literal types, mapped types, variadic generics, and conditional types.
- **Expected Time Complexity:** O(1) at runtime per query method call; compile-time type checking overhead proportional to query complexity
- **Expected Space Complexity:** O(1) per query builder instance
- **Hints:** Track the selected columns as a TYPE-LEVEL SET (a union of string literals) accumulating through the builder chain; `Pick<T, SelectedCols>` as the return type of `execute()`; for JOINs, track MULTIPLE source types and their aliased column names at the type level using intersection and template literal types (`'User.name' | 'Post.title'`); the `as` method on aggregations replaces the aggregated expression with a NEW string key in the type-level column set.
- **Edge Cases:** Calling `select()` multiple times (should it ACCUMULATE columns or REPLACE the previous selection — define and implement consistently), `select()` with a column name that's NOT a key of the source type (compile-time error), `execute()` before `from()` (should not be callable — relate to Q204's prerequisite type enforcement), a SELECT of `*` (all columns — how to represent this in the type system when the column set might not be known until runtime for dynamic selects, and when it IS known from the type parameter for typed selects).

### Q300
- **Difficulty:** Staff
- **Topic:** System Design for Frontend
- **Problem Statement:** You are the principal engineer setting the technical direction for a frontend platform team supporting 200 engineers across 15 product squads. Propose a comprehensive DEVELOPER EXPERIENCE (DX) platform strategy covering: (1) a MONOREPO setup with a workspace tool (Turborepo, Nx, or similar) that achieves <30-second incremental builds even for a 500-package repo via aggressive caching and dependency graph analysis, (2) a LOCAL DEVELOPMENT ENVIRONMENT that auto-provisions all required backend services via Docker Compose or devcontainers (no "works on my machine" for dependencies), (3) a CODE GENERATION system for common patterns (scaffolding a new React component with story, test, and type definition via a single CLI command), (4) an AUTOMATED UPGRADE SYSTEM using codemods (AST transformations) to apply framework/library breaking changes across all packages, reducing manual migration effort from weeks to hours, (5) OBSERVABILITY for the BUILD SYSTEM itself (tracking build times, test suite duration, flaky test rate per squad — with dashboards and regression alerts when a squad's build time degrades beyond a threshold), and (6) a CONTRIBUTION GUIDE and INNER SOURCE model (allowing any engineer to contribute to platform libraries, with a lightweight RFC process for significant changes to avoid the platform becoming a bottleneck). Discuss the key ORGANIZATIONAL challenges (the platform team serving as an "internal product team" with engineer-users who have real needs and constraints, the balance between standardization/consistency and team autonomy for specific needs, and how to avoid building a monolith-in-a-monorepo by maintaining genuine module boundaries).
- **Expected Time Complexity:** N/A — organizational and technical strategy question
- **Expected Space Complexity:** N/A
- **Hints:** The most impactful DX investment is often the FEEDBACK LOOP speed: fast local builds (sub-second HMR), fast CI (< 5 minutes for most PRs via remote caching and affected-only runs), and fast test suites (parallel execution, no unnecessary global setup). An engineer who sees results in seconds iterates faster and with more confidence than one who waits 10 minutes per change.
- **Edge Cases:** A squad that has LEGITIMATE reasons to deviate from the platform standard (e.g., a mobile-web squad that needs a build configuration optimized for their specific bundle size constraints that conflicts with the standard config) — the platform should be EXTENSIBLE (support escape hatches with clear documentation on the trade-offs) rather than PRESCRIPTIVE to the point of blocking valid use cases; the RFC process exists precisely to surface these tensions early and incorporate valid exceptions into the platform as first-class features rather than ad-hoc workarounds.

---

*End of 300-Question JavaScript/TypeScript Mastery Curriculum*

---

## Quick Reference Index

| Q# Range | Section |
|---|---|
| Q1–Q8 | JavaScript Fundamentals |
| Q9–Q14 | Variables and Scope |
| Q15–Q19 | Hoisting |
| Q20–Q26 | Closures |
| Q27–Q33 | Prototype & Inheritance |
| Q34–Q40 | Objects |
| Q41–Q48 | Arrays |
| Q49–Q55 | Functions |
| Q56–Q60 | ES6+ |
| Q61–Q65 | Destructuring |
| Q66–Q69 | Spread & Rest |
| Q70–Q73 | Modules |
| Q74–Q82 | Promises |
| Q83–Q88 | Async/Await |
| Q89–Q92 | Event Loop |
| Q93–Q95 | Microtasks vs Macrotasks |
| Q96–Q102 | DOM |
| Q103–Q108 | Browser APIs |
| Q109–Q112 | Fetch API |
| Q113–Q117 | Storage & Cookies |
| Q118–Q121 | Debouncing |
| Q122–Q125 | Throttling |
| Q126–Q130 | Memoization |
| Q131–Q138 | Functional Programming |
| Q139–Q145 | OOP |
| Q146–Q151 | SOLID Principles |
| Q152–Q161 | Design Patterns |
| Q162–Q168 | Error Handling |
| Q169–Q177 | Performance Optimization |
| Q178–Q183 | Memory Management |
| Q184–Q188 | Garbage Collection |
| Q189–Q196 | Security |
| Q197–Q205 | TypeScript Basics |
| Q206–Q212 | Advanced TypeScript |
| Q213–Q218 | Generics |
| Q219–Q222 | Utility Types |
| Q223–Q226 | Mapped Types |
| Q227–Q230 | Conditional Types |
| Q231–Q234 | Type Inference |
| Q235–Q240 | Advanced Types |
| Q241–Q246 | Data Structures — Arrays |
| Q247–Q252 | Data Structures — Linked Lists |
| Q253–Q257 | Stacks & Queues |
| Q258–Q262 | Hash Tables |
| Q263–Q270 | Trees |
| Q271–Q275 | Graphs |
| Q276–Q277 | Recursion |
| Q278–Q284 | Dynamic Programming |
| Q285 | Real-Time System Design |
| Q286–Q290 | System Design & Scalable Apps |
| Q291–Q296 | React-Oriented Concepts |
| Q297–Q300 | Staff-Level Capstone |
