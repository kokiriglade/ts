// Copyright 2025-2025 kokiriglade. MIT license.

import { assert, assertEquals, assertFalse } from "@std/assert";
import { isPair, type Pair, pair } from "./mod.ts";

Deno.test("pair creates correct first and second values", () => {
    const p: Pair<number, string> = pair(42, "answer");
    assertEquals(p.first, 42);
    assertEquals(p.second, "answer");
});

Deno.test("swap returns a new Pair with elements swapped and does not mutate original", () => {
    const original = pair(1, 2);
    const swapped = original.swap();
    assertEquals(swapped.first, 2);
    assertEquals(swapped.second, 1);

    assertEquals(original.first, 1);
    assertEquals(original.second, 2);
});

Deno.test("mapFirst transforms only the first element and preserves second", () => {
    const p = pair(3, "x");
    const mapped = p.mapFirst((n) => n * 2);
    assertEquals(mapped.first, 6);
    assertEquals(mapped.second, "x");

    assertEquals(p.first, 3);
});

Deno.test("mapSecond transforms only the second element and preserves first", () => {
    const p = pair("foo", 10);
    const mapped = p.mapSecond((n) => n + 5);
    assertEquals(mapped.first, "foo");
    assertEquals(mapped.second, 15);

    assertEquals(p.second, 10);
});

Deno.test("isPair correctly identifies Pair instances and rejects others", () => {
    // deno-lint-ignore no-boolean-literal-for-arguments
    const p = pair(true, null);
    assert(isPair(p));
    assertFalse(isPair({}));
    assertFalse(isPair(null));
    assertFalse(isPair(123));
});

Deno.test("chainable operations: swap, mapFirst, mapSecond", () => {
    const result = pair(2, 3)
        .mapFirst((n) => n + 1)
        .mapSecond((n) => n * 3)
        .swap();

    assertEquals(result.first, 9);
    assertEquals(result.second, 3);
});
