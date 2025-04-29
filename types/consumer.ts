// Copyright 2025-2025 kokiriglade. MIT license.

import type { Func } from "./mod.ts";

/**
 * A function that consumes a value of type `T` without returning anything.
 *
 * @template T Input type
 * @param t Value to be consumed
 */
export type Consumer<T> = Func<T, void>;
