// Copyright 2025-2025 kokiriglade. MIT license.

/**
 * A {@link TextDecoder} implementation for Java's Modified UTF-8 (MUTF-8), with streaming support.
 */
export class MUTF8TextDecoder implements TextDecoder {
    readonly #fatal: boolean;
    readonly #ignoreBOM: boolean;
    // buffer for incomplete multi-byte sequences between stream calls
    #pending: Uint8Array;

    constructor(options: TextDecoderOptions = {}) {
        this.#fatal = options.fatal ?? false;
        this.#ignoreBOM = options.ignoreBOM ?? false;
        this.#pending = new Uint8Array();
    }

    decode(input?: BufferSource, options: TextDecodeOptions = {}): string {
        // convert input to Uint8Array (or empty if none)
        const chunk = input
            ? input instanceof ArrayBuffer
                ? new Uint8Array(input)
                : new Uint8Array(
                    input.buffer,
                    input.byteOffset,
                    input.byteLength,
                )
            : new Uint8Array();

        // prepend any pending bytes from previous stream
        const bytes = new Uint8Array(this.#pending.length + chunk.length);
        bytes.set(this.#pending, 0);
        bytes.set(chunk, this.#pending.length);
        const len = bytes.length;

        let i = 0;
        let result = "";

        // handle BOM only on first decode call
        if (
            !this.#ignoreBOM && this.#pending.length === 0 && len >= 3 &&
            bytes[0] === 0xEF && bytes[1] === 0xBB && bytes[2] === 0xBF
        ) {
            i = 3;
        }

        // decode loop, breaking on incomplete sequences
        while (i < len) {
            const a = bytes[i];
            // 1-byte (U+0001..U+007F)
            if ((a & 0x80) === 0) {
                result += String.fromCharCode(a);
                i++;
            } // 2-byte (U+0000 or U+0080..U+07FF)
            else if ((a & 0xE0) === 0xC0) {
                if (i + 1 >= len) break; // need more bytes for complete sequence
                const b = bytes[i + 1];
                const code = ((a & 0x1F) << 6) | (b & 0x3F);
                result += String.fromCharCode(code === 0 ? 0 : code);
                i += 2;
            } // 3-byte (U+0800..U+FFFF, including surrogates)
            else if ((a & 0xF0) === 0xE0) {
                if (i + 2 >= len) break; // need more bytes
                const b = bytes[i + 1];
                const c = bytes[i + 2];
                const code = ((a & 0x0F) << 12) | ((b & 0x3F) << 6) |
                    (c & 0x3F);
                result += String.fromCharCode(code);
                i += 3;
            } // invalid byte
            else {
                if (this.#fatal) {
                    throw new TypeError(
                        `Invalid modified UTF-8 byte 0x${a.toString(16)}`,
                    );
                }
                result += "\uFFFD";
                i++;
            }
        }

        // handle leftovers: buffer if streaming, else emit replacements or error
        if (options.stream) {
            this.#pending = bytes.slice(i);
        } else {
            this.#pending = new Uint8Array();
            while (i < len) {
                if (this.#fatal) {
                    throw new TypeError("Incomplete modified UTF-8 sequence");
                }
                result += "\uFFFD";
                i++;
            }
        }

        return result;
    }

    get encoding(): string {
        return "modified-utf8";
    }

    get fatal(): boolean {
        return this.#fatal;
    }

    get ignoreBOM(): boolean {
        return this.#ignoreBOM;
    }
}
