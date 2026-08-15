# Skill Authoring Best Practices

Use this reference when designing or materially revising a skill package. It
adapts the durable, non-evaluation guidance from Anthropic's
[Agent Skills best practices](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices)
to a target-resolved workflow. The target repository and host contract remain
authoritative.

## Contents

- [Core principles](#core-principles)
- [Package anatomy](#package-anatomy)
- [Naming and discovery](#naming-and-discovery)
- [Progressive disclosure](#progressive-disclosure)
- [Reusable resources](#reusable-resources)
- [Workflow design](#workflow-design)
- [Content maintenance](#content-maintenance)
- [Executable resources](#executable-resources)
- [Static quality checklist](#static-quality-checklist)

## Core principles

### Spend context deliberately

Assume the agent already has broad general knowledge. Include only information
that changes its decisions, behavior, or completion bar. Metadata is paid on
every turn when the host exposes it for model invocation; `SKILL.md` is paid
when the skill loads; disclosed references are paid only when their context
pointer fires.

### Use imperative instructions

Write direct actions:

```markdown
Read the repository policy before choosing a destination.
Run the static validator after updating metadata.
```

Avoid advisory phrasing that obscures whether a step is required.

### Match specificity to risk

- Use principles when several approaches are safe and context decides.
- Use an algorithm when one sequence prevents omissions but local variation is
  valid.
- Use exact commands, templates, or scripts when the operation is fragile,
  deterministic, and repeated.

Explain why a constraint matters when that reason lets the agent generalize to
new cases.

## Package anatomy

Resolve the target's accepted structure first. A common package contains:

```text
skill-name/
├── SKILL.md
├── agents/
│   └── openai.yaml
├── references/
├── scripts/
└── assets/
```

| Surface | Owns | Include when |
| --- | --- | --- |
| `SKILL.md` | Ordered steps and context routing | Always |
| Host metadata | Discovery and user-interface fields | The target supports or requires it |
| `references/` | Conditional rules, schemas, and examples | A branch needs detail that would bury the main steps |
| `scripts/` | Deterministic repeated operations | Reimplementation is costly or fragile |
| `assets/` | Templates and files used in produced outputs | Future runs consume the artifact itself |

Create no directory without a concrete consumer. Omit skill-local READMEs,
installation guides, changelogs, quick references, process diaries, and other
files that do not help the agent perform the skill.

## Naming and discovery

Follow the target schema. When it does not define stricter rules:

- use lowercase letters, digits, and hyphens;
- keep the name below 64 characters;
- prefer a short action-oriented phrase;
- name the folder exactly after the skill; and
- avoid vague names such as `helper`, `utils`, `tools`, or `misc`.

Treat a model-facing description as a context pointer. State the capability and
one trigger per distinct branch. Collapse synonyms that repeat one branch.
Prefer a positive boundary that names the intended adjacent behavior; retain a
negative boundary only when it prevents a material false invocation and cannot
be expressed clearly as a positive target.

## Progressive disclosure

Protect the information hierarchy and the reader's path:

1. Open `SKILL.md` with the outcome and scope boundary.
2. Show the whole normal workflow before conditional detail when the workflow is
   complex.
3. Put ordered actions and necessary progress gates in `SKILL.md`, arranged by
   dependency and cause.
4. Keep definitions or rules inline when every branch needs them at that point.
5. Put branch-specific detail behind a direct context pointer.

The pointer wording controls whether the agent loads the material. Name both the
condition and the reference's ownership:

```markdown
When editing tracked changes, read [redlining](references/redlining.md). It owns
the OOXML mutation and verification rules for revisions.
```

Keep references one hop from `SKILL.md` by default. When a large, mutually
exclusive catalog would bury the normal workflow, use one explicit routing
reference. Let that file own the complete selection map and link directly to
the selected implementation references; do not create a deeper chain. Add a
compact contents list to reference files longer than roughly 100 lines.

Co-locate a concept's definition, rules, examples, and caveats. Do not repeat the
same meaning in `SKILL.md` and a reference.

## Reusable resources

### Scripts

Bundle a script when future agents would otherwise rewrite the same operation or
when deterministic execution materially reduces risk. Say whether to run the
script or read it as an algorithm.

Document inputs, outputs, dependencies, exit behavior, and recovery. Handle
boundary errors with useful messages instead of returning opaque failures.

### Templates and assets

Use a template when the output shape is strict and repeated. Document its
variables and which branch consumes it. Store fonts, images, boilerplate, and
other output inputs in `assets/`; do not place explanatory documentation there.

### References

Store domain rules, schemas, API contracts, platform details, and substantial
examples in `references/`. Keep time-sensitive material labeled with its source,
version, and freshness rule.

## Workflow design

Apply the loaded human-first contract to workflow order, progress gates,
visuals, density, ownership, and handoff.

Use conditional branches when creation, revision, review, or target hosts need
different actions. Do not present equivalent tools as a menu; give a selection
rule.

For critical transformations, use a static feedback loop:

```text
edit -> validate structure -> correct reported violations -> validate again
```

Keep verification proportional to risk and within the user's authorized scope.

## Content maintenance

Use one stable term per concept. Remove:

- duplicated meaning;
- stale instructions and outdated snapshots;
- explanations a capable agent already knows;
- examples that do not clarify a branch or output;
- scripts that merely move reasoning into another file; and
- defensive flexibility for hypothetical requirements.

Prefer positive target behavior over prohibitions. Use a hard prohibition only
when safety or authority requires it, then immediately state the permitted
alternative.

## Executable resources

When a skill contains executable code:

- solve the repeated operation rather than punting decisions back to the agent;
- justify configuration constants;
- declare required packages and runtime assumptions;
- use forward-slash paths in portable instructions;
- name external tools with the exact target-recognized identifier;
- avoid assuming a package or tool is installed; and
- create verifiable intermediate outputs for destructive, batch, or high-impact
  operations.

Keep provider-specific capabilities conditional. A command, substitution,
dynamic context injection, or dependency rule from one host is not portable
until the resolved target confirms it.

## Static quality checklist

Apply the loaded human-first contract's outline-only scan, visual triggers, and
density limits to `SKILL.md` and every changed prose reference. Restructure
every violation before static validation.

| Area | Passes when |
| --- | --- |
| Discovery and package | Name, directory, metadata, and invocation match the target. The description has one trigger per branch. Every script and asset has a consumer. |
| Workflow and disclosure | Steps, necessary progress gates, and final acceptance are visible. Outcome, normal path, ownership, and authority precede branch detail. Each reference has a precise one-hop context pointer; a router owns its complete selection map. |
| Ownership and validation | Each meaning has one owner. Terms and freshness rules are consistent. No placeholders, no-op instructions, sediment, or unused resources remain. Links, validators, and generated-output checks pass. |
