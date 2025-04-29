// Copyright 2018-2025 the Deno authors. MIT license.
// Copyright 2025-2025 kokiriglade. MIT license.

// deno-lint-ignore-file no-console
import { walk } from "@std/fs";
import { green, yellow } from "@std/fmt/colors";

const EXTENSIONS = [".mjs", ".js", ".ts"];

const ROOT = new URL("..", import.meta.url);
const CHECK = Deno.args.includes("--check");
const FIRST_YEAR = 2025;
const CURRENT_YEAR = new Date().getFullYear();
const RX_COPYRIGHT = new RegExp(
    `// Copyright ([0-9]{4})-([0-9]{4}) kokiriglade\\. MIT license\\.\n(\n|\/\/)`,
);
export const COPYRIGHT =
    `// Copyright ${FIRST_YEAR}-${CURRENT_YEAR} kokiriglade. MIT license.\n`;

let failed = false;

const start = performance.now();
let fileCount = 0;

console.info(`Checking sources for license headers...`);

for await (
    const { path } of walk(ROOT, { exts: EXTENSIONS, includeDirs: false })
) {
    const content = await Deno.readTextFile(path);
    const match = content.match(RX_COPYRIGHT);

    if (!match) {
        if (CHECK) {
            console.error(`Missing copyright header: ${path}`);
            failed = true;
        } else {
            const contentWithCopyright = COPYRIGHT + "\n" + content;
            await Deno.writeTextFile(path, contentWithCopyright);
            console.info(`Copyright header automatically added to ${path}`);
        }
    } else if (
        (match[1] && parseInt(match[1]) !== FIRST_YEAR) ||
        (match[2] && parseInt(match[2]) !== CURRENT_YEAR)
    ) {
        if (CHECK) {
            console.error(`Incorrect copyright year: ${path}`);
            failed = true;
        } else {
            const index = match.index ?? 0;
            const contentWithoutCopyright = content.replace(match[0], "");
            const contentWithCopyright =
                contentWithoutCopyright.substring(0, index) + COPYRIGHT + "\n" +
                contentWithoutCopyright.substring(index);
            await Deno.writeTextFile(path, contentWithCopyright);
            console.info(`Copyright header automatically added to ${path}`);
        }
    }
    fileCount++;
}

if (failed) {
    console.info(`Copyright header should be "${COPYRIGHT}"`);
    Deno.exit(1);
}

console.info(
    `Done! Checked ${yellow(String(fileCount))} files in ${
        green((performance.now() - start).toFixed(2) + "ms")
    }`,
);
