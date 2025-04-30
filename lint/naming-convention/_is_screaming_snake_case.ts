// Copyright 2025-2025 kokiriglade. MIT license.

const SCREAMING_SNAKE_CASE_REGEXP = /^[A-Z][A-Z0-9]*(?:_[A-Z0-9]+)*_?$/;

/**
 * Checks if the given string is `SCREAMING_SNAKE_CASE`.
 * @param string the string to check
 * @returns `true` if the string is `SCREAMING_SNAKE_CASE`; `false` otherwise
 */
export function isScreamingSnakeCase(string: string): boolean {
    return SCREAMING_SNAKE_CASE_REGEXP.test(string);
}
