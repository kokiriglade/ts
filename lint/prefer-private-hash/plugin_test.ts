// Copyright 2025-2025 kokiriglade. MIT license.

import { assertLintPluginDiagnostics } from "@kokiri/lint-assert";
import preferPrivateHashPlugin from "./plugin.ts";

Deno.test("prefer-private-hash failing case", () => {
    assertLintPluginDiagnostics(
        `
class Foo {
    private value: string;
    
    private constructor() {
        this.value = "bar";
    }
    
    private withDollar(): string {
        return this.value + "$";
    }
}
        `,
        preferPrivateHashPlugin,
        [
            {
                fix: [],
                hint:
                    "Use `#` instead of the `private` keyword. For example, use `#foo` instead of `private foo`.",
                id: "prefer-private-hash-rule/prefer-private-hash",
                message: "Property uses `private` keyword",
                range: [17, 39],
            },
            {
                fix: [],
                hint:
                    "Use `#` instead of the `private` keyword. For example, use `#foo()` instead of `private foo()`.",
                id: "prefer-private-hash-rule/prefer-private-hash",
                message: "Method uses `private` keyword",
                range: [116, 185],
            },
        ],
    );
});

Deno.test("prefer-private hash passing case", () => {
    assertLintPluginDiagnostics(
        `
class Foo {
    #value: string;
    
    private constructor() {
        this.#value = "bar";
    }
    
    #withDollar(): string {
        return this.#value + "$";
    }
}
        `,
        preferPrivateHashPlugin,
        [],
    );
});
