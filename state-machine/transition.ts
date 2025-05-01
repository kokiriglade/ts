// Copyright 2025-2025 kokiriglade. MIT license.

/**
 * Represents a transition between states in a state machine.
 * @template T the context type
 */
export interface Transition<T> {
    /**
     * Gets the source state ID for this transition.
     */
    readonly fromStateId: string;

    /**
     * Gets the target state ID for this transition.
     */
    readonly toStateId: string;

    /**
     * Determines whether this transition should be triggered.
     * @param context The context object that provides data and functionality to the transition
     * @returns `true` if the transition should be triggered, `false` otherwise
     */
    condition(context: T): boolean;
}
