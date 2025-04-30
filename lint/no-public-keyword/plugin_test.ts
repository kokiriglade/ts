// Copyright 2025-2025 kokiriglade. MIT license.

import { assertLintPluginDiagnostics } from "@kokiri/lint-assert";
import noPublicKeywordPlugin from "./plugin.ts";

Deno.test("no-public-keyword failing case", () => {
    assertLintPluginDiagnostics(
        `
class Foo {
    public value: string;
    
    public constructor() {
        this.value = "bar";
    }
    
    public withDollar(): string {
        return this.value + "$";
    }
}
        `,
        noPublicKeywordPlugin,
        [
            {
                fix: [],
                hint:
                    "Use of the `public` keyword is redundant. Properties are `public` implicitly.",
                id: "no-public-keyword-rule/no-public-keyword",
                message: "Property uses `public` keyword",
                range: [17, 38],
            },
            {
                fix: [],
                hint:
                    "Use of the `public` keyword is redundant. Methods are `public` implicitly.",
                id: "no-public-keyword-rule/no-public-keyword",
                message: "Method uses `public` keyword",
                range: [48, 104],
            },
            {
                fix: [],
                hint:
                    "Use of the `public` keyword is redundant. Methods are `public` implicitly.",
                id: "no-public-keyword-rule/no-public-keyword",
                message: "Method uses `public` keyword",
                range: [114, 182],
            },
        ],
    );
});

Deno.test("no-public-keyword passing case", () => {
    assertLintPluginDiagnostics(
        `
class Foo {
    value: string;
    
    constructor() {
        this.value = "bar";
    }
    
    withDollar(): string {
        return this.value + "$";
    }
}
        `,
        noPublicKeywordPlugin,
        [],
    );
});
