// Copyright 2025-2025 kokiriglade. MIT license.

import type { State, Transition } from "./mod.ts";

/**
 * Configuration options for a state machine.
 * @template T the context type
 */
export interface StateMachineConfig<T> {
    /**
     * Gets the initial state ID for the state machine.
     */
    initialStateId: string;

    /**
     * Gets the states in the state machine.
     */
    states: State<T>[];

    /**
     * Gets the transitions between states in the state machine.
     */
    transitions: Transition<T>[];
}
