# Feature specification schema

This reference owns the feature-spec file shape, status transitions, and the
standard for ticket-planning readiness. Read it before writing or revising the
spec.

## File shape

Use every heading. Write `None` with a reason when a section does not apply.

```markdown
# Feature specification: <feature>

- Status: <draft | blocked | ready>
- Updated: <timestamp>
- Source scope: <PRD path and heading, or durable feature brief>
- Glossary: <path, or unavailable>

## Feature contract

<Who can do what, under which preconditions, and what observable result
follows.>

## Scope boundaries

### Included

<Behavior this feature owns.>

### Excluded

<Adjacent behavior this feature deliberately leaves out.>

## Behavior

### <B-01: descriptive behavior>

- Given: <observable starting state>
- When: <actor or system action>
- Then: <observable result>
- Failure: <rejection, recovery, or None with reason>
- Evidence required: <what must be proven, without test mechanics>

## Permissions and policy

<Authorization, policy, privacy, and compliance constraints.>

## Data and lifecycle

<Owned data, invariants, state transitions, retention, and deletion behavior.>

## Interfaces and compatibility

<Inputs, outputs, contracts, compatibility, and deliberate implementation
freedom.>

## Failure and recovery

<Validation, error visibility, retry, idempotency, concurrency, and degraded
behavior.>

## Operations and rollout

<Signals, migration, rollout, rollback, and support constraints.>

## Assumptions and risks

<Assumptions with evidence, plus risks and their consequences.>

## Blocking decisions

<Decision, owner, consequence, and return path to decision work, or None.>

## Traceability

<Map each behavior ID to its source heading and affected contract or constraint.>
```

Use stable behavior IDs within the file. Preserve an existing ID when revising
its wording. Retire an invalidated behavior explicitly instead of silently
reusing its ID for another contract.

## Status rules

| Status    | Meaning                                                             |
| --------- | ------------------------------------------------------------------- |
| `draft`   | The feature contract is being synthesized and has not been checked. |
| `blocked` | An outcome-changing decision is missing or contradictory.           |
| `ready`   | Every readiness check passes and ticket planning may begin.         |

Move directly from `draft` to `blocked` or `ready` after verification. A
revision of a ready spec returns to `draft` until its affected sections pass
again.

## Readiness checks

| Check        | The specification must                                                         |
| ------------ | ------------------------------------------------------------------------------ |
| Source       | Name one confirmed scope source and cite a source heading for every behavior.  |
| Boundary     | Separate included behavior, exclusions, and deliberate implementation freedom. |
| Vocabulary   | Use glossary terms when available and contain no material term conflict.       |
| Behavior     | State observable success, validation, failure, and recovery behavior.          |
| Data         | Account for ownership, lifecycle, privacy, retention, and deletion.            |
| Contracts    | State interface and compatibility promises without accidental design choices.  |
| Operations   | Account for signals, migration, rollout, rollback, and support impact.         |
| Proof        | Name evidence required for each behavior without prescribing test mechanics.   |
| Decisions    | Carry no unresolved outcome-changing decision.                                 |
| Traceability | Map each behavior ID back to its source and affected contract.                 |

Finish with status `blocked` when any check fails because evidence or a decision
is missing. Finish with status `ready` only when all checks pass.
