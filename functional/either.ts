// Copyright 2025-2025 kokiriglade. MIT license.

import { type Optional, optional } from "./mod.ts";
import type { Consumer } from "@kokiri/types";
import type { Func } from "../types/func.ts";

/**
 * An {@link Either} but a plain object.
 * @template L the left type
 * @template R the right type
 */
export type JSONEither<L, R> = {
    left?: L;
    right?: R;
};

/**
 * Holds a value of either the `left` or `right` type.
 * @template L the left type
 * @template R the right type
 */
export interface Either<L, R> {
    /**
     * Gets the `left` type wrapped in an {@link Optional}.
     */
    left: Optional<L>;

    /**
     * Gets the `right` type wrapped in an {@link Optional}.
     */
    right: Optional<R>;

    /**
     * Gets if this holds the `left` type.
     */
    isLeft: boolean;

    /**
     * Gets if this holds the `right` type.
     */
    isRight: boolean;

    /**
     * If this is holding the `left` type, executes the consumer.
     * @param fn the function
     */
    ifLeft(fn: Consumer<L>): Either<L, R>;

    /**
     * If this is holding the `right` type, executes the consumer.
     * @param fn the function
     */
    ifRight(fn: Consumer<R>): Either<L, R>;

    /**
     * If this is holding the `left` type, returns a new Either with the returned value.
     * @param fn the function
     * @template T the mapped left type
     */
    mapLeft<T>(fn: Func<L, T>): Either<T, R>;

    /**
     * If this is holding the `right` type, returns a new Either with the returned value.
     * @param fn the function
     * @template T the mapped right type
     */
    mapRight<T>(fn: Func<R, T>): Either<L, T>;

    /**
     * Applies `leftFn` to the left value or `rightFn` to the right value, returning a new Either with the returned
     * value.
     * @param leftFn the left function
     * @param rightFn the right function
     * @template T the mapped left type
     * @template U the mapped right type
     */
    map<T, U>(leftFn: Func<L, T>, rightFn: Func<R, U>): Either<T, U>;

    /**
     * Applies one of two mapping functions to the contained value, depending on whether this is a `left` or a `right`,
     * and returns a new `Either` where both sides share the same resulting type.
     *
     * @param leftFn  function to apply if this is a Left
     * @param rightFn function to apply if this is a Right
     * @template T the target type
     */
    bimap<T>(leftFn: Func<L, T>, rightFn: Func<R, T>): Either<T, T>;

    /**
     * Collapses an `Either<T,T>` into a single `T` by extracting the contained value, regardless of whether it was
     * originally a `left` or a `right`. Only valid when `L` and `R` are the same type.
     * @template T the common type of both sides
     */
    merge<T>(this: Either<T, T>): T;

    /**
     * Applies `ifLeftFn` to the left value or `ifRightFn` to the right value, returning the value.
     * @param ifLeftFn the left function
     * @param ifRightFn the right function
     * @template V the value type
     */
    fold<V>(ifLeftFn: Func<L, V>, ifRightFn: Func<R, V>): V;

    /**
     * Swaps the order of this either.
     */
    swap(): Either<R, L>;

    /**
     * Serializes this `Either` into a plain object suitable for {@link JSON#stringify}.
     */
    toJSON(): JSONEither<L, R>;
}

class Left<L, R> implements Either<L, R> {
    readonly #value: L;

    constructor(value: L) {
        this.#value = value;
    }

    get left(): Optional<L> {
        return optional(this.#value);
    }

    get right(): Optional<R> {
        return optional();
    }

    get isLeft(): boolean {
        return true;
    }

    get isRight(): boolean {
        return false;
    }

    ifLeft(fn: Consumer<L>): Either<L, R> {
        fn(this.#value);
        return this;
    }

    ifRight(_: Consumer<R>): Either<L, R> {
        return this;
    }

    map<T, U>(fn: Func<L, T>, _: Func<R, U>): Either<T, U> {
        return left(fn(this.#value));
    }

    bimap<T>(fn: Func<L, T>, _: Func<R, T>): Either<T, T> {
        return left(fn(this.#value));
    }

    merge<T>(this: Either<T, T>): T {
        return this.fold((x) => x, (x) => x);
    }

    mapLeft<T>(fn: Func<L, T>): Either<T, R> {
        return this.map(fn, (v) => v);
    }

    mapRight<T>(fn: Func<R, T>): Either<L, T> {
        return this.map((v) => v, fn);
    }

    fold<V>(fn: Func<L, V>, _: Func<R, V>): V {
        return fn(this.#value);
    }

    swap(): Either<R, L> {
        return right(this.#value);
    }

    toJSON(): JSONEither<L, R> {
        return {
            left: this.#value,
        };
    }
}

class Right<L, R> implements Either<L, R> {
    readonly #value: R;

    constructor(value: R) {
        this.#value = value;
    }

    get left(): Optional<L> {
        return optional();
    }

    get right(): Optional<R> {
        return optional(this.#value);
    }
    get isLeft(): boolean {
        return false;
    }

    get isRight(): boolean {
        return true;
    }

    ifLeft(_: Consumer<L>): Either<L, R> {
        return this;
    }

    ifRight(fn: Consumer<R>): Either<L, R> {
        fn(this.#value);
        return this;
    }

    map<T, U>(_: Func<L, T>, fn: Func<R, U>): Either<T, U> {
        return right(fn(this.#value));
    }

    bimap<T>(_: Func<L, T>, fn: Func<R, T>): Either<T, T> {
        return right(fn(this.#value));
    }

    merge<T>(this: Either<T, T>): T {
        return this.fold((x) => x, (x) => x);
    }

    mapLeft<T>(fn: Func<L, T>): Either<T, R> {
        return this.map(fn, (v) => v);
    }

    mapRight<T>(fn: Func<R, T>): Either<L, T> {
        return this.map((v) => v, fn);
    }

    fold<V>(_: Func<L, V>, fn: Func<R, V>): V {
        return fn(this.#value);
    }

    swap(): Either<R, L> {
        return left(this.#value);
    }

    toJSON(): JSONEither<L, R> {
        return {
            right: this.#value,
        };
    }
}

/**
 * Creates a new {@link Either} with a left value.
 * @param value the left value
 * @template L the left value type
 * @template R the right value type
 */
export function left<L, R>(value: L): Either<L, R> {
    return new Left(value);
}

/**
 * Creates a new {@link Either} with a right value.
 * @param value the right value
 * @template L the left value type
 * @template R the right value type
 */
export function right<L, R>(value: R): Either<L, R> {
    return new Right(value);
}
