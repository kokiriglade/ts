// Copyright 2025-2025 kokiriglade. MIT license.

/**
 * Represents a state in a state machine.
 * @template T the context type
 */
export interface State<T> {
    /**
     * Gets the unique identifier for this state.
     */
    readonly id: string;

    /**
     * Called when the state machine enters this state.
     * @param context The context object that provides data and functionality to the state
     */
    onEnter?(context: T): void;

    /**
     * Called when the state machine exits this state.
     * @param context The context object that provides data and functionality to the state
     */
    onExit?(context: T): void;

    /**
     * Called on each update cycle while this state is active.
     * @param context The context object that provides data and functionality to the state
     * @param deltaTime The time elapsed since the last update, in milliseconds
     */
    onUpdate?(context: T, deltaTime: number): void;
}
