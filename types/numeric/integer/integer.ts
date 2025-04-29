// Copyright 2025-2025 kokiriglade. MIT license.

import type { Func } from "../../mod.ts";
import { assert } from "@std/assert";

/**
 * A number coerced to be an integer.
 */
export type Integer = number & { __brand: "int" };

/**
 * A number coerced to be a safe integer.
 */
export type SafeInteger = Integer & { __brand: "safe-int" };

/**
 * Asserts that `n` is an Integer, and throws an error if not.
 * @param n the number
 * @throws Error if `n` is not an Integer
 */
export function assertInteger(n: number): asserts n is Integer {
    assert(isInteger(n), `${n} is not an integer`);
}

/**
 * Checks if `n` is an integer
 * @param n the number
 * @return `true` if `n` is an Integer; `false` otherwise
 */
export function isInteger(n: number): n is Integer {
    return Number.isInteger(n);
}

/**
 * Asserts that `n` is an Integer, and throws an error if not
 * @param n the number
 * @throws Error if `n` is not an Integer
 */
export function assertSafeInteger(n: number): asserts n is SafeInteger {
    assert(isSafeInteger(n), `${n} is not a safe integer`);
}

/**
 * Checks if `n` is an Integer
 * @param n the number
 * @return `true` if `n` is an Integer; `false` otherwise
 */
export function isSafeInteger(n: number): n is SafeInteger {
    return Number.isSafeInteger(n);
}

/**
 * Converts `n` to an Integer using `fn`.
 * @param n the number
 * @param fn the conversion function. Defaults to {@link Math#trunc}, which will move negative values towards zero
 * @return `n` as an integer
 */
export function asInteger(
    n: number,
    fn: Func<number, number> = Math.trunc,
): Integer {
    const converted = fn(n);
    assertInteger(converted);
    return converted;
}
