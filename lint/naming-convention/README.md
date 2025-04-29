# naming-convention

A Deno lint plugin that enforces some naming conventions.

```jsonc
// deno.json
{
    "lint": {
        "plugins": ["jsr:@kokiri/naming-convention"]
    }
}
```

## Failing example

```ts
interface User {
    First_Name: string; // fails: not camelCase
    Last_Name: string; // fails: not camelCase
}

class Example {
    BadProperty: string; // fails: not camelCase
    static lowerCaseStatic = "value"; // fails: not SCREAMING_SNAKE_CASE

    constructor() {
        this.BadProperty = "not camelCase";
    }

    BadMethod_Name() { // fails: not camelCase
        return this.BadProperty;
    }
}
```

## Passing example

```ts
interface User {
    firstName: string; // allowed: in camelCase
    lastName: string; // allowed: in camelCase
}

class Example {
    goodProperty: string; // allowed: in camelCase
    static SCREAMING_SNAKE_CASE = "value"; // allowed: in SCREAMING_SNAKE_CASE

    constructor() {
        this.goodProperty = "in camelCase";
    }

    goodMethodName() { // allowed: in camelCase
        return this.goodProperty;
    }
}
```
