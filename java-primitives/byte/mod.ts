// Copyright 2025-2025 kokiriglade. MIT license.

/**
 * Utilities for converting numbers to type-safe 8-bit integers.
 *
 * @example
 * ```ts
 * import { isByte, assertByte, asByte } from "@kokiri/java-primitives/byte";
 * import { assertFalse, assertStrictEquals } from "@std/assert";
 *
 * assertByte(42);
 * assertFalse(isByte(3.14));
 * assertFalse(isByte(256));
 *
 * // by default, `asByte` will remove the numbers following the decimal point
 * assertStrictEquals(asByte(3.5), 3);
 * assertStrictEquals(asByte(-3.5), -3);
 *
 * // ...but you can pass your own coercion method if you want
 * assertStrictEquals(asByte(3.5, Math.ceil), 4);
 * assertStrictEquals(asByte(-3.5, Math.ceil), -3);
 * ```
 *
 * @module
 */
export * from "./byte.ts";
