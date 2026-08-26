# Ticket set schema

This reference owns the ticket-set overview, ticket-file shape, filename rule,
and readiness standard. Read it before writing any ticket file.

## Overview file

Write `<tickets-directory>/README.md` with:

```markdown
# Ticket plan: <feature>

- Status: <draft | blocked | ready>
- Updated: <timestamp>
- Source spec: <path and heading>

## At a glance

<One literal paragraph explaining the delivery path.>

## Dependency map

<One verified Mermaid diagram showing every blocking edge.>

## Ordered tickets

| Order | Ticket | Outcome | Blocked by | Spec trace |
| ----- | ------ | ------- | ---------- | ---------- |

## Shared constraints and risks

<Cross-ticket constraints, deferred concerns with their signals, the redesign
trigger, risks, and their owners.>

## Blocking decisions

<Decision, owner, consequence, or None.>
```

## Ticket files

Name each ticket `<NN>-<slug>.md`. Start at `01`; keep the filename order equal
to the dependency order. Use this shape:

```markdown
# <T-01: observable slice outcome>

- Status: planned
- Spec trace: <spec behavior and section IDs>
- Blocked by: <ticket IDs, or None>
- Blocks: <ticket IDs, or None>

## Outcome

<One user- or operator-visible result.>

## Context

<Only the source facts needed to implement this slice.>

## In scope

<Behavior, contracts, data, failures, and rollout work owned here.>

## Out of scope

<Adjacent work left to another ticket, deferred until its signal, or outside the
feature.>

## Acceptance

- <Observable condition with source spec ID.>

## Evidence required

<What must be proven, without selecting test levels, placement, or doubles.>

## Implementation freedom

<Choices the spec leaves to the implementer.>
```

## Readiness checks

| Check        | The ticket set must                                                                            |
| ------------ | ---------------------------------------------------------------------------------------------- |
| Source       | Trace every ticket and acceptance statement to the ready spec.                                 |
| Explanation  | Make unfamiliar intent reconstructable without changing spec facts.                            |
| Visual       | Show every blocking edge once in a verified dependency map.                                    |
| Verticality  | Give each ticket one observable path rather than one technical layer.                          |
| Coverage     | Account for every spec behavior, constraint, and failure path.                                 |
| Dependencies | Be acyclic, bidirectional at endpoints, and consistent with file order.                        |
| Deferral     | Implement no concern the spec defers; carry it, with its signal, in the overview.              |
| Migration    | Slice each migration as expand, migrate, then contract, with every stage shippable on its own. |
| Proof        | Record required evidence without prescribing testing mechanics.                                |
| Decisions    | Carry no unresolved outcome-changing decision.                                                 |

Set the overview status to `blocked` when a source defect or decision prevents a
check from passing. Use `ready` only when all ticket files pass together.
