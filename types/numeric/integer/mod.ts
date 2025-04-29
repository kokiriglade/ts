// Copyright 2025-2025 kokiriglade. MIT license.

/**
 * Utilities for converting numbers to type-safe integers.
 *
 * @example
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
export * from "./integer.ts";
