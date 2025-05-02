// Copyright 2025-2025 kokiriglade. MIT license.

/**
 * Utilities for converting numbers to type-safe integers.
 *
 * @example
 * ```ts
 * import { isInteger, assertInteger, asInteger } from "@kokiri/java-primitives/integer";
 * import { assertFalse, assertStrictEquals } from "@std/assert";
 *
 * assertInteger(42);
 * assertFalse(isInteger(3.14));
 *
 * // by default, `asInteger` will remove the numbers following the decimal point
 * // this is what casting to an integer with Java does
 * assertStrictEquals(asInteger(3.5), 3);
 * assertStrictEquals(asInteger(-3.5), -3);
 *
 * // ...but you can pass your own coercion method if you want
 * assertStrictEquals(asInteger(3.5, Math.ceil), 4);
 * assertStrictEquals(asInteger(-3.5, Math.ceil), -3);
 * ```
 *
 * @module
 */
export * from "./integer.ts";
