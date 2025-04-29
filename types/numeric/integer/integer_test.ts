// Copyright 2025-2025 kokiriglade. MIT license.

import { assert, assertEquals, assertFalse, assertThrows } from "@std/assert";
import {
    asInteger,
    assertInteger,
    assertSafeInteger,
    isInteger,
    isSafeInteger,
} from "./integer.ts";

Deno.test("isInteger() identifies whole numbers", () => {
    assert(isInteger(0));
    assert(isInteger(123));
    assert(isInteger(-42));
});

Deno.test("isInteger() rejects non-integers", () => {
    assertFalse(isInteger(3.14));
    assertFalse(isInteger(NaN));
    assertFalse(isInteger(Infinity));
});

Deno.test("assertInteger() does not throw for integers", () => {
    assertInteger(7);
    assertInteger(-100);
});

Deno.test("assertInteger() throws on non-integers", () => {
    assertThrows(
        () => assertInteger(2.5),
        Error,
        "2.5 is not an integer",
    );
});

Deno.test("isSafeInteger() identifies JS-safe integers", () => {
    assert(isSafeInteger(Number.MAX_SAFE_INTEGER));
    assert(isSafeInteger(Number.MIN_SAFE_INTEGER));
});

Deno.test("isSafeInteger() rejects out-of-range values", () => {
    assertFalse(isSafeInteger(Number.MAX_SAFE_INTEGER + 1));
    assertFalse(isSafeInteger(1.234e20));
});

Deno.test("assertSafeInteger() does not throw for safe integers", () => {
    assertSafeInteger(42);
});

Deno.test("assertSafeInteger() throws when out of safe range", () => {
    const tooBig = Number.MAX_SAFE_INTEGER + 1;
    assertThrows(
        () => assertSafeInteger(tooBig),
        Error,
        `${tooBig} is not a safe integer`,
    );
});

Deno.test("asInteger() truncates by default (Math.trunc)", () => {
    const a = asInteger(5.9);
    const b = asInteger(-5.9);
    assertEquals(a, 5);
    assertEquals(b, -5);
});

Deno.test("asInteger() respects a custom converter fn", () => {
    const floor = asInteger(5.9, Math.floor);
    const ceil = asInteger(5.1, Math.ceil);
    assertEquals(floor, 5);
    assertEquals(ceil, 6);
    assertThrows(
        () => asInteger(42, (_) => 3.14),
        Error,
        `3.14 is not an integer`,
    );
});

Deno.test("asInteger() throws if converter returns non-integer", () => {
    assertThrows(
        () => asInteger(3.5, () => 3.3),
        Error,
    );
});
