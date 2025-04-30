// Copyright 2025-2025 kokiriglade. MIT license.

/**
 * This module provides an assertion to assist in testing `deno lint` plugins.
 *
 * @example assertLintPluginDiagnostics
 * ```ts
 * import { assertLintPluginDiagnostics } from "@kokiri/lint-assert";
 *
 * const plugin: Deno.lint.Plugin = {
 *     name: "always-fail-rule",
 *     rules: {
 *         "always-fail": {
 *             create(context): Deno.lint.LintVisitor {
 *                 return {
 *                     Program(_): void {
 *                         context.report({
 *                             range: [ 69, 420 ],
 *                             message: "epic fail"
 *                         });
 *                     }
 *                 }
 *             }
 *         }
 *     }
 * }
 *
 * // this will pass
 * assertLintPluginDiagnostics(
 *     "console.log('hello, world!')",
 *     plugin,
 *     [
 *         {
 *             fix: [],
 *             hint: undefined,
 *             id: "always-fail-rule/always-fail",
 *             message: "epic fail",
 *             range: [ 69, 420 ]
 *         }
 *     ]
 * );
 * ```
 *
 * @module
 */
export * from "./assert_lint_plugin_diagnostics.ts";
