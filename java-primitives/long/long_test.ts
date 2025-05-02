// Copyright 2025-2025 kokiriglade. MIT license.

import { assert, assertEquals, assertFalse, assertThrows } from "@std/assert";
import { asLong, assertLong, isLong, MAX_LONG, MIN_LONG } from "./long.ts";

Deno.test("isLong() identifies BigInts within range", () => {
    assert(isLong(0n));
    assert(isLong(123n));
    assert(isLong(-42n));
    // boundary values
    assert(isLong(MAX_LONG));
    assert(isLong(MIN_LONG));
});

Deno.test("isLong() rejects non-bigints", () => {
    assertThrows(() => {
        // @ts-expect-error: purpose of test
        isLong(3.14), Error, "Not a bigint: '3.14'";
    });
});

Deno.test("isLong() rejects BigInts out of range", () => {
    assertFalse(isLong(MAX_LONG + 1n));
    assertFalse(isLong(MIN_LONG - 1n));
});

Deno.test("assertLong() does not throw for valid longs", () => {
    assertLong(0n);
    assertLong(MAX_LONG);
    assertLong(MIN_LONG);
});

Deno.test("assertLong() throws on out-of-range BigInts", () => {
    assertThrows(
        () => assertLong(MAX_LONG + 1n),
        Error,
        `${MAX_LONG + 1n} is not a java-style long`,
    );
    assertThrows(
        () => assertLong(MIN_LONG - 1n),
        Error,
        `${MIN_LONG - 1n} is not a java-style long`,
    );
});

Deno.test("asLong() truncates by default (Math.trunc) for numbers", () => {
    const a = asLong(5.9);
    const b = asLong(-5.9);
    assertEquals(a, 5n);
    assertEquals(b, -5n);
});

Deno.test("asLong() respects a custom converter fn for numbers", () => {
    const floor = asLong(5.9, Math.floor);
    const ceil = asLong(5.1, Math.ceil);
    assertEquals(floor, 5n);
    assertEquals(ceil, 6n);

    assertThrows(
        () => asLong(42, () => 3.14),
        Error,
        "Rounded number '3.14' is not an integer, unrounded: '42'",
    );
});

Deno.test("asLong() throws on non-finite number inputs", () => {
    assertThrows(
        () => asLong(NaN),
        Error,
        "Rounded number 'NaN' is not finite, unrounded: 'NaN'",
    );
    assertThrows(
        () => asLong(Infinity),
        Error,
        "Rounded number 'Infinity' is not finite, unrounded: 'Infinity'",
    );
});

Deno.test("asLong() ignores converter when given a bigint", () => {
    // should not call the converter at all
    const val = 7n;
    const result = asLong(val, () => {
        throw new Error("converter called");
    });
    assertEquals(result, val);
});

Deno.test("asLong() wraps bigint overflow like Java", () => {
    assertEquals(asLong(2n ** 63n), MIN_LONG);
    assertEquals(asLong((2n ** 63n) + 1n), MIN_LONG + 1n);
    assertEquals(asLong(-(2n ** 63n) - 1n), MAX_LONG);
    assertEquals(asLong(-1n), -1n);
});
