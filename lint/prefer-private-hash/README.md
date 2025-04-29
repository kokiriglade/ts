# prefer-private-hash

A Deno lint plugin that disallows use of the `private` keyword, in favour of
hash notation.

```jsonc
// deno.json
{
    "lint": {
        "plugins": ["jsr:@kokiri/prefer-private-hash"]
    }
}
```

## Failing example

```ts
class Foo {
    private value: string; // fails: uses `private` keyword

    private constructor() { // allowed: constructors can use the `private` keyword
        this.value = "bar";
    }
}
```

## Passing example

```ts
class Foo {
    #value: string; // allowed: uses the hash prefix

    private constructor() { // allowed: constructors can use the `private` keyword
        this.#value = "bar";
    }
}
```
