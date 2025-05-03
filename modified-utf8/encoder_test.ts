// Copyright 2025-2025 kokiriglade. MIT license.

import { assertEquals, assertStrictEquals } from "@std/assert";
import { MUTF8TextEncoder } from "./encoder.ts";
import { MUTF8TextDecoder } from "./decoder.ts";
import testData from "./_test_data.ts";

for (const data of testData) {
    Deno.test(`roundtrip encode/decode text that is ${data.name.toLowerCase()} ("${data.text}")`, () => {
        const enc = new MUTF8TextEncoder();
        const dec = new MUTF8TextDecoder();
        const bytes = enc.encode(data.text);
        assertStrictEquals(dec.decode(bytes), data.text);
    });
}

Deno.test("encodeInto partial buffer", () => {
    const enc = new MUTF8TextEncoder();
    const dest = new Uint8Array(3);
    const { read, written } = enc.encodeInto("hello", dest);
    assertStrictEquals(read, 3);
    assertStrictEquals(written, 3);
    assertEquals(dest, new TextEncoder().encode("hel"));
});

Deno.test("encodeInto all branches", () => {
    const enc = new MUTF8TextEncoder();
    // ASCII
    let buf = new Uint8Array(3);
    let r = enc.encodeInto("hey", buf);
    assertEquals(r, { read: 3, written: 3 });
    // NUL
    buf = new Uint8Array(2);
    r = enc.encodeInto("\u0000", buf);
    assertEquals(r, { read: 1, written: 2 });
    // 2-byte
    buf = new Uint8Array(2);
    r = enc.encodeInto("\u07A3", buf);
    assertEquals(r, { read: 1, written: 2 });
    // 3-byte
    buf = new Uint8Array(3);
    r = enc.encodeInto("☃", buf);
    assertEquals(r, { read: 1, written: 3 });
});

Deno.test("test getter", () => {
    assertStrictEquals(new MUTF8TextEncoder().encoding, "modified-utf8");
});
