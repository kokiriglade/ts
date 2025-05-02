// Copyright 2025-2025 kokiriglade. MIT license.

/**
 * A {@link TextEncoder} implementation for Java's Modified UTF-8 (MUTF-8).
 */
export class MUTF8TextEncoder implements TextEncoder {
    encode(input = ""): Uint8Array {
        const bytes: number[] = [];
        for (let i = 0; i < input.length; i++) {
            const code = input.charCodeAt(i);
            if (code === 0x0000) {
                bytes.push(0xC0, 0x80);
            } else if (code <= 0x007F) {
                bytes.push(code);
            } else if (code <= 0x07FF) {
                bytes.push(0xC0 | (code >> 6), 0x80 | (code & 0x3F));
            } else {
                bytes.push(
                    0xE0 | (code >> 12),
                    0x80 | ((code >> 6) & 0x3F),
                    0x80 | (code & 0x3F),
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
            const need = code === 0x0000
                ? 2
                : code <= 0x007F
                ? 1
                : code <= 0x07FF
                ? 2
                : 3;
            if (written + need > dest.length) break;
            if (code === 0x0000) {
                dest[written++] = 0xC0;
                dest[written++] = 0x80;
            } else if (code <= 0x007F) {
                dest[written++] = code;
            } else if (code <= 0x07FF) {
                dest[written++] = 0xC0 | (code >> 6);
                dest[written++] = 0x80 | (code & 0x3F);
            } else {
                dest[written++] = 0xE0 | (code >> 12);
                dest[written++] = 0x80 | ((code >> 6) & 0x3F);
                dest[written++] = 0x80 | (code & 0x3F);
            }
            read++;
        }
        return { read, written };
    }

    get encoding(): string {
        return "modified-utf8";
    }
}
