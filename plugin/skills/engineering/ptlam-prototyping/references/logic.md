# Logic Prototype

This file covers the logic branch: one self-contained HTML file that lets a
non-developer drive business logic, state changes, data shapes, or a method
surface and see the whole relevant state change.

## Shape the demo

| Concern      | Required shape                                                                                |
| ------------ | --------------------------------------------------------------------------------------------- |
| Delivery     | One `.html` file with inline HTML, CSS, and JavaScript; no install, server, or external asset |
| Question     | A visible introduction states the model, the question, and the decision it informs            |
| Logic        | One pure reducer, state machine, function set, or stateful module in one script block         |
| State        | Labeled domain fields and a short last-change summary re-render after every action            |
| Free play    | One always-available button per action, so the evaluator can try any order                    |
| Walkthroughs | Scenario tabs that reset to known state and expose ordered action buttons                     |
| Language     | Labels describe the domain, not code identifiers                                              |
| Presentation | Clean hierarchy, restrained color, no animation; attention stays on state and actions         |

Pick the logic form that makes the question literal:

| The question is about                             | Form                                          |
| ------------------------------------------------- | --------------------------------------------- |
| Discrete actions changing one state value         | Pure reducer                                  |
| Which actions are legal in the current state      | Explicit state machine                        |
| Plain values transformed with no hidden state     | A small set of pure functions                 |
| A concept that really owns ongoing internal state | A class or module with a small method surface |

The page calls the logic module. The module never touches the DOM or the
buttons. Keep it pure so it is easy to inspect and translate later. It stays
prototype code and is not copied into production.

## Build the demo

1. Write the question, the initial state, the domain terms, the actions, the
   invariants, and the illegal or awkward cases the evaluator must try.
2. Implement the smallest logic module that covers those cases. Return or reject
   every action explicitly so the page can say what happened.
3. Build the page in this order: prototype label and question, current-state
   panel, free-play actions, then guided scenario tabs.
4. Include at least a happy path, a tricky edge case, and an illegal attempt.
   Each scenario starts from a deterministic reset and uses the real action
   buttons, not a separate simulation.
5. Open the file directly. Click every action, run every walkthrough, reset
   again, and confirm rejected actions leave valid state.

Done when someone can double-click one file, understand the question without
code context, drive every action, and see why the model does or does not feel
right.

## Keep the question cheap

Use in-memory state unless persistence is the question. Add no framework,
bundler, dev server, test suite, speculative case, general abstraction, or
production error layer. Repair only what stops the evaluator from running the
scenarios or trusting the displayed state.
