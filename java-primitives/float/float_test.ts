// Copyright 2025-2025 kokiriglade. MIT license.

import { assert, assertEquals, assertFalse, assertThrows } from "@std/assert";
import {
    asFloat,
    assertFloat,
    isFloat,
    MAX_FLOAT,
    MIN_FLOAT,
} from "./float.ts";

Deno.test("isFloat() identifies representable float values", () => {
    assert(isFloat(0));
    assert(isFloat(1.5)); // exactly representable
    assert(isFloat(NaN));
    assert(isFloat(Infinity));
    assert(isFloat(-Infinity));
});

Deno.test("isFloat() rejects non-representable values", () => {
    assertFalse(isFloat(0.1)); // not exactly a float
    assertFalse(isFloat(MAX_FLOAT * 2)); // overflows to Infinity
    assertFalse(isFloat(MIN_FLOAT * 2)); // underflows to -Infinity
});

Deno.test("assertFloat() does not throw for valid float values", () => {
    assertFloat(0);
    assertFloat(1.5);
    assertFloat(NaN);
    assertFloat(Infinity);
    assertFloat(-Infinity);
});

Deno.test("assertFloat() throws on non-float values", () => {
    assertThrows(
        () => assertFloat(0.1),
        Error,
        "0.1 is not a float",
    );
    assertThrows(
        () => assertFloat(MAX_FLOAT * 2),
        Error,
        `${MAX_FLOAT * 2} is not a float`,
    );
});

Deno.test("asFloat() rounds numbers to nearest float", () => {
    const a = asFloat(0.1);
    const b = asFloat(1.337);
    assertEquals(a, new Float32Array([0.1])[0]);
    assertEquals(b, new Float32Array([1.337])[0]);
});

Deno.test("asFloat() saturates out-of-range values to infinities", () => {
    assertEquals(asFloat(MAX_FLOAT * 2), Infinity);
    assertEquals(asFloat(MIN_FLOAT * 2), -Infinity);
});

Deno.test("asFloat() handles NaN and infinite inputs", () => {
    const nanResult = asFloat(NaN);
    assert(Number.isNaN(nanResult));

    assertEquals(asFloat(Infinity), Infinity);
    assertEquals(asFloat(-Infinity), -Infinity);
});
