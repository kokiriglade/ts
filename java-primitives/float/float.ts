// Copyright 2025-2025 kokiriglade. MIT license.

import { assert } from "@std/assert";

/**
 * Maximum 32-bit float value (≈3.4028235e38).
 */
export const MAX_FLOAT = 3.4028235e38;

/**
 * Minimum (most negative) 32-bit float value (≈-3.4028235e38).
 */
export const MIN_FLOAT = -3.4028235e38;

/**
 * A number coerced to be a 32-bit float.
 */
export type Float = number & { __brand: "float32" };

/**
 * Asserts that `n` is exactly representable as a 32-bit float.
 * @throws Error if not
 */
export function assertFloat(n: number): asserts n is Float {
    assert(isFloat(n), `${n} is not a float`);
}

/**
 * Checks whether `n` exactly matches its 32-bit float equivalence.
 */
export function isFloat(n: number): n is Float {
    // NaN round-trips through Float32Array as NaN
    if (Number.isNaN(n)) return true;
    const f = new Float32Array([n])[0];
    return f === n;
}

/**
 * Coerces `n` to a 32-bit float (rounding to the nearest representable value).
 */
export function asFloat(n: number): Float {
    // this will round, overflow to ±Infinity, or produce NaN as needed
    const f = new Float32Array([n])[0];
    return f as Float;
}
