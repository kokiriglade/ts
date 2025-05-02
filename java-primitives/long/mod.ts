// Copyright 2025-2025 kokiriglade. MIT license.

/**
 * Utilities for converting numbers to type-safe 64-bit integers.
 *
 * @example
 * ```ts
 * import { isLong, assertLong, asLong } from "@kokiri/java-primitives/long";
 * import { assertFalse, assertStrictEquals } from "@std/assert";
 *
 * assertLong(42n);
 * assertFalse(isLong(9_223_372_036_854_775_808n));
 *
 * // by default, `asLong` will remove the numbers following the decimal point
 * assertStrictEquals(asLong(3.5), 3n);
 * assertStrictEquals(asLong(-3.5), -3n);
 *
 * // ...but you can pass your own coercion method if you want
 * assertStrictEquals(asLong(3.5, Math.ceil), 4n);
 * assertStrictEquals(asLong(-3.5, Math.ceil), -3n);
 * ```
 *
 * @module
 */
export * from "./long.ts";
