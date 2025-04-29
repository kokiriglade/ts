// Copyright 2025-2025 kokiriglade. MIT license.

import { isCamelCase } from "./_is_camel_case.ts";
import { isScreamingSnakeCase } from "./_is_screaming_snake_case.ts";

/** A lint plugin that enforces some naming conventions. */
export default {
    name: "naming-convention-rule",
    rules: {
        "naming-convention": {
            create(context): Deno.lint.LintVisitor {
                return {
                    TSInterfaceBody(node): void {
                        for (const body of node.body) {
                            if (body.type === "TSPropertySignature") {
                                const propertySig =
                                    body as Deno.lint.TSPropertySignature;
                                if (propertySig.key.type === "Identifier") {
                                    if (!isCamelCase(propertySig.key.name)) {
                                        context.report({
                                            node: propertySig.key,
                                            range: propertySig.key.range,
                                            message:
                                                `Inteface property '${propertySig.key.name}' is not \`camelCase\`.`,
                                        });
                                    }
                                }
                            }
                        }
                    },
                    MethodDefinition(node): void {
                        const key = node.key;
                        switch (key.type) {
                            case ("Identifier"):
                            case ("PrivateIdentifier"): {
                                const name = key.name;
                                if (!name) return;
                                if (
                                    !isCamelCase(name)
                                ) {
                                    context.report({
                                        node: key,
                                        range: key.range,
                                        message:
                                            `Method '${name}' is not camelCase.`,
                                    });
                                }
                            }
                        }
                    },
                    PropertyDefinition(node): void {
                        const key = node.key;
                        switch (key.type) {
                            case ("Identifier"):
                            case ("PrivateIdentifier"): {
                                const name = key.name;
                                if (!name) return;
                                if (!isCamelCase(name) && !node.static) {
                                    context.report({
                                        node: key,
                                        range: key.range,
                                        message:
                                            `Property name '${name}' is not \`camelCase\`.`,
                                    });
                                } else if (
                                    !isScreamingSnakeCase(name) && node.static
                                ) {
                                    context.report({
                                        node: key,
                                        range: key.range,
                                        message:
                                            `Static property name '${name}' is not \`SCREAMING_SNAKE_CASE\`.`,
                                    });
                                }
                                break;
                            }
                            default:
                                break;
                        }
                    },
                };
            },
        },
    },
} as Deno.lint.Plugin;
