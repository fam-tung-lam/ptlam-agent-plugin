# Logic Prototype

This reference owns the logic branch: one self-contained HTML file that lets a
non-developer drive business logic, state transitions, data shapes, or a method
surface and see the complete relevant state change.

## Shape the logic demo

| Concern      | Required shape                                                                                 |
| ------------ | ---------------------------------------------------------------------------------------------- |
| Delivery     | One `.html` file with inline HTML, CSS, and JavaScript; no install, server, or external asset. |
| Question     | A visible introduction states the model, question, and decision it informs.                    |
| Logic        | One pure reducer, state machine, function set, or stateful module inside one script block.     |
| State        | Labeled domain fields and a concise last-change summary rerender after every action.           |
| Free play    | One always-available button per action lets the evaluator try any order.                       |
| Walkthroughs | Scenario tabs reset known state and expose ordered action buttons.                             |
| Language     | Labels describe the domain rather than code identifiers.                                       |
| Presentation | Clean hierarchy, restrained color, and no animation keep attention on state and actions.       |

Choose the logic form that makes the question literal:

| Question characteristic                           | Form                                        |
| ------------------------------------------------- | ------------------------------------------- |
| Discrete actions transform one state value        | Pure reducer                                |
| Legal actions depend on the current state         | Explicit state machine                      |
| Plain values are transformed without hidden state | Small set of pure functions                 |
| The concept genuinely owns ongoing internal state | Class or module with a small method surface |

The page calls the logic module. The logic module never reaches into the DOM or
button handlers. Keep it pure so its behavior is easy to inspect and translate
later. It remains prototype code and is not copied into production.

## Build the demo

1. Write the question, initial state, domain terms, actions, invariants, and the
   illegal or awkward cases the evaluator must probe.
2. Implement the smallest logic module that represents those cases. Return or
   reject every action explicitly so the page can explain what happened.
3. Build the page in this order: prototype label and question, current-state
   panel, free-play actions, then guided scenario tabs.
4. Include at least a happy path, a tricky edge case, and an illegal attempt.
   Each scenario starts from a deterministic reset and uses the real action
   buttons rather than a separate simulation.
5. Open the file directly. Click every free-play action, complete every
   walkthrough, repeat a reset, and confirm rejected actions leave valid state.

Complete this branch when a recipient can double-click one file, understand the
question without code context, drive every action, and see why the model does or
does not feel right.

## Keep the question cheap

Use in-memory state unless persistence is the question. Add no framework,
bundler, development server, test suite, speculative case, generalized
abstraction, or production error layer. Repair only what prevents the evaluator
from running the scenarios or trusting the displayed state.
