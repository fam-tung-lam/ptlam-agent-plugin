# Testing

The project's test-level order, and where each level lives and runs in the
monorepo. The loaded skills own the container seam, entry-point harnesses, and
Vitest mechanics.

## Prove at the highest level first

The loaded rules add a higher level only for a risk a lower level cannot
establish. This project replaces that order: a passing request through the
assembled application tells the agent the whole path works, and a unit suite
alone cannot. Choose levels in this order and stop when the remaining risk is
covered:

| Order | Level               | Proves                                                                                            | Vitest project and path                          |
| ----- | ------------------- | ------------------------------------------------------------------------------------------------- | ------------------------------------------------ |
| 1     | Entry point         | The HTTP or transport contract through the assembled `AppModule` with supertest                   | `e2e`, `apps/.../test/<subject>.e2e-spec.ts`     |
| 2     | Application         | Global enhancers, configuration, routing, serialization, and shutdown                             | `e2e`, `apps/.../test/`                          |
| 3     | Module              | The feature module compiled with its real adapters; only the outermost external replaced by token | `e2e`, `features/.../test/<subject>.e2e-spec.ts` |
| 4     | Runner integration  | Queue, schedule, event, or CLI discovery and dispatch under its selected runner                   | `e2e`, in the owning package                     |
| 5     | Application context | Standalone DI lookup, entry-shell wiring, startup, and cleanup                                    | `e2e`, in the owning package                     |
| 6     | Behavioral unit     | Input combinations, failure mapping, and domain rules the levels above cannot reach economically  | `unit`, `<file>.spec.ts` beside its source       |

Every change to API-visible behavior adds or extends one entry-point test and
one module test in the owning feature. Add unit tests for the edge cases those
two leave uncovered; do not repeat their assertions. When a real resource such
as the database is unavailable locally, run the highest level that can, and name
the skipped level in the handoff.

A unit test constructs the class directly and never creates a `TestingModule`. A
module test compiles the narrowest real module that owns the behavior.

## Where tests run

The loaded skill's `tests/<feature>/unit/` tree does not apply here. Tests sit
where the Vitest projects find them: `<file>.spec.ts` beside its source for
`unit`, and `test/<subject>.e2e-spec.ts` for `e2e`. A feature package declares
the same two projects in its own `vitest.config.ts`.

Run one package with `pnpm --filter <package-name> test`, one project with
`pnpm test:unit` or `pnpm test:e2e` inside the package, and everything with
`pnpm test` from `src/api`. Follow the Given, When, Then comment shape the
existing spec files use.
