// Copyright 2025-2025 kokiriglade. MIT license.

/**
 * A function that takes a value of type `T` and returns a value of type `U`.
 *
 * @template T Input type
 * @template U Output type
 * @param t Value to be transformed
 * @returns Result of type U
 */
export type Func<T, U> = (t: T) => U;
