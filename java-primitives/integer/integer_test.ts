// Copyright 2025-2025 kokiriglade. MIT license.

import { assert, assertEquals, assertFalse, assertThrows } from "@std/assert";
import { asInteger, assertInteger, isInteger } from "./integer.ts";

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
        "2.5 is not a java-style integer",
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
        () => asInteger(42, () => 3.14),
        Error,
        "Rounded number '3.14' is not an integer, unrounded: '42'",
    );
});

Deno.test("asInteger() throws on non-finite number inputs", () => {
    assertThrows(
        () => asInteger(NaN),
        Error,
        "Rounded number 'NaN' is not finite, unrounded: 'NaN'",
    );
    assertThrows(
        () => asInteger(Infinity),
        Error,
        "Rounded number 'Infinity' is not finite, unrounded: 'Infinity'",
    );
});

Deno.test("asInteger() wraps on overflow", () => {
    // 2_147_483_647 + 1  → wraps to -2_147_483_648
    const maxPlusOne = asInteger(2_147_483_647 + 1);
    assertEquals(maxPlusOne, -2_147_483_648);

    // -2_147_483_648 - 1 → wraps to  2_147_483_647
    const minMinusOne = asInteger(-2_147_483_648 - 1);
    assertEquals(minMinusOne, 2_147_483_647);
});
