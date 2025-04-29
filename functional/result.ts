// Copyright 2025-2025 kokiriglade. MIT license.

import type { Consumer, Func, Supplier } from "@kokiri/types";
import { type Optional, optional } from "./mod.ts";

class ResultImpl<T, E extends Error> implements Result<T, E> {
    readonly #value: Optional<T>;
    readonly #error: Optional<E>;

    constructor(value: T | null, error: E | null) {
        this.#value = optional(value);
        this.#error = optional(error);
    }

    get isOk(): boolean {
        return this.#value.isPresent;
    }

    get isError(): boolean {
        return !this.isOk;
    }

    unwrap(): Optional<T> {
        return this.#value;
    }

    unwrapOr(defaultValue: T): T {
        return this.#value.unwrapOr(defaultValue);
    }

    unwrapOrThrow(fn: Supplier<Error>): T {
        return this.#value.unwrapOrThrow(fn);
    }

    unwrapOrElse(fn: Supplier<T>): T {
        return this.#value.unwrapOrElse(fn);
    }

    unwrapError(): Optional<E> {
        return this.#error;
    }

    unwrapErrorOr(defaultError: E): E {
        return this.#error.unwrapOr(defaultError);
    }

    unwrapErrorOrThrow(fn: Supplier<Error>): E {
        return this.#error.unwrapOrThrow(fn);
    }

    unwrapErrorOrElse(fn: Supplier<E>): E {
        return this.#error.unwrapOrElse(fn);
    }

    ifOk(fn: Consumer<T>): Result<T, E> {
        if (this.isOk) {
            fn(this.#value.unwrap());
        }
        return this;
    }

    ifError(fn: Consumer<E>): Result<T, E> {
        if (this.isError) {
            fn(this.#error.unwrap());
        }
        return this;
    }

    map<U>(fn: Func<T, U>): Result<U, E> {
        if (this.isOk) {
            const unwrapped = this.#value.unwrap();
            return resultOk(fn(unwrapped));
        }
        return resultError(this.#error.unwrap());
    }

    mapError<F extends Error>(fn: Func<E, F>): Result<T, F> {
        if (this.isError) {
            const errUnwrapped = this.#error.unwrap();
            return resultError(fn(errUnwrapped));
        }
        return resultOk(this.#value.unwrap());
    }

    flatMap<U>(fn: Func<T, Result<U, E>>): Result<U, E> {
        return this.isOk
            ? fn(this.#value.unwrap())
            : resultError(this.#error.unwrap());
    }

    match<U>(handlers: { ok: Func<T, U>; error: Func<E, U> }): U {
        if (this.isOk) {
            return handlers.ok(this.#value.unwrap());
        }
        return handlers.error(this.#error.unwrap());
    }
}

/**
 * Represents a computation that can succeed with a value of type `T` or fail with an error of type `E`.
 * @template T the type of the success value
 * @template E the type of the error value, must extend Error
 */
export interface Result<T, E extends Error> {
    /**
     * True if this is a success
     */
    readonly isOk: boolean;

    /**
     * True if this is an error
     */
    readonly isError: boolean;

    /**
     * Returns the success value.
     * @return an Optional containing the success value
     */
    unwrap(): Optional<T>;

    /**
     * Returns the success value or `defaultValue` if error.
     * @param defaultValue the value to return if this is an error
     * @return the success value or the default value
     */
    unwrapOr(defaultValue: T): T;

    /**
     * Returns the success value or throws an error if error.
     * @param fn the function that provides the error to throw
     * @return the success value
     * @throws the error returned by fn if this is an error
     */
    unwrapOrThrow(fn: Supplier<Error>): T;

    /**
     * Returns the success value or the result of `fn` if error.
     * @param fn the function to compute a default value
     * @return the success value or the computed default value
     */
    unwrapOrElse(fn: Supplier<T>): T;

    /**
     * Returns the error.
     * @return an Optional containing the error
     */
    unwrapError(): Optional<E>;

    /**
     * Returns the error or `defaultValue` if success.
     * @param defaultError the error to return if this is a success
     * @return the error or the default error
     */
    unwrapErrorOr(defaultError: E): E;

    /**
     * Returns the error or throws an error if success.
     * @param fn the function that provides the error to throw
     * @return the error
     * @throws the error returned by fn if this is a success
     */
    unwrapErrorOrThrow(fn: Supplier<Error>): E;

    /**
     * Returns the error or the result of `fn` if success.
     * @param fn the function to compute a default error
     * @return the error or the computed default error
     */
    unwrapErrorOrElse(fn: Supplier<E>): E;

    /**
     * Executes `fn` if this is a success, for side effects, then returns self.
     * @param fn the function to execute with the success value
     * @return this Result instance
     */
    ifOk(fn: Consumer<T>): Result<T, E>;

    /**
     * Executes `fn` if this is an error, for side effects, then returns self.
     * @param fn the function to execute with the error
     * @return this Result instance
     */
    ifError(fn: Consumer<E>): Result<T, E>;

    /**
     * Maps the success value using `fn`, leaving errors untouched.
     * @template U the type of the mapped success value
     * @param fn the function to apply to the success value
     * @return a new Result with the mapped success value or the original error
     */
    map<U>(fn: Func<T, U>): Result<U, E>;

    /**
     * Maps the error value using `fn`, leaving successes untouched.
     * @template F the type of the mapped error value, must extend Error
     * @param fn the function to apply to the error
     * @return a new Result with the mapped error or the original success value
     */
    mapError<F extends Error>(fn: Func<E, F>): Result<T, F>;

    /**
     * Chains another Result-returning function if this is a success.
     * @template U the type of the success value in the returned Result
     * @param fn the function to apply to the success value
     * @return the Result returned by fn or a Result with the original error
     */
    flatMap<U>(fn: Func<T, Result<U, E>>): Result<U, E>;

    /**
     * Matches on the result, invoking the appropriate handler.
     * @template U the type of the value returned by both handlers
     * @param handlers object containing functions to handle success and error cases
     * @return the value returned by the appropriate handler
     */
    match<U>(handlers: { ok: Func<T, U>; error: Func<E, U> }): U;
}

/**
 * Creates a success result containing `value`.
 * @template T the type of the success value
 * @template E the type of the error value, must extend Error
 * @param value the success value
 * @return a Result containing the success value
 */
export function resultOk<T, E extends Error = Error>(value: T): Result<T, E> {
    return new ResultImpl(value, null) as unknown as Result<T, E>;
}

/**
 * Creates an error result containing `error`.
 * @template T the type of the success value
 * @template E the type of the error value, must extend Error
 * @param error the error value
 * @return a Result containing the error
 * @throws TypeError if error is not an instance of Error
 */
export function resultError<T = unknown, E extends Error = Error>(
    error: E,
): Result<T, E> {
    if (!(error instanceof Error)) {
        throw new TypeError("`error` must be instanceof Error");
    }
    return new ResultImpl(null, error) as unknown as Result<T, E>;
}

/**
 * Type guard to check if an object is a Result.
 * @param obj value to test
 * @return true if obj implements the Result interface
 */
export function isResult(obj: unknown): obj is Result<unknown, Error> {
    return (
        typeof obj === "object" &&
        obj !== null &&
        // deno-lint-ignore no-explicit-any
        "isOk" in obj && (obj as any).isOk === (obj as any).isOk &&
        // deno-lint-ignore no-explicit-any
        "isError" in obj && (obj as any).isError === (obj as any).isError
    );
}
