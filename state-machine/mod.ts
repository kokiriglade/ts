// Copyright 2025-2025 kokiriglade. MIT license.

/**
 * A flexible state machine that can be used to model complex behaviors.
 *
 * @example
 * ```ts
 * import { StateMachine, StateMachineBuilder, State, Transition } from "@kokiri/state-machine";
 * import { assert, assertEquals } from "@std/assert";
 *
 * // define a context type for our state machine
 * interface PlayerContext {
 *     health: number;
 *     isMoving: boolean;
 * }
 *
 * // create a context instance
 * const playerContext: PlayerContext = {
 *     health: 100,
 *     isMoving: false
 * };
 *
 * // create a state machine
 * const stateMachine = new StateMachineBuilder<PlayerContext>()
 *     .withInitialState("idle")
 *     .withState({
 *         id: "idle",
 *         onEnter: (context) => {
 *             context.isMoving = false;
 *         }
 *     })
 *     .withState({
 *         id: "moving",
 *         onEnter: (context) => {
 *             context.isMoving = true;
 *         }
 *     })
 *     .withState({
 *         id: "damaged",
 *         onEnter: (context) => {
 *             context.health -= 10;
 *         }
 *     })
 *     .withTransition({
 *         fromStateId: "idle",
 *         toStateId: "moving",
 *         condition: (context) => context.isMoving
 *     })
 *     .withTransition({
 *         fromStateId: "moving",
 *         toStateId: "idle",
 *         condition: (context) => !context.isMoving
 *     })
 *     .withTransition({
 *         fromStateId: "idle",
 *         toStateId: "damaged",
 *         condition: (context) => context.health < 50
 *     })
 *     .build(playerContext);
 *
 * // use the state machine
 * assertEquals(stateMachine.currentState, "idle");
 *
 * // update the state machine
 * stateMachine.update(16); // 16ms elapsed
 *
 * // force a transition
 * playerContext.isMoving = true;
 * stateMachine.update(16); // will transition to "moving" state
 * assertEquals(stateMachine.currentState, "moving");
 * assert(stateMachine.isInState("moving"));
 *
 * // force transition back to idle
 * stateMachine.transitionTo("idle");
 * ```
 *
 * @module
 */
export * from "./state_machine.ts";
export * from "./state.ts";
export * from "./transition.ts";
export * from "./state_machine_config.ts";
