// Copyright 2025-2025 kokiriglade. MIT license.

import type { Func } from "./mod.ts";

/**
 * A function that performs some operation with an object of type `T` to return a `boolean` value.
 *
 * @template T Input type
 * @returns Boolean
 */
export type Predicate<T> = Func<T, boolean>;
