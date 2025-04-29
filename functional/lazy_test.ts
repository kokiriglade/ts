// Copyright 2025-2025 kokiriglade. MIT license.

import { assert, assertEquals, assertFalse } from "@std/assert";
import { isLazy, type Lazy, lazy } from "./mod.ts";

Deno.test("lazy value is not computed until accessed", () => {
    let called = 0;
    const supplier = () => {
        called++;
        return 123;
    };
    const lz: Lazy<number> = lazy(supplier);

    assert(isLazy(lz));
    assertFalse(lz.hasValue);
    assertEquals(called, 0);
});

Deno.test("lazy value computes on first access and caches result", () => {
    let called = 0;
    const supplier = () => {
        called++;
        return "result";
    };
    const lz: Lazy<string> = lazy(supplier);

    const first = lz.value;
    assertEquals(first, "result");
    assert(lz.hasValue);
    assertEquals(called, 1);

    const second = lz.value;
    assertEquals(second, "result");
    assertEquals(called, 1);
});

Deno.test("lazy value with error throwing supplier propagates exception", () => {
    const errorSupplier = () => {
        throw new Error("fail");
    };
    const lz: Lazy<number> = lazy(errorSupplier);

    let thrown = false;
    try {
        // @ts-ignore: intentionally ignoring types for test
        const _ = lz.value;
    } catch (e) {
        thrown = true;
        assertEquals((e as Error).message, "fail");
    }
    assert(thrown);
});

Deno.test("isLazy returns false for non-lazy", () => {
    assertFalse(isLazy("not a lazy"));
});
