// Copyright 2025-2025 kokiriglade. MIT license.

import type { Func } from "./mod.ts";

/**
 * A function that supplies a value of type `T` with no input.
 *
 * @template T Output type
 * @returns Value of type T
 */
export type Supplier<T> = Func<void, T>;
