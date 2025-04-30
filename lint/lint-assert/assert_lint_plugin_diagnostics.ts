// Copyright 2018-2025 the Deno authors. MIT license.
// Copyright 2025-2025 kokiriglade. MIT license.

import { assertEquals } from "@std/assert";

// source:
// https://github.com/denoland/std/blob/5ae11c2d421a118044615fd597671ce587637532/_tools/lint_plugin_test.ts#L6C1-L18C2
/**
 * Asserts that a lint plugin produces the expected diagnostics given some source code.
 * @param sourceCode the source code to lint
 * @param plugin the plugin to test with
 * @param expectedDiagnostics the expected diagnostics returned by the lint plugin
 */
export function assertLintPluginDiagnostics(
    sourceCode: string,
    plugin: Deno.lint.Plugin,
    expectedDiagnostics: Deno.lint.Diagnostic[],
): void {
    const actualDiagnostics = Deno.lint.runPlugin(plugin, "foo.ts", sourceCode);

    assertEquals(actualDiagnostics, expectedDiagnostics);
}
