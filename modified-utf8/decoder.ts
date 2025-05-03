// Copyright 2025-2025 kokiriglade. MIT license.

import {
    BOM0,
    BOM1,
    BOM2,
    ENCODING,
    MASK_4_BITS,
    MASK_5_BITS,
    MASK_6_BITS,
    NUL_CODEPOINT,
    ONE_BYTE_MARKER,
    REPLACEMENT_CHAR,
    THREE_BYTE_MARKER,
    THREE_BYTE_PREFIX,
    TWO_BYTE_MARKER,
    TWO_BYTE_PREFIX,
} from "./constants.ts";

export class MUTF8TextDecoder implements TextDecoder {
    readonly #fatal: boolean;
    readonly #ignoreBOM: boolean;
    #pending: Uint8Array;

    constructor(options: TextDecoderOptions = {}) {
        this.#fatal = options.fatal ?? false;
        this.#ignoreBOM = options.ignoreBOM ?? false;
        this.#pending = new Uint8Array();
    }

    decode(input?: BufferSource, options: TextDecodeOptions = {}): string {
        const chunk = input
            ? input instanceof ArrayBuffer
                ? new Uint8Array(input)
                : new Uint8Array(
                    input.buffer,
                    input.byteOffset,
                    input.byteLength,
                )
            : new Uint8Array();

        const bytes = new Uint8Array(this.#pending.length + chunk.length);
        bytes.set(this.#pending, 0);
        bytes.set(chunk, this.#pending.length);
        const len = bytes.length;

        let i = 0;
        let result = "";

        if (
            !this.#ignoreBOM && this.#pending.length === 0 && len >= 3 &&
            bytes[0] === BOM0 && bytes[1] === BOM1 && bytes[2] === BOM2
        ) {
            i = 3;
        }

        while (i < len) {
            const a = bytes[i];

            // 1-byte (U+0001..U+007F)
            if ((a & ONE_BYTE_MARKER) === 0) {
                result += String.fromCharCode(a);
                i++;
            } // 2-byte (U+0000 or U+0080..U+07FF)
            else if ((a & TWO_BYTE_MARKER) === TWO_BYTE_PREFIX) {
                if (i + 1 >= len) break;
                const b = bytes[i + 1];
                const code = ((a & MASK_5_BITS) << 6) | (b & MASK_6_BITS);
                result += String.fromCharCode(
                    code === NUL_CODEPOINT ? NUL_CODEPOINT : code,
                );
                i += 2;
            } // 3-byte (U+0800..U+FFFF, including surrogates)
            else if ((a & THREE_BYTE_MARKER) === THREE_BYTE_PREFIX) {
                if (i + 2 >= len) break;
                const b = bytes[i + 1];
                const c = bytes[i + 2];
                const code = ((a & MASK_4_BITS) << 12) |
                    ((b & MASK_6_BITS) << 6) | (c & MASK_6_BITS);
                result += String.fromCharCode(code);
                i += 3;
            } // invalid byte
            else {
                if (this.#fatal) {
                    throw new TypeError(
                        `Invalid modified UTF-8 byte 0x${a.toString(16)}`,
                    );
                }
                result += REPLACEMENT_CHAR;
                i++;
            }
        }

        if (options.stream) {
            this.#pending = bytes.slice(i);
        } else {
            this.#pending = new Uint8Array();
            while (i < len) {
                if (this.#fatal) {
                    throw new TypeError("Incomplete modified UTF-8 sequence");
                }
                result += REPLACEMENT_CHAR;
                i++;
            }
        }

        return result;
    }

    get encoding(): string {
        return ENCODING;
    }

    get fatal(): boolean {
        return this.#fatal;
    }

    get ignoreBOM(): boolean {
        return this.#ignoreBOM;
    }
}
