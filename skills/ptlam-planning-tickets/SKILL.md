---
name: ptlam-planning-tickets
description:
  Turn one ready feature specification into an ordered set of vertically sliced
  ticket files with explicit blocking edges. Use after a feature spec is ready
  for implementation planning. A new product or large epic starts at
  ptlam-creating-prd, an existing-product feature starts at ptlam-creating-spec,
  and a small fix skips this pipeline.
disable-model-invocation: true
---

# PTLam Planning Tickets

Turn one ready feature specification into one ordered ticket set whose files are
vertical implementation slices. The ticket set owns work decomposition and
blocking edges; it does not change feature behavior, invent architecture, or
publish work to an external tracker.

## Required skills

### `ptlam-explaining`

**Reason:** Makes unfamiliar ticket intent and dependencies reconstructable for implementers without changing the source specification.

**Instructions:** Read and apply ptlam-explaining before drafting the ticket set.
Infer the implementer's likely difficulty from the ready spec and
project evidence; do not start another interview.
Let it own the literal model, explanatory structure, teaching order,
and reconstruction check for unfamiliar or complex content.
Use its explanation package inside the ticket set without changing
facts, slices, schema, destination, or readiness owned by this skill.
Enter the analogy branch only when the user explicitly requested it.

Read [ptlam-explaining](skills/ptlam-explaining/SKILL.md).

### `ptlam-mermaiding`

**Reason:** Makes ticket order and blocking relationships visible as a verified dependency map rather than burying them in prose.

**Instructions:** Read ptlam-mermaiding before choosing the ticket set's visual form.
Apply it to the dependency order and any other material relationship;
use a table for exact mappings or comparisons.
Let it own the visual question, diagram type, Mermaid source, and the
strongest available syntax and rendering verification.
Keep this skill's ownership of ticket facts, vertical slices, document
structure, visual placement, destination, and readiness.
Make each visual replace equivalent prose rather than repeat it.

Read [ptlam-mermaiding](skills/ptlam-mermaiding/SKILL.md).

## How does a ready feature spec become implementable tickets?

```mermaid
flowchart LR
    ResolveSpec["Resolve one ready feature spec"] --> MapBehavior["Map behavior and constraints"]
    MapBehavior --> SliceVertically["Cut vertical slices"]
    SliceVertically --> OrderDependencies["Order blocking dependencies"]
    OrderDependencies --> WriteTicketSet["Write the ticket set"]
    WriteTicketSet --> VerifyTickets{"Every ticket is implementable?"}
    VerifyTickets -->|"No"| ReviseSlices["Revise slices or expose blocker"]
    ReviseSlices --> SliceVertically
    VerifyTickets -->|"Yes"| DeliverTickets["Deliver the ticket set"]
```

Only `ptlam-grilling` interviews. This skill decomposes confirmed specification
content and never asks a second discovery sequence.

## 1. Resolve the spec and destination

Require one feature spec with status `ready`. Stop when it is draft, blocked,
missing traceability, or internally contradictory. A new product or large epic
must reach the PRD first; a feature inside an existing product starts at the
spec; a small fix skips this pipeline.

Read applicable `AGENTS.md` files before resolving paths. Use their ticket
location when defined; otherwise use
`<project-root>/docs/specs/<feature>/tickets/`.

Invocation authorizes creating that directory, its `README.md`, and numbered
ticket files. It does not authorize overwriting existing tickets, changing the
spec, changing code, publishing tracker items, or performing Git operations.

Complete this step when the source spec, project root, empty or authorized
destination, and file authority are explicit.

## 2. Map the implementation obligations

Read the complete spec and the repository evidence it cites. Build a map from
behavior IDs to contracts, data lifecycles, failure paths, rollout constraints,
and required evidence. Preserve deliberate implementation freedom.

Read the spec's architecture constraints. Map each deferred concern, with its
signal, and the redesign trigger as work no ticket owns.

Record missing outcome-changing detail as a spec blocker. Do not repair the spec
inside a ticket or convert an assumption into a requirement.

Complete this step when every spec behavior and constraint has one disposition
in the work map, every deferred concern is mapped as work no ticket owns, and no
ticket needs to invent product behavior.

## 3. Slice vertically

Make each ticket deliver one observable path through the relevant layers. A
slice should be independently reviewable and verifiable, even when another
ticket must land first.

Prefer the smallest end-to-end walking path, then extend behavior, failure
handling, data lifecycle, compatibility, and rollout in coherent increments.
Avoid separate database, API, UI, or test tickets that have no user- or
operator-visible outcome. When enabling work cannot be vertical, name its first
consumer and keep it smaller than that consumer.

Slice a migration as expand, then migrate, then contract, as the
`ptlam-code-style` evolution rules require. Each stage must ship on its own.

Complete this step when every ticket owns one outcome, every spec behavior is
covered once or deliberately shared, and no slice is merely a technical layer.

## 4. Order dependencies

Assign stable IDs in execution order. For each ticket, name `Blocked by` and
`Blocks` edges using those IDs. An earlier file may depend on no later file.
Split or reorder any cycle instead of hiding it in prose.

Complete this step when the dependency graph is acyclic, every edge is present
at both endpoints, and the numbered filenames form a valid implementation order.

## 5. Write and verify the ticket set

Read [the ticket set schema](references/ticket-set-schema.md). It owns the
overview file, ticket shape, filename rule, and readiness checks.

Verify that each acceptance statement is observable, each proof obligation comes
from the spec, and the dependency visual matches the ticket edges. Report the
directory, ticket count, ordered IDs, checks, and blockers.

Complete the task when every schema check passes and an implementer can take the
first unblocked ticket without recovering context from chat.
