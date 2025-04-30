// Copyright 2025-2025 kokiriglade. MIT license.

import { assertLintPluginDiagnostics } from "@kokiri/lint-assert";
import namingConventionPlugin from "./plugin.ts";

Deno.test("naming-convention failing case", () => {
    assertLintPluginDiagnostics(
        `
interface User {
    First_Name: string;
    last_name: string;
    AGE: number;
}

class Example {
    BadProperty: string;
    static camelCaseStatic = "value";
    
    constructor() {
        this.BadProperty = "naughty";
    }
    
    badMethod_Name() {
        return this.BadProperty;
    }
}
        `,
        namingConventionPlugin,
        [
            {
                fix: [],
                hint: undefined,
                id: "naming-convention-rule/naming-convention",
                message: "Interface property 'First_Name' is not `camelCase`.",
                range: [22, 32],
            },
            {
                fix: [],
                hint: undefined,
                id: "naming-convention-rule/naming-convention",
                message: "Interface property 'last_name' is not `camelCase`.",
                range: [46, 55],
            },
            {
                fix: [],
                hint: undefined,
                id: "naming-convention-rule/naming-convention",
                message: "Interface property 'AGE' is not `camelCase`.",
                range: [69, 72],
            },
            {
                fix: [],
                hint: undefined,
                id: "naming-convention-rule/naming-convention",
                message: "Property name 'BadProperty' is not `camelCase`.",
                range: [105, 116],
            },
            {
                fix: [],
                hint: undefined,
                id: "naming-convention-rule/naming-convention",
                message:
                    "Static property name 'camelCaseStatic' is not `SCREAMING_SNAKE_CASE`.",
                range: [137, 152],
            },
            {
                fix: [],
                hint: undefined,
                id: "naming-convention-rule/naming-convention",
                message: "Method 'badMethod_Name' is not `camelCase`.",
                range: [242, 256],
            },
        ],
    );
});

Deno.test("naming-convention passing case", () => {
    assertLintPluginDiagnostics(
        `
interface User {
    firstName: string;
    lastName: string;
    age: number;
}

class Example {
    goodProperty: string;
    static SCREAMING_SNAKE_CASE_STATIC = "value";
    
    constructor() {
        this.goodProperty = "good";
    }
    
    goodMethodName() {
        return this.goodProperty;
    }
}
        `,
        namingConventionPlugin,
        [],
    );
});
