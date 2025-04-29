// Copyright 2025-2025 kokiriglade. MIT license.

import type { Supplier } from "@kokiri/types";

class LazyImpl<T> implements Lazy<T> {
    #value: T | undefined;
    readonly #fn: Supplier<T>;

    constructor(fn: Supplier<T>) {
        this.#fn = fn;
    }

    get hasValue(): boolean {
        return this.#value !== undefined;
    }

    get value(): T {
        if (!this.hasValue) {
            this.#value = this.#fn();
        }
        return this.#value as T;
    }
}

/**
 * Represents a lazy value. The value is computed upon first access and cached for future use.
 * @template T the type of the value
 */
export interface Lazy<T> {
    /**
     * Gets if a value has been computed yet.
     * @return true if the value has been computed
     */
    hasValue: boolean;
    /**
     * Gets the value. If the value is unset, it is computed and cached.
     * @return the computed value
     */
    value: T;
}

/**
 * Creates a lazy value.
 * @template T the type of the value
 * @param fn the function that computes the value
 * @return a Lazy wrapper around the function
 */
export function lazy<T>(fn: Supplier<T>): Lazy<T> {
    return new LazyImpl(fn);
}

/**
 * Type guard to check if an object is a Lazy.
 * @param obj value to test
 * @return true if obj implements the Lazy interface
 */
export function isLazy(obj: unknown): obj is Lazy<unknown> {
    return (
        typeof obj === "object" &&
        obj !== null &&
        "hasValue" in obj &&
        // deno-lint-ignore no-explicit-any
        typeof (obj as any).hasValue === "boolean"
    );
}
