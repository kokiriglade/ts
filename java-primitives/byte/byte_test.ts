// Copyright 2025-2025 kokiriglade. MIT license.

import { assert, assertEquals, assertFalse, assertThrows } from "@std/assert";
import { asByte, assertByte, isByte, MAX_BYTE, MIN_BYTE } from "./byte.ts";

Deno.test("isByte() identifies valid bytes", () => {
    assert(isByte(0));
    assert(isByte(127));
    assert(isByte(-128));
    assert(isByte(42));
});

Deno.test("isByte() rejects out-of-range or non-integers", () => {
    assertFalse(isByte(128));
    assertFalse(isByte(-129));
    assertFalse(isByte(3.14));
    assertFalse(isByte(NaN));
    assertFalse(isByte(Infinity));
});

Deno.test("assertByte() does not throw for valid bytes", () => {
    assertByte(0);
    assertByte(MAX_BYTE);
    assertByte(MIN_BYTE);
});

Deno.test("assertByte() throws on invalid bytes", () => {
    assertThrows(
        () => assertByte(128),
        Error,
        "128 is not a java-style byte",
    );
    assertThrows(
        () => assertByte(-129),
        Error,
        "-129 is not a java-style byte",
    );
});

Deno.test("asByte() truncates by default (Math.trunc)", () => {
    const a = asByte(5.9);
    const b = asByte(-5.9);
    assertEquals(a, 5);
    assertEquals(b, -5);
});

Deno.test("asByte() respects a custom converter fn", () => {
    const floor = asByte(5.9, Math.floor);
    const ceil = asByte(5.1, Math.ceil);
    assertEquals(floor, 5);
    assertEquals(ceil, 6);

    assertThrows(
        () => asByte(42, () => 3.14),
        Error,
        "Rounded number '3.14' is not an integer, unrounded: '42'",
    );
});

Deno.test("asByte() throws on non-finite inputs", () => {
    assertThrows(
        () => asByte(NaN),
        Error,
        "Rounded number 'NaN' is not finite, unrounded: 'NaN'",
    );
    assertThrows(
        () => asByte(Infinity),
        Error,
        "Rounded number 'Infinity' is not finite, unrounded: 'Infinity'",
    );
});

Deno.test("asByte() wraps on overflow", () => {
    assertEquals(asByte(128), -128);
    assertEquals(asByte(255), -1);
    assertEquals(asByte(-129), 127);
    assertEquals(asByte(256), 0);
    assertEquals(asByte(-256), 0);
});
