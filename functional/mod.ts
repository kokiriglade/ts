// Copyright 2025-2025 kokiriglade. MIT license.

/**
 * This module provides functional programming utilities for handling optional values, results of operations that may
 * fail, and lazy evaluation.
 *
 * @example Optional
 * ```ts
 * import { optional } from "@kokiri/functional";
 * import { assertEquals } from "@std/assert";
 *
 * const maybeValue = optional("hello");
 * if (maybeValue.isPresent) {
 *     assertEquals(maybeValue.unwrap(), "hello");
 * }
 *
 * const emptyOptional = optional();
 * assertEquals(emptyOptional.unwrapOr("default"), "default");
 * ```
 *
 * @example Result
 * ```ts
 * import { resultOk, resultError, type Result } from "@kokiri/functional";
 * import { assertEquals, fail } from "@std/assert";
 *
 * function divide(a: number, b: number): Result<number, Error> {
 *     if (b === 0) {
 *         return resultError(new Error("Division by zero"));
 *     }
 *     return resultOk(a / b);
 * }
 *
 * const result = divide(10, 2);
 * result.match({
 *     ok: value => assertEquals(value, 5),
 *     error: err => fail()
 * });
 * ```
 *
 * @example Lazy
 * ```ts
 * import { lazy } from "@kokiri/functional";
 * import { assertFalse, assert, assertEquals } from "@std/assert";
 *
 * let computed = false;
 * const expensiveComputation = lazy(() => {
 *     assertFalse(computed) // only executed once
 *     computed = true;
 *     return 42;
 * });
 *
 * assertFalse(expensiveComputation.hasValue);
 *
 * assertEquals(expensiveComputation.value, 42);
 * assert(expensiveComputation.hasValue);
 * ```
 *
 * @example Pair
 * ```ts
 * import { pair } from "@kokiri/functional";
 * import { assertFalse, assert, assertEquals } from "@std/assert";
 *
 * const p = pair(42, "answer");
 * assertEquals(p.first, 42);
 * assertEquals(p.second, "answer");
 *
 * const swapped = p.swap();
 * assertEquals(swapped.first, "answer");
 * assertEquals(swapped.second, 42);
 *
 * const mapped = p.mapFirst((n) => n * 2)
 *     .mapSecond((str) => str.toUpperCase());
 * assertEquals(mapped.first, 84);
 * assertEquals(mapped.second, "ANSWER");
 *
 * const chainedResult = pair(2, 3)
 *     .mapFirst((n) => n + 1)
 *     .mapSecond((n) => n * 3)
 *     .swap();
 *
 * assertEquals(chainedResult.first, 9);
 * assertEquals(chainedResult.second, 3);
 * ```
 * @module
 */
export { isOptional, type Optional, optional } from "./optional.ts";
export * from "./result.ts";
export * from "./lazy.ts";
export * from "./pair.ts";
