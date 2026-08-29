# Product requirements schema

This file covers the PRD shape, stable IDs, status rules, and readiness checks.
Read it before writing or revising a PRD.

## File shape

Use every heading. Write `None` with a reason when a section does not apply.

```markdown
# Product requirements: <product or epic>

- Status: <draft | blocked | ready>
- Updated: <timestamp>
- Source artifact: <confirmed grilling-record or product-brief path>
- Source basis: <grilling record, or why no grilling record applies>

## At a glance

<One literal paragraph stating who has which problem and the intended outcome.>

## Visual overview

<At least one earned Mermaid diagram or scan-friendly table that replaces the
equivalent prose.>

## Audience and problem

<Affected people, their context, evidence, and the problem worth solving.>

## Product framing

<Value proposition, current alternative, positioning, and why this scope is the
right product response.>

## Outcomes and success measures

### <O-01: outcome>

- Evidence: <confirmed source>
- Measure: <observable product result>
- Guardrail: <result that must not get worse, or None with reason>

## Scope

### <S-01: scope item>

<Product behavior or capability, without solution mechanics.>

## Non-goals

<Excluded product outcomes and neighboring scope.>

## Constraints

<Confirmed policy, time, cost, compatibility, or operational constraints.>

| Constraint                        | Value                                                | Source     |
| --------------------------------- | ---------------------------------------------------- | ---------- |
| Demand: <unit the product counts> | <current value, or unknown>                          | <evidence> |
| Growth curve                      | <measured or projected curve, or unknown>            | <evidence> |
| Platform and compliance limits    | <OS, store, device, or regulatory limits, or None>   | <evidence> |
| Expected lifespan                 | <years, or unknown>                                  | <evidence> |
| Cost of failure                   | <cost of an outage, breaking release, or lost batch> | <evidence> |

## Assumptions and risks

<Assumptions with evidence, plus risks and consequences.>

## Blocking decisions

<Decision, owner, consequence, and return path to decision work, or None.>

## Traceability

<Map each outcome and scope ID to the source decision or evidence.>
```

Keep an existing outcome or scope ID when revising its wording. Retire an
invalid ID explicitly instead of reusing it for another requirement.

## Status rules

| Status    | Meaning                                                          |
| --------- | ---------------------------------------------------------------- |
| `draft`   | Requirements are being written and are not yet checked           |
| `blocked` | An outcome-changing product decision is missing or contradictory |
| `ready`   | Every readiness check passes and feature specification may begin |

A revision of a ready PRD returns to `draft` until the affected sections pass
again.

## Readiness checks

| Check       | The PRD must                                                                               |
| ----------- | ------------------------------------------------------------------------------------------ |
| Source      | Name one confirmed source, trace every requirement, and say why no grilling record applies |
| Explanation | Make unfamiliar framing understandable without changing confirmed meaning                  |
| Visual      | Include one earned visual that replaces equivalent prose                                   |
| Audience    | Identify affected people, context, evidence, and problem                                   |
| Framing     | State the value, current alternative, and positioning without mechanics                    |
| Outcomes    | Give each outcome an observable measure and a guardrail disposition                        |
| Scope       | Separate stable scope IDs from explicit non-goals                                          |
| Boundary    | Carry no modules, schemas, API shapes, or other solution mechanics                         |
| Numbers     | Give each constraint a number with its source, or mark it unknown, without estimating      |
| Decisions   | Carry no unresolved outcome-changing product decision                                      |

Finish with status `blocked` when evidence or a decision stops a check from
passing. Finish with status `ready` only when all checks pass.
