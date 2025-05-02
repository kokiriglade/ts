// Copyright 2025-2025 kokiriglade. MIT license.

import type { Func } from "@kokiri/types";
import { assert } from "@std/assert";

/**
 * Maximum long value (2^63-1).
 */
export const MAX_LONG = (2n ** 63n) - 1n;

/**
 * Minimum long value (-2^63).
 */
export const MIN_LONG = -(2n ** 63n);

/**
 * Opaque 64-bit signed integer.
 */
export type Long = bigint & { __brand: "int64" };

/**
 * Asserts that `n` is a Long, and throws if not.
 * @param n the bigint to check
 * @throws Error if `n` is not in the signed-64 range
 */
export function assertLong(n: bigint): asserts n is Long {
    assert(
        n >= MIN_LONG && n <= MAX_LONG,
        `${n} is not a java-style long`,
    );
}

/**
 * Checks if `n` is a Long.
 * @param n the bigint to test
 * @return `true` if in [MIN_LONG..MAX_LONG], else `false`
 */
export function isLong(n: bigint): n is Long {
    if (typeof n === "number") {
        throw new Error(`Not a bigint: '${n}'`);
    }
    return n >= MIN_LONG && n <= MAX_LONG;
}

/**
 * Coerces a JS `number` or `bigint` to a 64-bit signed `Long`, truncating
 * (via `fn` on numbers) and wrapping on overflow exactly like Java.
 *
 * @param n  the input value
 * @param fn conversion fn for fractional values (only used if `n` is a number)
 * @returns the wrapped 64-bit result
 * @throws if a number input is non-finite or rounds to a non-integer
 */
export function asLong(
    n: number | bigint,
    fn: Func<number, number> = Math.trunc,
): Long {
    let bi: bigint;
    if (typeof n === "bigint") {
        // got a bigint, skip rounding/finite checks
        bi = n;
    } else {
        // number path
        const rounded = fn(n);
        if (!Number.isFinite(rounded)) {
            throw new Error(
                `Rounded number '${rounded}' is not finite, unrounded: '${n}'`,
            );
        }
        if (!Number.isInteger(rounded)) {
            throw new Error(
                `Rounded number '${rounded}' is not an integer, unrounded: '${n}'`,
            );
        }
        bi = BigInt(rounded);
    }

    // mask to 64 bits and interpret as signed two's-complement
    const MASK_64 = (1n << 64n) - 1n;
    bi = bi & MASK_64;
    if (bi & (1n << 63n)) {
        bi = bi - (1n << 64n);
    }

    return bi as Long;
}
