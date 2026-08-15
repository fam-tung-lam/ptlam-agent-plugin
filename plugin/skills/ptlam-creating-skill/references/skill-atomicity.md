# Skill Atomicity and Composition

Read this reference when defining or challenging a skill boundary. It owns the
capability tests, keep-or-split decisions, self-contained contract, and
foundation-specialization composition rules required by Rule 1.

This model translates the processing direction in Sascha's
[Complete Guide to Atomic Note-Taking](https://zettelkasten.de/atomicity/guide/),
retrieved on 2026-08-15, from knowledge building blocks to agent capabilities.
The translation is specific to skill design: a skill must pass the contract
before publication, even though its package may mature through rough drafts.

## Contents

| Section | Decides |
| --- | --- |
| [Define the capability atom](#define-the-capability-atom) | What counts as one skill capability |
| [Apply the six tests](#apply-the-six-tests) | Whether the proposed boundary is atomic |
| [Choose whether to keep, split, or route](#choose-whether-to-keep-split-or-route) | Where independently useful behavior belongs |
| [Make the skill self-contained](#make-the-skill-self-contained) | Which contract makes the normal path complete |
| [Compose without duplicating ownership](#compose-without-duplicating-ownership) | How foundations and specializations divide responsibility |

## Define the capability atom

A capability atom is the smallest independently useful behavior contract. It
contains:

- one responsibility and outcome family;
- the primary artifact or decision that responsibility acts on;
- lifecycle branches that share one acceptance standard;
- declared inputs, outputs, dependencies, authority, and side effects; and
- a boundary that excludes adjacent responsibilities.

Judge atomicity by capability, not by word count, file count, tool count, or the
number of workflow steps. References, scripts, assets, host adapters, and
validation steps may stay inside one package when they only support its focal
capability.

## Apply the six tests

1. **Naming:** Can one action-oriented name identify the capability without a
   list of unrelated responsibilities?
2. **Outcome:** Do all branches belong to one independently useful outcome
   family?
3. **Acceptance:** Do all branches create, change, or evaluate the same primary
   artifact under one acceptance standard?
4. **Completeness:** Can a future agent reach that acceptance state from the
   declared inputs and dependencies without hidden instructions?
5. **Independent reuse:** Would another consumer invoke one branch for a
   different responsibility or acceptance standard? If so, split it.
6. **Composition:** Can another skill reuse this capability through a stable
   contract without copying its rules?

A name containing `and` or several verbs is a warning, not proof of mixed
capabilities. Keep lifecycle operations together when they serve the same
artifact, responsibility, and acceptance standard. Split them when their reuse,
authority, or completion can vary independently.

## Choose whether to keep, split, or route

| Evidence | Decision |
| --- | --- |
| Create, review, and repair branches apply one acceptance contract to the same artifact | Keep them as lifecycle branches. |
| A branch has its own trigger, consumers, outcome family, or acceptance standard | Split it into another atomic skill. |
| A domain or host adds specialized mechanics to a complete universal capability | Create a specialization that composes the foundation. |
| Several skills are hard for a human to remember, but routing itself has one stable outcome | Create a router that delegates and owns no domain workflow. |
| A script or reference is useful only inside the focal capability | Keep it as an internal resource. |
| A resource contains a workflow another consumer would invoke independently | Promote it to a composed skill. |

When splitting, name the capability, trigger, output, acceptance standard, and
boundary of every result. Record which skill owns shared behavior before writing
packages. Shared topic, tool, input format, or implementation sequence is not
enough reason to merge capabilities.

## Make the skill self-contained

Self-contained means the capability's normal path is complete under explicit
prerequisites. The package must expose:

- the invocation condition and required inputs;
- the ordered actions and branch selection rules;
- the expected output and completion criteria;
- the authority and side-effect boundary;
- the failure or stop conditions a consumer must handle; and
- every external capability supplied by a declared dependency.

Self-contained does not mean dependency-free. A specialization is
self-contained when the host loads its declared foundation, the specialization
states what the foundation owns, and its own instructions supply the complete
delta. An undeclared prerequisite is a hidden gap, not composition.

## Compose without duplicating ownership

For every foundation-specialization edge:

1. Keep the foundation complete and independently useful for its universal
   responsibility.
2. Give the specialization one independently useful domain or host capability.
3. Let the foundation own shared scope, behavior, vocabulary, and acceptance.
4. Let the specialization own only stricter or additional mechanics for its
   domain.
5. Declare load order, inputs, outputs, authority, and conflict precedence in
   the host's verified dependency surface.
6. Reference the owner instead of paraphrasing its rules in the consumer.

Composition fails when the consumer silently weakens the foundation, requires
an output the foundation does not promise, or copies enough of the foundation
that the two versions can drift independently.

Complete Rule 1 when all six tests pass, every retained branch serves the focal
capability, every prerequisite is declared, and each composition edge has one
owner per rule.
