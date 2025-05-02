// Copyright 2025-2025 kokiriglade. MIT license.

/**
 * Utilities for converting numbers to type-safe 32-bit floating points.
 *
 * @example
 * ```ts
 * import { isFloat, assertFloat, asFloat } from "@kokiri/java-primitives/float";
 * import { assertFalse, assertStrictEquals } from "@std/assert";
 *
 * // assertFloat only accepts values exactly representable as float
 * assertFloat(1.5);
 * assertFalse(isFloat(0.1));
 *
 * // asFloat rounds to the nearest IEEE-754 float32
 * assertStrictEquals(asFloat(0.1), new Float32Array([0.1])[0]);
 * assertStrictEquals(asFloat(-1.337), new Float32Array([-1.337])[0]);
 * assertStrictEquals(asFloat(Infinity), Infinity);
 * ```
 *
 * @module
 */
export * from "./float.ts";
