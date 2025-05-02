// Copyright 2025-2025 kokiriglade. MIT license.

/**
 * Modified UTF-8 is the variant of UTF-8 used on Java. See the
 * [JVM spec](https://docs.oracle.com/javase/specs/jvms/se21/html/jvms-4.html#jvms-4.4.7) for technical details.
 *
 * @example Decoder
 * ```ts
 * import { MUTF8TextDecoder } from "@kokiri/modified-utf8";
 * import { assertEquals } from "@std/assert";
 *
 * const dec = new MUTF8TextDecoder();
 * assertEquals(
 *   dec.decode(new Uint8Array([0x68, 0x65, 0x6C, 0x6C, 0x6F])),
 *   "hello",
 * );
 *
 * assertEquals(
 *   dec.decode(new Uint8Array([0xC0, 0x80, 0xE2, 0x98, 0x83])),
 *   "\u0000☃",
 * );
 * ```
 *
 * @example Encoder
 * ```ts
 * import { MUTF8TextEncoder } from "@kokiri/modified-utf8";
 * import { assertEquals } from "@std/assert";
 *
 * const enc = new MUTF8TextEncoder();
 * assertEquals(
 *   enc.encode("hi"),
 *   new Uint8Array([0x68, 0x69]),
 * );
 *
 * const dest = new Uint8Array(5);
 * const { read, written } = enc.encodeInto("\u0000☃", dest);
 * assertEquals(read, 2);
 * assertEquals(written, 5);
 * assertEquals(dest, new Uint8Array([0xC0,0x80,0xE2,0x98,0x83]));
 * ```
 *
 * @module
 */
export * from "./decoder.ts";
export * from "./encoder.ts";
