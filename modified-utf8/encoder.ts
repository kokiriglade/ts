// Copyright 2025-2025 kokiriglade. MIT license.

import {
    ENCODING,
    MASK_6_BITS,
    NUL_CODEPOINT,
    NUL_MUTF8_PREFIX,
    NUL_MUTF8_SUFFIX,
    THREE_BYTE_PREFIX,
    TWO_BYTE_PREFIX,
} from "./constants.ts";

export class MUTF8TextEncoder implements TextEncoder {
    encode(input = ""): Uint8Array {
        const bytes: number[] = [];

        for (let i = 0; i < input.length; i++) {
            const code = input.charCodeAt(i);
            if (code === NUL_CODEPOINT) {
                bytes.push(NUL_MUTF8_PREFIX, NUL_MUTF8_SUFFIX);
            } else if (code <= 0x007F) {
                bytes.push(code);
            } else if (code <= 0x07FF) {
                bytes.push(
                    TWO_BYTE_PREFIX | (code >> 6),
                    0x80 | (code & MASK_6_BITS),
                );
            } else {
                bytes.push(
                    THREE_BYTE_PREFIX | (code >> 12),
                    0x80 | ((code >> 6) & MASK_6_BITS),
                    0x80 | (code & MASK_6_BITS),
                );
            }
        }

        return new Uint8Array(bytes);
    }

    encodeInto(
        input: string,
        dest: Uint8Array,
    ): { read: number; written: number } {
        let read = 0;
        let written = 0;

        while (read < input.length) {
            const code = input.charCodeAt(read);
            const need = code === NUL_CODEPOINT
                ? 2
                : code <= 0x007F
                ? 1
                : code <= 0x07FF
                ? 2
                : 3;

            if (written + need > dest.length) break;

            if (code === NUL_CODEPOINT) {
                dest[written++] = NUL_MUTF8_PREFIX;
                dest[written++] = NUL_MUTF8_SUFFIX;
            } else if (code <= 0x007F) {
                dest[written++] = code;
            } else if (code <= 0x07FF) {
                dest[written++] = TWO_BYTE_PREFIX | (code >> 6);
                dest[written++] = 0x80 | (code & MASK_6_BITS);
            } else {
                dest[written++] = THREE_BYTE_PREFIX | (code >> 12);
                dest[written++] = 0x80 | ((code >> 6) & MASK_6_BITS);
                dest[written++] = 0x80 | (code & MASK_6_BITS);
            }

            read++;
        }

        return { read, written };
    }

    get encoding(): string {
        return ENCODING;
    }
}
