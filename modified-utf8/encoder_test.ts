// Copyright 2025-2025 kokiriglade. MIT license.

import { assertEquals } from "@std/assert";
import { MUTF8TextEncoder } from "./encoder.ts";
import { MUTF8TextDecoder } from "./decoder.ts";

Deno.test("encode simple ASCII", () => {
    const enc = new MUTF8TextEncoder();
    const input = "hello";
    const expected = new TextEncoder().encode(input);
    assertEquals(enc.encode(input), expected);
});

Deno.test("encode NUL", () => {
    const enc = new MUTF8TextEncoder();
    const bytes = enc.encode("\u0000");
    assertEquals(bytes, new Uint8Array([0xC0, 0x80]));
});

Deno.test("encode multibyte snowman", () => {
    const enc = new MUTF8TextEncoder();
    const bytes = enc.encode("☃");
    assertEquals(bytes, new Uint8Array([0xE2, 0x98, 0x83]));
});

Deno.test("roundtrip encode/decode", () => {
    const enc = new MUTF8TextEncoder();
    const dec = new MUTF8TextDecoder();
    const text = "hello\u0000☃";
    const bytes = enc.encode(text);
    assertEquals(dec.decode(bytes), text);
});

Deno.test("encodeInto simple ASCII", () => {
    const enc = new MUTF8TextEncoder();
    const dest = new Uint8Array(5);
    const { read, written } = enc.encodeInto("hello", dest);
    assertEquals(read, 5);
    assertEquals(written, 5);
    assertEquals(dest, new TextEncoder().encode("hello"));
});

Deno.test("encodeInto partial buffer", () => {
    const enc = new MUTF8TextEncoder();
    const dest = new Uint8Array(3);
    const { read, written } = enc.encodeInto("hello", dest);
    assertEquals(read, 3);
    assertEquals(written, 3);
    assertEquals(dest, new TextEncoder().encode("hel"));
});

Deno.test("encodeInto NUL and snowman", () => {
    const enc = new MUTF8TextEncoder();
    // NUL(2 bytes) + snowman(3 bytes) = 5 bytes total
    const dest = new Uint8Array(5);
    const { read, written } = enc.encodeInto("\u0000☃", dest);
    assertEquals(read, 2);
    assertEquals(written, 5);
    assertEquals(dest, new Uint8Array([0xC0, 0x80, 0xE2, 0x98, 0x83]));
});
