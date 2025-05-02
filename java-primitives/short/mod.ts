// Copyright 2025-2025 kokiriglade. MIT license.

/**
 * Utilities for converting numbers to type-safe 16-bit integers.
 *
 * @example
 * ```ts
 * import { isShort, assertShort, asShort } from "@kokiri/java-primitives/short";
 * import { assertFalse, assertStrictEquals } from "@std/assert";
 *
 * assertShort(42);
 * assertFalse(isShort(3.14));
 * assertFalse(isShort(32768));
 *
 * // by default, `asShort` will remove the numbers following the decimal point
 * assertStrictEquals(asShort(3.5), 3);
 * assertStrictEquals(asShort(-3.5), -3);
 *
 * // ...but you can pass your own coercion method if you want
 * assertStrictEquals(asShort(3.5, Math.ceil), 4);
 * assertStrictEquals(asShort(-3.5, Math.ceil), -3);
 * ```
 *
 * @module
 */
export * from "./short.ts";
