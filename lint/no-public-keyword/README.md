# no-public-keyword

A Deno lint plugin that disallows use of the `public` keyword.

```jsonc
// deno.json
{
    "lint": {
        "plugins": ["jsr:@kokiri/no-public-keyword"]
    }
}
```

## Failing example

```ts
class Foo {
    public value: string; // fails: uses `public` keyword

    public constructor() { // fails: `uses public` keyword
        this.value = "bar";
    }
}
```

## Passing example

```ts
class Foo {
    value: string; // allowed: public implicitly

    constructor() { // allowed: public implicitly
        this.value = "bar";
    }
}
```
