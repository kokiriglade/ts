// Copyright 2025-2025 kokiriglade. MIT license.

import { assert, assertFalse } from "@std/assert";
import { isScreamingSnakeCase } from "./_is_screaming_snake_case.ts";

Deno.test("non SCREAMING_SNAKE_CASE string is not detected as SCREAMING_SNAKE_CASE", () => {
    assertFalse(isScreamingSnakeCase("camelCase"));
    assertFalse(isScreamingSnakeCase("snake_case"));
    assertFalse(isScreamingSnakeCase("PascalCase"));
});

Deno.test("SCREAMING_SNAKE_CASE string is detected as SCREAMING_SNAKE_CASE", () => {
    assert(isScreamingSnakeCase("SCREAMING_SNAKE_CASE"));
});
