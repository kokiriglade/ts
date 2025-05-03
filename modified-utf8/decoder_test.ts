// Copyright 2025-2025 kokiriglade. MIT license.

import {
    assert,
    assertEquals,
    assertStrictEquals,
    assertThrows,
} from "@std/assert";
import { MUTF8TextDecoder } from "./decoder.ts";
import testData from "./_test_data.ts";

Deno.test("decode empty", () => {
    assertStrictEquals(new MUTF8TextDecoder().decode(new Uint8Array()), "");
});

Deno.test("decode simple ASCII", () => {
    const dec = new MUTF8TextDecoder();
    const bytes = new TextEncoder().encode("hello");
    assertStrictEquals(dec.decode(bytes), "hello");
});

for (const data of testData) {
    Deno.test(`decode byte sequence that is ${data.name.toLowerCase()} ("${data.text}")`, () => {
        const dec = new MUTF8TextDecoder();
        assertStrictEquals(dec.decode(data.binary), data.text);
    });
}

Deno.test("streaming decode", () => {
    const dec = new MUTF8TextDecoder();
    const part1 = new Uint8Array([0xE2, 0x98]);
    const part2 = new Uint8Array([0x83]);
    assertStrictEquals(dec.decode(part1, { stream: true }), "");
    assertStrictEquals(dec.decode(part2), "☃");
});

Deno.test("fatal on invalid byte", () => {
    const dec = new MUTF8TextDecoder({ fatal: true });
    assertThrows(() => {
        dec.decode(new Uint8Array([0xFF]));
    }, TypeError);
});

Deno.test("non-fatal replacement on incomplete without stream", () => {
    assertThrows(
        () => {
            const dec = new MUTF8TextDecoder({ fatal: true });
            const bytes = new Uint8Array([0xE2]);
            dec.decode(bytes);
        },
        TypeError,
        "Incomplete modified UTF-8 sequence",
    );
});

Deno.test("decode(undefined) → empty", () => {
    const dec = new MUTF8TextDecoder();
    assertStrictEquals(dec.decode(), "");
});

Deno.test("skip BOM by default", () => {
    const dec = new MUTF8TextDecoder();
    // BOM + "A" (0x41)
    const data = new Uint8Array([0xEF, 0xBB, 0xBF, 0x41]);
    assertStrictEquals(dec.decode(data), "A");
});

Deno.test("invalid-leading-byte → replacement", () => {
    const dec = new MUTF8TextDecoder();
    assertStrictEquals(dec.decode(new Uint8Array([0xFF])), "�");
});

Deno.test("incomplete 2-byte non-stream → replacement", () => {
    const dec = new MUTF8TextDecoder();
    // lead of 2-byte, but no continuation
    assertStrictEquals(dec.decode(new Uint8Array([0xC3])), "�");
});

Deno.test("incomplete 3-byte non-stream fatal → throw", () => {
    const dec = new MUTF8TextDecoder({ fatal: true });
    assertThrows(() => {
        dec.decode(new Uint8Array([0xE2, 0x98]));
    }, TypeError);
});

Deno.test("decode(undefined) → empty", () => {
    const dec = new MUTF8TextDecoder();
    assertStrictEquals(dec.decode(), "");
});

Deno.test("skip UTF-8 BOM by default", () => {
    const dec = new MUTF8TextDecoder();
    // BOM + "Z" (0x5A)
    const data = new Uint8Array([0xEF, 0xBB, 0xBF, 0x5A]);
    assertStrictEquals(dec.decode(data), "Z");
});

Deno.test("preserve BOM when ignoreBOM=true", () => {
    const dec = new MUTF8TextDecoder({ ignoreBOM: true });
    const data = new Uint8Array([0xEF, 0xBB, 0xBF, 0x42]);
    // U+FEFF (ZERO-WIDTH NO-BREAK SPACE) + "B"
    assertEquals(dec.decode(data), "\uFEFFB");
});

Deno.test("invalid-leading-byte → replacement", () => {
    const dec = new MUTF8TextDecoder();
    assertStrictEquals(dec.decode(new Uint8Array([0xF8])), "�");
});

Deno.test("incomplete 2-byte non-stream → replacement", () => {
    const dec = new MUTF8TextDecoder();
    // lead byte for 2-byte sequence without continuation
    assertStrictEquals(dec.decode(new Uint8Array([0xC3])), "�");
});

Deno.test("incomplete 2-byte streaming → buffer", () => {
    const dec = new MUTF8TextDecoder();
    assertStrictEquals(
        dec.decode(new Uint8Array([0xC2]), { stream: true }),
        "",
    );
    assertStrictEquals(dec.decode(new Uint8Array([0xA9])), "©");
});

Deno.test("incomplete 3-byte non-stream non-fatal → replacements", () => {
    const dec = new MUTF8TextDecoder();
    // first two bytes of a 3-byte sequence
    assertStrictEquals(dec.decode(new Uint8Array([0xE2, 0x98])), "��");
});

Deno.test("incomplete 3-byte non-stream fatal → throw", () => {
    const dec = new MUTF8TextDecoder({ fatal: true });
    assertThrows(() => {
        dec.decode(new Uint8Array([0xE2, 0x98]));
    }, TypeError);
});

Deno.test("2-byte codepoint U+07A3", () => {
    const dec = new MUTF8TextDecoder();
    assertStrictEquals(dec.decode(new Uint8Array([0xDE, 0xA3])), "\u07A3");
});

Deno.test("decode(undefined) yields empty string", () => {
    const dec = new MUTF8TextDecoder();
    assertStrictEquals(dec.decode(), "");
});

Deno.test("stream followed by flush without new input emits replacement", () => {
    const dec = new MUTF8TextDecoder();
    // feed half of a 3‐byte snowman
    assertStrictEquals(
        dec.decode(new Uint8Array([0xE2, 0x98]), { stream: true }),
        "",
    );
    // now flush (no input, stream=false by default) → should emit two U+FFFD
    assertStrictEquals(dec.decode(), "��");
});

Deno.test("stream + flush with fatal throws on incomplete", () => {
    const dec = new MUTF8TextDecoder({ fatal: true });
    assertStrictEquals(
        dec.decode(new Uint8Array([0xE2]), { stream: true }),
        "",
    );
    assertThrows(() => {
        dec.decode(); // now tries to flush that half‐byte and should throw
    }, TypeError);
});

Deno.test("test getters", () => {
    const dec = new MUTF8TextDecoder({ fatal: true, ignoreBOM: true });
    assertStrictEquals(dec.encoding, "modified-utf8");
    assert(dec.fatal);
    assert(dec.ignoreBOM);
});

Deno.test("decode(ArrayBuffer) → ArrayBuffer branch", () => {
    const text = "arraybuffer";
    const buf = new TextEncoder().encode(text).buffer as ArrayBuffer;
    const dec = new MUTF8TextDecoder();
    assertStrictEquals(dec.decode(buf), text);
});

Deno.test("decode(DataView) → ArrayBufferView branch", () => {
    const text = "dataview";
    const arr = new TextEncoder().encode(text);
    // wrap in a DataView rather than a Uint8Array
    const view = new DataView(arr.buffer, arr.byteOffset, arr.byteLength);
    const dec = new MUTF8TextDecoder();
    assertEquals(dec.decode(view), text);
});
