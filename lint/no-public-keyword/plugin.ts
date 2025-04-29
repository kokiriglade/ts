// Copyright 2025-2025 kokiriglade. MIT license.

/** A lint plugin that disallows use of the `public` keyword. */
export default {
    name: "no-public-keyword-rule",
    rules: {
        "no-public-keyword": {
            create(context): Deno.lint.LintVisitor {
                return {
                    MethodDefinition(node): void {
                        if (node.accessibility !== "public") return;
                        context.report({
                            node,
                            range: node.range,
                            message: "Method uses `public` keyword",
                            hint:
                                "Use of the `public` keyword is redundant. Methods are `public` by default unless prefixed with `#`.",
                        });
                    },
                    PropertyDefinition(node): void {
                        if (node.accessibility !== "public") return;
                        context.report({
                            node,
                            range: node.range,
                            message: "Property uses `public` keyword",
                            hint:
                                "Use of the `public` keyword is redundant. Properties are `public` by default unless prefixed with `#`.",
                        });
                    },
                };
            },
        },
    },
} as Deno.lint.Plugin;
