// Copyright 2025-2025 kokiriglade. MIT license.

const CAMEL_CASE_REGEXP = /^[_a-z][a-z0-9]*(?:[A-Z][a-z0-9]*)*_?$/;

/**
 * Checks if the given string is `camelCase`.
 * @param string the string to check
 * @returns `true` if the string is `camelCase`; `false` otherwise
 */
export function isCamelCase(string: string): boolean {
    return CAMEL_CASE_REGEXP.test(string);
}
