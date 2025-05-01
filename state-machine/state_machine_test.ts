// Copyright 2025-2025 kokiriglade. MIT license.

import { assert, assertEquals, assertFalse, assertThrows } from "@std/assert";
import { type State, StateMachineBuilder, type Transition } from "./mod.ts";

interface TestContext {
    counter: number;
    flag: boolean;
}

const STATE_A: State<TestContext> = {
    id: "STATE_A",
    onEnter: (context) => {
        context.counter += 1;
    },
    onExit: (context) => {
        context.counter += 10;
    },
    onUpdate: (context, deltaTime) => {
        context.counter += deltaTime;
    },
};

const STATE_B: State<TestContext> = {
    id: "STATE_B",
    onEnter: (context) => {
        context.counter += 100;
    },
    onExit: (context) => {
        context.counter += 1000;
    },
    onUpdate: (context, deltaTime) => {
        context.counter += deltaTime * 2;
    },
};

const TRANSITION_A_TO_B: Transition<TestContext> = {
    fromStateId: "STATE_A",
    toStateId: "STATE_B",
    condition: (context) => context.flag,
};

const TRANSITION_B_TO_A: Transition<TestContext> = {
    fromStateId: "STATE_B",
    toStateId: "STATE_A",
    condition: (context) => !context.flag,
};

Deno.test("Basic functionality", () => {
    const context: TestContext = { counter: 0, flag: false };

    const stateMachine = new StateMachineBuilder<TestContext>()
        .withInitialState("STATE_A")
        .withState(STATE_A)
        .withState(STATE_B)
        .withTransition(TRANSITION_A_TO_B)
        .withTransition(TRANSITION_B_TO_A)
        .build(context);

    // initial state should be STATE_A
    assertEquals(stateMachine.currentState, "STATE_A");

    // onEnter should have been called for STATE_A
    assertEquals(context.counter, 1);

    stateMachine.update(5);
    assertEquals(stateMachine.currentState, "STATE_A");
    assertEquals(context.counter, 6); // 1 (initial) + 5 (update)

    // trigger transition to STATE_B
    context.flag = true;
    stateMachine.update(10);
    assertEquals(stateMachine.currentState, "STATE_B");

    // onExit should have been called for STATE_A and onEnter for STATE_B
    assertEquals(context.counter, 126); // 6 (previous) + 10 (update A) + 10 (exit A) + 100 (enter B)

    // update in STATE_B
    stateMachine.update(5);
    assertEquals(stateMachine.currentState, "STATE_B");
    assertEquals(context.counter, 136); // 126 (previous) + 5*2 (update B)

    // trigger transition back to STATE_A
    context.flag = false;
    stateMachine.update(10);
    assertEquals(stateMachine.currentState, "STATE_A");

    // onExit should have been called for STATE_B and onEnter for STATE_A
    assertEquals(context.counter, 1157); // 136 (previous) + 1000 (exit B) + 1 (enter A) + 20 (update B before transition)

    // manual transition
    stateMachine.transitionTo("STATE_B");
    assertEquals(stateMachine.currentState, "STATE_B");
    assertEquals(context.counter, 1267); // 1157 (previous) + 10 (exit A) + 100 (enter B)
});

Deno.test("Error handling", () => {
    const context: TestContext = { counter: 0, flag: false };

    assertThrows(
        () => {
            new StateMachineBuilder<TestContext>()
                .withState(STATE_A)
                .build(context);
        },
        Error,
        "Initial state ID not set",
    );

    assertThrows(
        () => {
            new StateMachineBuilder<TestContext>()
                .withInitialState("INVALID_STATE")
                .withState(STATE_A)
                .build(context);
        },
        Error,
        'Optional is empty',
    );

    const stateMachine = new StateMachineBuilder<TestContext>()
        .withInitialState("STATE_A")
        .withState(STATE_A)
        .build(context);

    assertThrows(
        () => stateMachine.transitionTo("INVALID_STATE"),
        Error,
        'Optional is empty',
    );
});

Deno.test("isInState", () => {
    const context: TestContext = { counter: 0, flag: false };

    const stateMachine = new StateMachineBuilder<TestContext>()
        .withInitialState("STATE_A")
        .withState(STATE_A)
        .withState(STATE_B)
        .build(context);

    assert(stateMachine.isInState("STATE_A"));
    assertFalse(stateMachine.isInState("STATE_B"));

    stateMachine.transitionTo("STATE_B");
    assertFalse(stateMachine.isInState("STATE_A"));
    assert(stateMachine.isInState("STATE_B"));
});
