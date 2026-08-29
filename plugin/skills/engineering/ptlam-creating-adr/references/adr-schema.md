# Architecture decision record schema

This file covers the ADR shape, its accepted status, where the visual goes, and
the completion checks. Read it before writing the record.

## File shape

Follow a verified repository template when one exists. Otherwise use every
heading below and write `None` with a reason where a section does not apply.

```markdown
# <NNNN>. <Decision title>

- Status: accepted
- Date: <YYYY-MM-DD>
- Decision owners: <people or role>
- Source decision: <architecture judgment, confirmed record, spec, or evidence>

## At a glance

<One literal paragraph stating the constraint, the choice, and the main
consequence.>

## Context

<Problem, current conditions, scope, and why a decision is needed now.>

## Decision drivers

| Driver | Evidence | Weight or consequence |
| ------ | -------- | --------------------- |

## Options considered

| Option | Advantages | Liabilities | Rejection or selection reason |
| ------ | ---------- | ----------- | ----------------------------- |

## Decision

<The accepted choice and the boundary it constrains.>

## Visual impact

<A Mermaid diagram for material relationships, or the options table as the
visual when no faithful diagram exists.>

## Consequences

### Benefits

<Expected positive effects.>

### Liabilities and risks

<Costs, limits, failure modes, and risk owners.>

## Reversal and supersession

<Reversal cost, migration path, deferred concerns with their signals, the
redesign trigger, and how a later ADR supersedes this one.>

## Traceability

<Map drivers, alternatives, and consequences to source evidence.>
```

An ADR records one accepted choice. Split independent choices whose drivers,
alternatives, or reversal paths differ.

## Completion checks

| Check         | The ADR must                                                                        |
| ------------- | ----------------------------------------------------------------------------------- |
| Qualification | Name the future constraint that earned a durable record                             |
| Source        | Trace the choice, drivers, and alternatives to confirmed evidence                   |
| Explanation   | Let a future reader rebuild why the chosen option won                               |
| Visual        | Include one earned visual that replaces equivalent prose                            |
| Decision      | State one accepted choice and its constrained boundary                              |
| Alternatives  | Keep each material option and its rejection reason                                  |
| Consequences  | Record benefits, liabilities, risks, owners, and reversal cost                      |
| History       | Name the redesign trigger and explain supersession without rewriting the old record |

Finish only when every check passes. When the decision fails qualification or
lacks confirmed reasons, return the verdict without creating an ADR.
