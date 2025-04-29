// Copyright 2025-2025 kokiriglade. MIT license.

import {
    assert,
    assertEquals,
    assertFalse,
    assertStrictEquals,
    assertThrows,
} from "@std/assert";
import { isResult, resultError, resultOk } from "./mod.ts";

Deno.test("resultOk creates a success result", () => {
    const ok = resultOk<number, Error>(10);
    assert(ok.isOk, "Expected isOk to be true");
    assertFalse(ok.isError);

    const valOpt = ok.unwrap();
    assert(valOpt.isPresent);
    assertEquals(valOpt.unwrap(), 10);

    assertEquals(ok.unwrapOr(5), 10);
    assertEquals(ok.unwrapOrElse(() => 5), 10);

    const errOpt = ok.unwrapError();
    assertFalse(errOpt.isPresent);
    assertStrictEquals(errOpt.unwrap(), null);
    assertThrows(
        () => errOpt.unwrapOrThrow(),
        Error,
        "Optional is empty",
    );

    const defaultErr = new Error("no error");
    assertEquals(ok.unwrapErrorOr(defaultErr), defaultErr);
    assertEquals(ok.unwrapErrorOrElse(() => defaultErr), defaultErr);

    assertThrows(
        () => ok.unwrapErrorOrThrow(() => new Error("fail")),
        Error,
        "fail",
    );
});

Deno.test("resultError creates an error result", () => {
    const err = new Error("oops");
    const er = resultError<number, Error>(err);
    assert(er.isError);
    assertFalse(er.isOk);

    const errOpt = er.unwrapError();
    assert(errOpt.isPresent);
    assertEquals(errOpt.unwrap(), err);

    assertEquals(er.unwrapErrorOr(new Error("def")), err);
    assertEquals(er.unwrapErrorOrElse(() => new Error("def2")), err);
    assertEquals(er.unwrapErrorOrThrow(() => new Error("should not")), err);

    const valOpt = er.unwrap();
    assertFalse(valOpt.isPresent);
    assertStrictEquals(valOpt.unwrap(), null);
    assertThrows(
        () => valOpt.unwrapOrThrow(),
        Error,
        "Optional is empty",
    );

    assertEquals(er.unwrapOr(5), 5);
    assertEquals(er.unwrapOrElse(() => 6), 6);

    assertThrows(
        () => er.unwrapOrThrow(() => new Error("no value")),
        Error,
        "no value",
    );
});

Deno.test("resultError fails when not given an error", () => {
    assertThrows(
        // @ts-expect-error: purpose of test
        () => resultError("not an error"),
        Error,
        "`error` must be instanceof Error",
    );
});

Deno.test("ifOk and ifError execute callbacks correctly", () => {
    let seen: unknown = null;
    const ok = resultOk<string, Error>("hi");
    ok.ifOk((v) => {
        seen = `ok:${v}`;
    });
    assertEquals(seen, "ok:hi");

    seen = null;
    ok.ifError((e) => {
        seen = `err:${e.message}`;
    });
    assertStrictEquals(seen, null);

    const errRes = resultError<number, Error>(new Error("fail"));
    errRes.ifError((e) => {
        seen = `err:${e.message}`;
    });
    assertEquals(seen, "err:fail");
    seen = null;
    errRes.ifOk((v) => {
        seen = `ok:${v}`;
    });
    assertStrictEquals(seen, null);
});

Deno.test("map and mapError transform correctly", () => {
    const ok = resultOk(3);
    const mapped = ok.map((n) => n * 2);
    assert(mapped.isOk);
    assertEquals(mapped.unwrap().unwrap(), 6);

    const err = new Error("err");
    const er = resultError<number, Error>(err);
    const mapErr = er.map((n) => n * 2);
    assert(mapErr.isError);
    assertEquals(mapErr.unwrapError().unwrap(), err);

    const mapErr2 = er.mapError((e) => new Error(e.message + "!"));
    assert(mapErr2.isError);
    assertEquals(mapErr2.unwrapError().unwrapOrThrow().message, "err!");

    const mapErr3 = ok.mapError((_) => new Error("nope"));
    assert(mapErr3.isOk);
    assertEquals(mapErr3.unwrap().unwrap(), 3);
});

Deno.test("flatMap chains results", () => {
    const ok = resultOk(2);
    const chained = ok.flatMap((n) => resultOk(n + 3));
    assert(chained.isOk);
    assertEquals(chained.unwrap().unwrap(), 5);

    const err = new Error("fail");
    const er = resultError<number, Error>(err);
    const flatErr = er.flatMap((n) => resultOk(n + 3));
    assert(flatErr.isError);
    assertEquals(flatErr.unwrapError().unwrap(), err);
});

Deno.test("match dispatches to correct handler", () => {
    const ok = resultOk("yes");
    const v1 = ok.match({ ok: (v) => `ok:${v}`, error: () => "err" });
    assertEquals(v1, "ok:yes");

    const er = resultError<string, Error>(new Error("no"));
    const v2 = er.match({ ok: () => "ok", error: (e) => `err:${e.message}` });
    assertEquals(v2, "err:no");
});

Deno.test("isResult identifies Result instances", () => {
    const ok = resultOk(1);
    const er = resultError(new Error("e"));
    assert(isResult(ok));
    assert(isResult(er));
    assertFalse(isResult({}));
});
