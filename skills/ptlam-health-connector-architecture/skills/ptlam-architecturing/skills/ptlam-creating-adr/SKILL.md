---
name: ptlam-creating-adr
description:
  Decide whether one confirmed architecture choice deserves a durable
  architecture decision record, and write the record when it does. Use when a
  confirmed decision splits a component, runtime, or data store, publishes a
  surface such as an API, SDK, CLI, schema, or file format, moves where the true
  copy of state lives, commits to a platform, or rejects a plausible alternative
  for a non-obvious reason. Compose this skill from any workflow that needs the
  record-or-not verdict. Do not use for a local implementation choice that is
  cheap to reverse.
---

# PTLam Creating Architecture Decision Records

Decide whether one confirmed architecture choice deserves a durable record, and
write that record (an ADR) when it does. This skill owns the yes-or-no verdict
and the ADR. It does not interview, implement, or touch Git history; send an
open decision back to the caller.

## Required skills

### `ptlam-explaining`

**Reason:** Makes the decision forces and consequences understandable to a future reader without changing the accepted choice.

**Instructions:** Read and apply ptlam-explaining before drafting a qualifying record.
Infer the reader's difficulty from the confirmed decision and project
evidence; do not start an interview.
Let it own the literal model, explanatory structure, teaching order,
and reconstruction check.
Use its explanation package inside the record without changing facts,
status, schema, destination, or qualification owned by this skill.
Enter the analogy branch only when the user explicitly asked for one.

Read [ptlam-explaining](skills/ptlam-explaining/SKILL.md).

### `ptlam-mermaiding`

**Reason:** Turns material decision forces or architectural effects into verified visuals that make the record faster to scan.

**Instructions:** Read ptlam-mermaiding before choosing the record's visual form.
Apply it to material sequences, hierarchies, states, dependencies,
interactions, or topology; use a table for exact mappings.
Let it own the visual question, diagram type, Mermaid source, and the
strongest available syntax and rendering check.
Keep this skill's ownership of decision facts, qualification,
document structure, visual placement, and readiness.
Make each visual replace equivalent prose rather than repeat it.

Read [ptlam-mermaiding](skills/ptlam-mermaiding/SKILL.md).

## When does a choice become an ADR?

```mermaid
flowchart LR
    ResolveDecision["Resolve the confirmed decision"] --> QualifyDecision{"Deserves an ADR?"}
    QualifyDecision -->|"No"| ReportVerdict["Report why not"]
    QualifyDecision -->|"Yes"| GatherEvidence["Gather forces and alternatives"]
    GatherEvidence --> WriteAdr["Write the ADR"]
    WriteAdr --> VerifyRecord{"A future reader can rebuild the reasoning?"}
    VerifyRecord -->|"No"| GatherEvidence
    VerifyRecord -->|"Yes"| DeliverAdr["Deliver the ADR"]
```

Apply this skill after a choice is confirmed. It records the decision; it does
not reopen it. When an architecture judgment exists, use it as the source.

## 1. Resolve the decision and destination

Name the accepted choice, its owner, its evidence, and the future constraint it
creates. Stop when the choice is still open, contradicts itself, or is missing a
real alternative.

Read the applicable `AGENTS.md` files and any existing ADR convention. Use their
location and numbering; otherwise use the next free four-digit number at
`<project-root>/docs/adr/<NNNN>-<slug>.md`.

A direct request or a parent skill allows creating one new ADR and its missing
parent folders. Never overwrite an ADR. Changing code, superseding another
record, staging, committing, or publishing needs separate permission.

Done when the decision, evidence, convention, unique destination, and write
permission are explicit.

## 2. Apply the qualification gate

Write an ADR when the choice does at least one of these:

- splits or merges a component, runtime, or data store;
- publishes or changes a surface such as an API, SDK, CLI, schema, file format,
  or plugin interface;
- moves where the true copy of state lives;
- commits to a platform such as an OS, store, device, or offline use;
- binds other teams, releases, or a shared dependency beyond this task; or
- rejects a plausible alternative for a reason that is not obvious.

The first four bullets repeat the architecture skill's trigger on purpose, so
this gate works when that skill is not loaded.

A local name, a private helper, routine library use, or a cheaply reversible
choice earns no ADR. When the gate fails, return the verdict and the reason
without creating a file. The parent workflow keeps that disposition in its own
record.

Done when the qualifying consequence, or the reason for no ADR, is explicit and
backed by evidence.

## 3. Gather the decision evidence

Read the confirmed record, the relevant product or feature specification,
existing ADRs, repository constraints, and the evidence for each alternative.
When an architecture judgment exists, map its fields:

| Judgment field                | ADR section               |
| ----------------------------- | ------------------------- |
| Question                      | Context                   |
| Constraints                   | Decision drivers          |
| Frame                         | Options considered        |
| Recommendation                | Decision                  |
| Assumptions                   | Context                   |
| Trade-offs                    | Consequences              |
| Deferred and redesign trigger | Reversal and supersession |

Keep decision drivers, assumptions, rejected alternatives, consequences, and
unknowns apart. Do not invent a tidy reason after the fact. When the evidence
cannot explain why the choice won, stop and name the missing input.

Done when a future reader can compare the accepted choice with each real
alternative using the evidence available at decision time.

## 4. Write the ADR

Read [the ADR schema](references/adr-schema.md). It owns the file shape, status,
where the visual goes, and the completion checks. Keep the decision statement
short; put the explanation around the forces, alternatives, and consequences.

Done when the destination holds one accepted ADR and every schema section has an
explicit disposition.

## 5. Verify and deliver

Check the record against its sources and the existing ADR convention. Confirm
the explanation predicts the consequences and each visual keeps the real
relationships.

Report the verdict, the file when created, its status, sources, checks, and any
open risk.

Finish when the no-ADR verdict is supported, or the ADR lets a future reader
rebuild what was chosen, why, and what it costs.
