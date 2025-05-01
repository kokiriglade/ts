// Copyright 2025-2025 kokiriglade. MIT license.

import type { State, StateMachineConfig, Transition } from "./mod.ts";
import type { Nullable } from "@kokiri/types";

/**
 * A general-purpose state machine implementation.
 * @template T the context type
 */
export class StateMachine<T> {
    readonly #states: Map<string, State<T>> = new Map();
    readonly #transitions: Transition<T>[] = [];
    #currentStateId: string;
    readonly #context: T;

    /**
     * Creates a new state machine.
     * @param config The configuration for the state machine
     * @param context The context object that provides data and functionality to the states and transitions
     */
    constructor(config: StateMachineConfig<T>, context: T) {
        this.#context = context;

        // register states
        for (const state of config.states) {
            this.#states.set(state.id, state);
        }

        // register transitions
        this.#transitions = [...config.transitions];

        // set initial state
        this.#currentStateId = config.initialStateId;
        const initialState = this.#states.get(this.#currentStateId);
        if (!initialState) {
            throw new Error(
                `Initial state "${this.#currentStateId}" not found`,
            );
        }

        // enter initial state
        if (initialState.onEnter) {
            initialState.onEnter(this.#context);
        }
    }

    /**
     * Gets the current state ID.
     */
    get currentState(): string {
        return this.#currentStateId;
    }

    /**
     * Updates the state machine, checking for transitions and calling the current state's `onUpdate` method.
     * @param deltaTime The time elapsed since the last update, in milliseconds
     */
    update(deltaTime: number): void {
        // checking for transitions
        const current_state = this.#states.get(this.#currentStateId);
        if (!current_state) {
            throw new Error(
                `Current state "${this.#currentStateId}" not found`,
            );
        }

        const eligibleTransitions = this.#transitions.filter(
            (transition) =>
                transition.fromStateId === this.#currentStateId &&
                transition.condition(this.#context),
        );

        if (eligibleTransitions.length > 0) {
            const transition = eligibleTransitions[0];
            this.transitionTo(transition.toStateId);
        }

        if (current_state.onUpdate) {
            current_state.onUpdate(this.#context, deltaTime);
        }
    }

    /**
     * Forces a transition to the specified state.
     * @param stateId The ID of the state to transition to
     */
    transitionTo(stateId: string): void {
        const targetState = this.#states.get(stateId);
        if (!targetState) {
            throw new Error(`Target state "${stateId}" not found`);
        }

        const current_state = this.#states.get(this.#currentStateId);
        if (!current_state) {
            throw new Error(
                `Current state "${this.#currentStateId}" not found`,
            );
        }

        if (current_state.onExit) {
            current_state.onExit(this.#context);
        }

        this.#currentStateId = stateId;

        if (targetState.onEnter) {
            targetState.onEnter(this.#context);
        }
    }

    /**
     * Checks if the state machine is in the specified state.
     * @param stateId The ID of the state to check
     * @returns True if the state machine is in the specified state, false otherwise
     */
    isInState(stateId: string): boolean {
        return this.#currentStateId === stateId;
    }
}

/**
 * A builder for creating state machines.
 */
export class StateMachineBuilder<T> {
    #initialStateId: Nullable<string> = null;
    #states: State<T>[] = [];
    #transitions: Transition<T>[] = [];

    /**
     * Sets the initial state for the state machine.
     * @param stateId The ID of the initial state
     * @returns The builder instance for method chaining
     */
    withInitialState(stateId: string): StateMachineBuilder<T> {
        this.#initialStateId = stateId;
        return this;
    }

    /**
     * Adds a state to the state machine.
     * @param state The state to add
     * @returns The builder instance for method chaining
     */
    withState(state: State<T>): StateMachineBuilder<T> {
        this.#states.push(state);
        return this;
    }

    /**
     * Adds a transition to the state machine.
     * @param transition The transition to add
     * @returns The builder instance for method chaining
     */
    withTransition(transition: Transition<T>): StateMachineBuilder<T> {
        this.#transitions.push(transition);
        return this;
    }

    /**
     * Builds the state machine.
     * @param context The context object that provides data and functionality to the states and transitions
     * @returns A new state machine instance
     */
    build(context: T): StateMachine<T> {
        if (!this.#initialStateId) {
            throw new Error("Initial state ID not set");
        }

        return new StateMachine<T>(
            {
                initialStateId: this.#initialStateId,
                states: this.#states,
                transitions: this.#transitions,
            },
            context,
        );
    }
}
