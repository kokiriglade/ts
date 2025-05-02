// Copyright 2025-2025 kokiriglade. MIT license.

/**
 * Java primitive–like type-safe numeric utilities.
 *
 * @example
 * ```ts
 * import { assert, assertFalse, assertStrictEquals } from "@std/assert";
 * import {
 *   isByte, asByte,
 *   isShort, asShort,
 *   isInteger, asInteger,
 *   isLong, asLong,
 *   isFloat, asFloat
 * } from "@kokiri/java-primitives";
 *
 * assertStrictEquals(asByte(300), 44);
 * assertFalse(isByte(128));
 *
 * assertStrictEquals(asShort(40000), -25536);
 * assertFalse(isShort(40000));
 *
 * assertStrictEquals(asInteger(5.9), 5);
 *
 * assertStrictEquals(asLong(3.14), 3n);
 *
 * assertStrictEquals(asFloat(0.1), new Float32Array([0.1])[0]);
 * assertFalse(isFloat(0.1));
 * ```
 *
 * @module
 */
export * from "./byte/mod.ts";
export * from "./short/mod.ts";
export * from "./integer/mod.ts";
export * from "./long/mod.ts";
export * from "./float/mod.ts";
