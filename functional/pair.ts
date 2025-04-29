// Copyright 2025-2025 kokiriglade. MIT license.

import type { Func } from "@kokiri/types";

class PairImpl<F, S> implements Pair<F, S> {
    readonly first: F;
    readonly second: S;

    constructor(first: F, second: S) {
        this.first = first;
        this.second = second;
    }

    swap(): Pair<S, F> {
        return pair(this.second, this.first);
    }

    mapFirst<F2>(fn: Func<F, F2>): Pair<F2, S> {
        return pair(fn(this.first), this.second);
    }

    mapSecond<S2>(fn: Func<S, S2>): Pair<F, S2> {
        return pair(this.first, fn(this.second));
    }
}

/**
 * A product type containing two values.
 *
 * @template F the first type
 * @template S the second type
 */
export interface Pair<F, S> {
    /**
     * Gets the first value.
     * @return the first value
     */
    first: F;

    /**
     * Gets the second value.
     * @return the second value
     */
    second: S;

    /**
     * Returns a `Pair` with the elements of this `Pair` swapped.
     * @return the swapped `Pair`
     */
    swap(): Pair<S, F>;

    /**
     * Transforms the first element of this `Pair` to another type.
     *
     * @param fn the transformation
     * @template F2 the new type of the first element
     * @return the transformed `Pair`
     */
    mapFirst<F2>(fn: Func<F, F2>): Pair<F2, S>;

    /**
     * Transforms the second element of this `Pair` to another type.
     *
     * @param fn the transformation
     * @template S2 the new type of the second element
     * @return the transformed `Pair`
     */
    mapSecond<S2>(fn: Func<S, S2>): Pair<F, S2>;
}

/**
 * Creates a {@link Pair}.
 * @template F the type of the first value
 * @template S the type of the second value
 * @return a `Pair`
 */
export function pair<F, S>(first: F, second: S): Pair<F, S> {
    return new PairImpl(first, second);
}

/**
 * Type guard to check if an object is a {@link Pair}.
 * @param obj value to test
 * @return true if obj implements the Pair interface
 */
export function isPair(obj: unknown): obj is Pair<unknown, unknown> {
    return (
        typeof obj === "object" &&
        obj !== null &&
        "first" in obj && "second" in obj
    );
}
