// Copyright 2025-2025 kokiriglade. MIT license.

/**
 * Provides useful TypeScript types in order to avoid repetition.
 *
 * @example Nullable
 * ```ts
 * import type { Nullable } from "@kokiri/types";
 * import { assertEquals } from "@std/assert";
 *
 * function mightReturnNull(threshold = 0.5): Nullable<number> {
 *     const num = Math.random();
 *
 *     if (num > threshold) {
 *         return num;
 *     }
 *     return null;
 * }
 *
 * const alwaysReturnsValue = mightReturnNull(0);
 * assertEquals(typeof alwaysReturnsValue, "number");
 *
 * const alwaysReturnsNull = mightReturnNull(1);
 * assertEquals(alwaysReturnsNull, null);
 * ```
 *
 * @example Func
 * ```ts
 * import type { Func } from "@kokiri/types";
 * import { assertEquals } from "@std/assert";
 *
 * const double: Func<number, number> = (n) => n * 2;
 *
 * const numberToString: Func<number, string> = (n) => n.toString();
 *
 * const doubleAndStringify: Func<number, string> = (n) => numberToString(double(n));
 *
 * assertEquals(double(5), 10);
 * assertEquals(numberToString(42), "42");
 * assertEquals(doubleAndStringify(7), "14");
 * ```
 *
 * @example Consumer
 * ```ts
 * import type { Consumer } from "@kokiri/types";
 * import { assertEquals } from "@std/assert";
 *
 * const addToArray = <T>(array: T[]): Consumer<T> => (item) => {
 *     array.push(item);
 * };
 *
 * const numbers: number[] = [];
 * const addNumber = addToArray(numbers);
 *
 * addNumber(1);
 * addNumber(2);
 * addNumber(3);
 *
 * assertEquals(numbers, [1, 2, 3]);
 * ```
 *
 * @example Supplier
 * ```ts
 * import { Supplier } from "@kokiri/types";
 * import { assertGreaterOrEqual, assertLessOrEqual } from "@std/assert";
 *
 * const randomNumberGenerator = (min: number, max: number): Supplier<number> => () => {
 *     return Math.floor(Math.random() * (max - min + 1)) + min;
 * };
 *
 * const getRandom = randomNumberGenerator(1, 10);
 * const randomValue = getRandom();
 *
 * assertGreaterOrEqual(randomValue, 1);
 * assertLessOrEqual(randomValue, 10);
 * ```
 *
 * @example Predicate
 * ```ts
 * import { Predicate } from "@kokiri/types";
 * import { assert, assertFalse } from "@std/assert";
 *
 * const isPositive: Predicate<number> = (n) => n > 0;
 *
 * const isEmpty: Predicate<string> = (s) => s.length === 0;
 *
 * const isNonEmptyString: Predicate<string> = (s) => !isEmpty(s);
 *
 * assert(isPositive(5));
 * assertFalse(isPositive(-3));
 * assert(isEmpty(""));
 * assertFalse(isEmpty("hello"));
 * assert(isNonEmptyString("world"));
 * ```
 *
 * @example Integer
 * ```ts
 * import { isInteger, assertInteger, asInteger } from "@kokiri/types/integer";
 * import { assertFalse, assertStrictEquals } from "@std/assert";
 *
 * assertInteger(42);
 * assertFalse(isInteger(3.14));
 *
 * // by default, `asInteger` will just remove the numbers following the decimal point
 * assertStrictEquals(asInteger(3.5), 3);
 * assertStrictEquals(asInteger(-3.5), -3);
 *
 * // ...but you can pass your own coercion method
 * assertStrictEquals(asInteger(3.5, Math.ceil), 4);
 * assertStrictEquals(asInteger(-3.5, Math.ceil), -3);
 * ```
 *
 * @module
 */
export * from "./func.ts";
export * from "./nullable.ts";
export * from "./consumer.ts";
export * from "./supplier.ts";
export * from "./predicate.ts";
export * from "./numeric/integer/mod.ts";
