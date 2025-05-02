// Copyright 2025-2025 kokiriglade. MIT license.

import type { Func } from "@kokiri/types";
import { assert } from "@std/assert";

/**
 * Maximum 16-bit integer value (2^15-1).
 */
export const MAX_SHORT = (2 ** 15) - 1;

/**
 * Minimum 16-bit integer value (-2^15).
 */
export const MIN_SHORT = -(2 ** 15);

/**
 * A number coerced to be a 16-bit integer.
 */
export type Short = number & { __brand: "int16" };

/**
 * Asserts that `n` is an Int16, and throws if not.
 */
export function assertShort(n: number): asserts n is Short {
    assert(
        isShort(n),
        `${n} is not a java-style short`,
    );
}

/**
 * Checks if `n` is a valid 16-bit integer.
 */
export function isShort(n: number): n is Short {
    return Number.isInteger(n) &&
        n >= MIN_SHORT &&
        n <= MAX_SHORT;
}

/**
 * Coerces `n` to a short (16-bit integer) using `fn` and wraps on overflow.
 */
export function asShort(
    n: number,
    fn: Func<number, number> = Math.trunc,
): Short {
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
    // keeps lowest 16 bits, sign-extends from bit 15
    return (rounded << 16 >> 16) as Short;
}
