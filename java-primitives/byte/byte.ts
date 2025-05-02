// Copyright 2025-2025 kokiriglade. MIT license.

import type { Func } from "@kokiri/types";
import { assert } from "@std/assert";

/**
 * Maximum 8-bit integer value (2^7-1).
 */
export const MAX_BYTE = (2 ** 7) - 1;

/**
 * Minimum 8-bit integer value (-2^7).
 */
export const MIN_BYTE = -(2 ** 7);

/**
 * A number coerced to be a 8-bit integer.
 */
export type Byte = number & { __brand: "int8" };

/**
 * Asserts that `n` is a Byte, and throws if not.
 */
export function assertByte(n: number): asserts n is Byte {
    assert(
        isByte(n),
        `${n} is not a java-style byte`,
    );
}

/**
 * Checks if `n` is a valid 8-bit integer.
 */
export function isByte(n: number): n is Byte {
    return Number.isInteger(n) &&
        n >= MIN_BYTE &&
        n <= MAX_BYTE;
}

/**
 * Coerces `n` to a byte (8-bit integer) using `fn` and wraps on overflow.
 */
export function asByte(
    n: number,
    fn: Func<number, number> = Math.trunc,
): Byte {
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
    return (rounded << 24 >> 24) as Byte;
}
