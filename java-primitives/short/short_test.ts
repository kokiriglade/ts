// Copyright 2025-2025 kokiriglade. MIT license.

import { assert, assertEquals, assertFalse, assertThrows } from "@std/assert";
import {
    assertShort,
    asShort,
    isShort,
    MAX_SHORT,
    MIN_SHORT,
} from "./short.ts";

Deno.test("isShort() identifies valid shorts", () => {
    assert(isShort(0));
    assert(isShort(MAX_SHORT));
    assert(isShort(MIN_SHORT));
    assert(isShort(12345));
});

Deno.test("isShort() rejects out-of-range or non-integers", () => {
    assertFalse(isShort(MAX_SHORT + 1));
    assertFalse(isShort(MIN_SHORT - 1));
    assertFalse(isShort(3.14));
    assertFalse(isShort(NaN));
    assertFalse(isShort(Infinity));
});

Deno.test("assertShort() does not throw for valid shorts", () => {
    assertShort(0);
    assertShort(MAX_SHORT);
    assertShort(MIN_SHORT);
});

Deno.test("assertShort() throws on invalid shorts", () => {
    assertThrows(
        () => assertShort(MAX_SHORT + 1),
        Error,
        `${MAX_SHORT + 1} is not a java-style short`,
    );
    assertThrows(
        () => assertShort(MIN_SHORT - 1),
        Error,
        `${MIN_SHORT - 1} is not a java-style short`,
    );
});

Deno.test("asShort() truncates by default (Math.trunc)", () => {
    const a = asShort(5.9);
    const b = asShort(-5.9);
    assertEquals(a, 5);
    assertEquals(b, -5);
});

Deno.test("asShort() respects a custom converter fn", () => {
    const floor = asShort(5.9, Math.floor);
    const ceil = asShort(5.1, Math.ceil);
    assertEquals(floor, 5);
    assertEquals(ceil, 6);

    assertThrows(
        () => asShort(42, () => 3.14),
        Error,
        "Rounded number '3.14' is not an integer, unrounded: '42'",
    );
});

Deno.test("asShort() throws on non-finite inputs", () => {
    assertThrows(
        () => asShort(NaN),
        Error,
        "Rounded number 'NaN' is not finite, unrounded: 'NaN'",
    );
    assertThrows(
        () => asShort(Infinity),
        Error,
        "Rounded number 'Infinity' is not finite, unrounded: 'Infinity'",
    );
});

Deno.test("asShort() wraps on overflow", () => {
    assertEquals(asShort(32768), MIN_SHORT);
    assertEquals(asShort(65535), -1);
    assertEquals(asShort(-32769), MAX_SHORT);
    assertEquals(asShort(65536), 0);
    assertEquals(asShort(-65536), 0);
});
