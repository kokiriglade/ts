// Copyright 2025-2025 kokiriglade. MIT license.

import { assert, assertEquals, assertFalse, assertThrows } from "@std/assert";
import { isOptional, optional } from "./mod.ts";

Deno.test("optional.of non-null value", () => {
    const opt = optional(42);
    assert(opt.isPresent);
    assert(isOptional(opt));
    assertEquals(opt.unwrap(), 42);
});

Deno.test("optional.of null or undefined yields empty", () => {
    const optNull = optional(null);
    const optUndef = optional(undefined);
    assertFalse(optNull.isPresent);
    assertFalse(optUndef.isPresent);
    assert(isOptional(optNull));
});

Deno.test("unwrap throws on empty optional", () => {
    const empty = optional<number>(null);
    assertThrows(
        () => empty.unwrap(),
        Error,
        "Optional is empty.",
    );
});

Deno.test("unwrapOr returns default or value", () => {
    const empty = optional<number>(null);
    assertEquals(empty.unwrapOr(100), 100);
    const opt = optional(5);
    assertEquals(opt.unwrapOr(100), 5);
});

Deno.test("unwrapOrElse returns computed default or value", () => {
    const empty = optional<number>(null);
    let called = false;
    const result = empty.unwrapOrElse(() => {
        called = true;
        return 99;
    });
    assert(called);
    assertEquals(result, 99);

    const opt = optional(7);
    called = false;
    const val = opt.unwrapOrElse(() => {
        called = true;
        return 0;
    });
    assertFalse(called);
    assertEquals(val, 7);
});

Deno.test("unwrapOrThrow throws custom error or returns value", () => {
    const empty = optional<number>(null);
    assertThrows(
        () => empty.unwrapOrThrow(() => new TypeError("no value")),
        TypeError,
        "no value",
    );

    const opt = optional(8);
    const v = opt.unwrapOrThrow(() => new Error("should not happen"));
    assertEquals(v, 8);
});

Deno.test("ifPresent executes only when present", () => {
    const opt = optional("hello");
    let out = "";
    opt.ifPresent((v) => {
        out = v;
    });
    assertEquals(out, "hello");

    out = "";
    optional<string>(null).ifPresent((v) => {
        out = v;
    });
    assertEquals(out, "");
});

Deno.test("map transforms present value and preserves emptiness", () => {
    const opt = optional(3);
    const mapped = opt.map((n) => n * 2);
    assert(mapped.isPresent);
    assertEquals(mapped.unwrap(), 6);

    const empty = optional<number>(null);
    const mappedEmpty = empty.map((n) => n * 2);
    assertFalse(mappedEmpty.isPresent);
});

Deno.test("isOptional returns false for non-optional", () => {
    assertFalse(isOptional("not an optional"));
});
