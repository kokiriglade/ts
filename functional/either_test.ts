// Copyright 2025-2025 kokiriglade. MIT license.

import {
    assert,
    assertEquals,
    assertFalse,
    assertStrictEquals,
} from "@std/assert";
import {
    type Either,
    isEither,
    type JSONEither,
    left,
    right,
} from "./either.ts";
import { type Optional, optional } from "./optional.ts";
import type { Consumer, Func } from "@kokiri/types";

Deno.test("left creates a left Either", () => {
    const leftEither = left<string, number>("error");
    assert(leftEither.isLeft, "Expected isLeft to be true");
    assertFalse(leftEither.isRight);

    const leftOpt = leftEither.left;
    assert(leftOpt.isPresent);
    assertEquals(leftOpt.unwrap(), "error");

    const rightOpt = leftEither.right;
    assertFalse(rightOpt.isPresent);
    assertStrictEquals(rightOpt.unwrap(), null);
});

Deno.test("right creates a right Either", () => {
    const rightEither = right<string, number>(42);
    assert(rightEither.isRight, "Expected isRight to be true");
    assertFalse(rightEither.isLeft);

    const rightOpt = rightEither.right;
    assert(rightOpt.isPresent);
    assertEquals(rightOpt.unwrap(), 42);

    const leftOpt = rightEither.left;
    assertFalse(leftOpt.isPresent);
    assertStrictEquals(leftOpt.unwrap(), null);
});

Deno.test("ifLeft and ifRight execute callbacks correctly", () => {
    let seen: unknown = null;
    const leftEither = left<string, number>("error");
    leftEither.ifLeft((v) => {
        seen = `left:${v}`;
    });
    assertEquals(seen, "left:error");

    seen = null;
    leftEither.ifRight((v) => {
        seen = `right:${v}`;
    });
    assertStrictEquals(seen, null);

    const rightEither = right<string, number>(42);
    rightEither.ifRight((v) => {
        seen = `right:${v}`;
    });
    assertEquals(seen, "right:42");

    seen = null;
    rightEither.ifLeft((v) => {
        seen = `left:${v}`;
    });
    assertStrictEquals(seen, null);
});

Deno.test("mapLeft and mapRight transform correctly", () => {
    const leftEither = left<string, number>("error");
    const mappedLeft = leftEither.mapLeft((s) => s.toUpperCase());
    assert(mappedLeft.isLeft);
    assertEquals(mappedLeft.left.unwrap(), "ERROR");

    const mappedRight = leftEither.mapRight((n) => n * 2);
    assert(mappedRight.isLeft);
    assertEquals(mappedRight.left.unwrap(), "error");

    const rightEither = right<string, number>(42);
    const mappedRight2 = rightEither.mapRight((n) => n * 2);
    assert(mappedRight2.isRight);
    assertEquals(mappedRight2.right.unwrap(), 84);

    const mappedLeft2 = rightEither.mapLeft((s) => s.toUpperCase());
    assert(mappedLeft2.isRight);
    assertEquals(mappedLeft2.right.unwrap(), 42);
});

Deno.test("map transforms both sides correctly", () => {
    const leftEither = left<string, number>("error");
    const mapped = leftEither.map(
        (s) => s.toUpperCase(),
        (n) => n * 2,
    );
    assert(mapped.isLeft);
    assertEquals(mapped.left.unwrap(), "ERROR");

    const rightEither = right<string, number>(42);
    const mapped2 = rightEither.map(
        (s) => s.toUpperCase(),
        (n) => n * 2,
    );
    assert(mapped2.isRight);
    assertEquals(mapped2.right.unwrap(), 84);
});

Deno.test("bimap transforms to common type", () => {
    const leftEither = left<string, number>("42");
    const bimapped = leftEither.bimap(
        (s) => parseInt(s),
        (n) => n,
    );
    assert(bimapped.isLeft);
    assertEquals(bimapped.left.unwrap(), 42);

    const rightEither = right<string, number>(42);
    const bimapped2 = rightEither.bimap(
        (s) => parseInt(s),
        (n) => n,
    );
    assert(bimapped2.isRight);
    assertEquals(bimapped2.right.unwrap(), 42);
});

Deno.test("merge collapses Either with same types", () => {
    const leftEither = left<number, number>(42);
    assertEquals(leftEither.merge(), 42);

    const rightEither = right<number, number>(84);
    assertEquals(rightEither.merge(), 84);
});

Deno.test("fold applies the correct function", () => {
    const leftEither = left<string, number>("42");
    const result = leftEither.fold(
        (s) => `Left: ${s}`,
        (n) => `Right: ${n}`,
    );
    assertEquals(result, "Left: 42");

    const rightEither = right<string, number>(42);
    const result2 = rightEither.fold(
        (s) => `Left: ${s}`,
        (n) => `Right: ${n}`,
    );
    assertEquals(result2, "Right: 42");
});

Deno.test("swap exchanges left and right", () => {
    const leftEither = left<string, number>("error");
    const swapped = leftEither.swap();
    assert(swapped.isRight);
    assertEquals(swapped.right.unwrap(), "error");

    const rightEither = right<string, number>(42);
    const swapped2 = rightEither.swap();
    assert(swapped2.isLeft);
    assertEquals(swapped2.left.unwrap(), 42);
});

Deno.test("toJSON serializes correctly", () => {
    const leftEither = left<string, number>("error");
    const json = leftEither.toJSON();
    assertEquals(json.left, "error");
    assertEquals(json.right, undefined);

    const rightEither = right<string, number>(42);
    const json2 = rightEither.toJSON();
    assertEquals(json2.left, undefined);
    assertEquals(json2.right, 42);
});

Deno.test("isEither is correct", () => {
    class CopyOfRight<L, R> implements Either<L, R> {
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

    assert(isEither(left<string, number>("foo")));
    assert(isEither(right<string, number>(69)));
    assert(isEither(new CopyOfRight<string, number>(69)));
    assertFalse(isEither("foo"));
});
