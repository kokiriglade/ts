// Copyright 2025-2025 kokiriglade. MIT license.

/**
 * Byte 0 of the UTF-8 BOM (0xEF) used to detect and skip a BOM at the start of a stream.
 */
export const BOM0 = 0xEF;
/**
 * Byte 1 of the UTF-8 BOM (0xBB) used to detect and skip a BOM at the start of a stream.
 */
export const BOM1 = 0xBB;
/**
 * Byte 2 of the UTF-8 BOM (0xBF) used to detect and skip a BOM at the start of a stream.
 */
export const BOM2 = 0xBF;

/**
 * Mask to check if the high bit of a byte is set (1000 0000). Indicates single-byte vs multi-byte.
 */
export const ONE_BYTE_MARKER = 0x80; // 1000 0000
/**
 * Mask to identify the 3-bit prefix of a 2-byte sequence (1110 0000).
 */
export const TWO_BYTE_MARKER = 0xE0; // 1110 0000
/**
 * Prefix bits for the leading byte of a 2-byte MUTF-8 sequence (1100 0000).
 */
export const TWO_BYTE_PREFIX = 0xC0; // 1100 0000
/**
 * Mask to identify the 4-bit prefix of a 3-byte sequence (1111 0000).
 */
export const THREE_BYTE_MARKER = 0xF0; // 1111 0000
/**
 * Prefix bits for the leading byte of a 3-byte UTF-8 sequence (1110 0000).
 */
export const THREE_BYTE_PREFIX = 0xE0; // 1110 0000

/**
 * Bitmask for extracting the low 6 bits of a UTF-8 continuation byte (0011 1111).
 */
export const MASK_6_BITS = 0x3F; // 0011 1111
/**
 * Bitmask for extracting the low 5 bits of a UTF-8 lead byte in 2-byte sequences (0001 1111).
 */
export const MASK_5_BITS = 0x1F; // 0001 1111
/**
 * Bitmask for extracting the low 4 bits of a UTF-8 lead byte in 3-byte sequences (0000 1111).
 */
export const MASK_4_BITS = 0x0F; // 0000 1111

/**
 * The Unicode code point for NUL (U+0000). Mapped specially in modified UTF-8.
 */
export const NUL_CODEPOINT = 0x0000;
/**
 * The first byte for encoding NUL in MUTF-8 (C0).
 */
export const NUL_MUTF8_PREFIX = TWO_BYTE_PREFIX;
/**
 * The second byte for encoding NUL in MUTF-8 (80).
 */
export const NUL_MUTF8_SUFFIX = 0x80;

/**
 * The replacement character used when encountering invalid or incomplete sequences.
 */
export const REPLACEMENT_CHAR = "\uFFFD";

/**
 * The encoding string required by encoder & decoder
 */
export const ENCODING = "modified-utf8";
