// Copyright 2025-2025 kokiriglade. MIT license.

import { assert, assertFalse } from "@std/assert";
import { isCamelCase } from "./_is_camel_case.ts";

Deno.test("non camelCase string is not detected as camelCase", () => {
    assertFalse(isCamelCase("SCREAMING_SNAKE_CASE"));
    assertFalse(isCamelCase("snake_case"));
    assertFalse(isCamelCase("PascalCase"));
});

Deno.test("camelCase string is detected as camelCase", () => {
    assert(isCamelCase("camelCase"));
});
