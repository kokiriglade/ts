// Copyright 2025-2025 kokiriglade. MIT license.

import type { Func } from "@kokiri/types";
import { assert } from "@std/assert";

/**
 * Maximum integer value (2^31-1).
 */
export const MAX_INTEGER = (2 ** 31) - 1;

/**
 * Minimum integer value (-2^31)
 */
export const MIN_INTEGER = -(2 ** 31);

/**
 * A number coerced to be an integer.
 */
export type Integer = number & { __brand: "int32" };

/**
 * Asserts that `n` is an Integer, and throws an `AssertionError` if not.
 * @param n the number
 * @throws Error if `n` is not an Integer
 */
export function assertInteger(n: number): asserts n is Integer {
    assert(isInteger(n), `${n} is not a java-style integer`);
}

/**
 * Checks if `n` is an integer
 * @param n the number
 * @return `true` if `n` is an Integer; `false` otherwise
 */
export function isInteger(n: number): n is Integer {
    return Number.isInteger(n) &&
        n >= MIN_INTEGER &&
        n <= MAX_INTEGER;
}

/**
 * Coerces `n` to an Integer using `fn` and wraps on overflow.
 * @param n the number
 * @param fn the conversion function. Defaults to {@link Math#trunc}, which will move negative values towards zero
 * @return `n` as an integer
 */
export function asInteger(
    n: number,
    fn: Func<number, number> = Math.trunc,
): Integer {
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
    return (rounded | 0) as Integer;
}
