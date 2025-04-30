// Copyright 2025-2025 kokiriglade. MIT license.

import { assertLintPluginDiagnostics } from "@kokiri/lint-assert";
import { assertThrows } from "@std/assert";

const plugin: Deno.lint.Plugin = {
    name: "always-fail-rule",
    rules: {
        "always-fail": {
            create(context): Deno.lint.LintVisitor {
                return {
                    Program(_): void {
                        context.report({
                            range: [69, 420],
                            message: "epic fail",
                        });
                    },
                };
            },
        },
    },
};

Deno.test("correct assertion does not throw", () => {
    // should not throw
    assertLintPluginDiagnostics(
        "console.log('hello, world!')",
        plugin,
        [
            {
                fix: [],
                hint: undefined,
                id: "always-fail-rule/always-fail",
                message: "epic fail",
                range: [69, 420],
            },
        ],
    );
});

Deno.test("incorrect assertion does throw", () => {
    assertThrows(() => {
        assertLintPluginDiagnostics(
            "console.log('hello, world!')",
            plugin,
            [
                {
                    fix: [],
                    hint: undefined,
                    id: "always-fail-rule/always-fail",
                    message: "this message is incorrect",
                    range: [69, 420],
                },
            ],
        );
    });
});
