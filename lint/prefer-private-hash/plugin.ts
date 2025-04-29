// Copyright 2025-2025 kokiriglade. MIT license.

/** A lint plugin that disallows use of the `private` keyword, in favour of hash notation. */
export default {
    name: "prefer-private-hash-rule",
    rules: {
        "prefer-private-hash": {
            create(context: Deno.lint.RuleContext): Deno.lint.LintVisitor {
                return {
                    MethodDefinition(node): void {
                        if (node.accessibility !== "private") return;
                        if (node.kind === "constructor") return;
                        context.report({
                            node,
                            range: node.range,
                            message: "Method uses `private` keyword",
                            hint:
                                "Use `#` instead of the `private` keyword. For example, use `#foo()` instead of `private foo()`.",
                        });
                    },
                    PropertyDefinition(node): void {
                        if (node.accessibility !== "private") return;
                        context.report({
                            node,
                            range: node.range,
                            message: "Property uses `private` keyword",
                            hint:
                                "Use `#` instead of the `private` keyword. For example, use `#foo` instead of `private foo`.",
                        });
                    },
                };
            },
        },
    },
} as Deno.lint.Plugin;
