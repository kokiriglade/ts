// Copyright 2025-2025 kokiriglade. MIT license.

import type { Consumer, Func, Nullable, Supplier } from "@kokiri/types";

// exported for testing
export class OptionalImpl<T> implements Optional<T> {
    static readonly EMPTY = new OptionalImpl<unknown>(null);

    readonly #value: Nullable<T>;

    constructor(value: Nullable<T> = null) {
        this.#value = value;
    }

    get isPresent(): boolean {
        return this.#value !== null;
    }

    unwrap(): Nullable<T> {
        return this.#value;
    }

    unwrapOr(defaultValue: T): T {
        return this.isPresent ? this.unwrapOrThrow() : defaultValue;
    }

    unwrapOrElse(fn: Supplier<T>): T {
        return this.isPresent ? this.unwrapOrThrow() : fn();
    }

    unwrapOrThrow(
        fn: Supplier<Error> = () => new Error(`Optional is empty`),
    ): T {
        if (!this.isPresent) {
            throw fn();
        }
        return this.unwrap() as T;
    }

    ifPresent(fn: Consumer<T>): void {
        if (this.isPresent) {
            fn(this.unwrapOrThrow());
        }
    }

    map<U>(mappingFunction: Func<T, U>): Optional<U> {
        return this.isPresent
            ? optional(mappingFunction(this.unwrapOrThrow()))
            : optional();
    }
}

/**
 * Represents an optional value that may or may not be present.
 * Provides methods to inspect the value and transform it safely.
 * @template T the type of value contained in the Optional
 */
export interface Optional<T> {
    /**
     * `true` if a value is present, `false` if empty
     */
    readonly isPresent: boolean;

    /**
     * Gets the contained value if present.
     * @return the contained value
     */
    unwrap(): Nullable<T>;

    /**
     * Gets the value if present, otherwise returns the provided default.
     * @param defaultValue the value to return if no value is present
     * @return the contained value or the default value
     */
    unwrapOr(defaultValue: T): T;

    /**
     * Gets the value if present, otherwise returns the result of `fn`.
     * @param fn the function to compute a default value
     * @return the contained value or the computed default value
     */
    unwrapOrElse(fn: Supplier<T>): T;

    /**
     * Gets the value if present, otherwise throws an error provided by `fn`.
     * @param fn the function that provides the error to throw
     * @return the contained value
     * @throws the error returned by fn if no value is present
     */
    unwrapOrThrow(fn?: Supplier<Error>): T;

    /**
     * Executes `fn` if a value is present.
     * @param fn the function to execute with the value
     */
    ifPresent(fn: Consumer<T>): void;

    /**
     * Applies a mapping function to the value if present, returning a new Optional of the result.
     * @template U the type of the result of the mapping function
     * @param mappingFunction the function to apply to the value
     * @return an Optional containing the result of the mapping function or empty if this Optional is empty
     */
    map<U>(mappingFunction: Func<T, U>): Optional<U>;
}

/**
 * Creates an Optional describing the given value.
 * If the value is `null` or `undefined`, returns the singleton empty Optional.
 * @template T the type of value to wrap
 * @param value the value to wrap, or `null`/`undefined` for an empty Optional
 * @return an Optional containing the value or empty if `null`/`undefined`
 */
export function optional<T>(value?: Nullable<T>): Optional<T> {
    if (value === null || value === undefined) {
        return OptionalImpl.EMPTY as Optional<T>;
    } else {
        return new OptionalImpl<T>(value);
    }
}

/**
 * Type guard to check if an object is an Optional.
 * @param obj value to test
 * @return `true` if obj implements the Optional interface
 */
export function isOptional(obj: unknown): obj is Optional<unknown> {
    return (
        typeof obj === "object" &&
        obj !== null &&
        "isPresent" in obj &&
        // deno-lint-ignore no-explicit-any
        typeof (obj as any).isPresent === "boolean"
    );
}
