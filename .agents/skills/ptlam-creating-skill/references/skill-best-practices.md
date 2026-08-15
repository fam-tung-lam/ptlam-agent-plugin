# Skill Authoring Best Practices

Use this reference when designing or materially revising a skill package. It
adapts the durable, non-evaluation guidance from Anthropic's
[Agent Skills best practices](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices)
to a target-resolved workflow. The target repository and host contract remain
authoritative.

Each section owns one authoring decision, in the order the decisions arise. The
final checklist confirms all of them.

## Contents

| Section | Decides |
| --- | --- |
| [Core principles](#core-principles) | Who the package is written for, and how much of it to write |
| [Package anatomy](#package-anatomy) | Which files and directories exist |
| [Naming and discovery](#naming-and-discovery) | What everything is called |
| [Progressive disclosure](#progressive-disclosure) | Which file owns which content |
| [Human-first document craft](#human-first-document-craft) | How each file reads |
| [Workflow design](#workflow-design) | How the steps are arranged and verified |
| [Reusable resources](#reusable-resources) | What scripts, assets, and references contain |
| [Content maintenance](#content-maintenance) | What to remove |
| [Static quality checklist](#static-quality-checklist) | Whether the package is finished |

## Core principles

### Write for the maintainer first

A skill package has two readers. A human inspects, reviews, and changes it; an
agent executes it. Optimize for the reader's mental model rather than for a
record of how the package was produced, because instructions a maintainer cannot
follow on one pass cannot be corrected when the workflow drifts.

The two readers rarely conflict. When they do, keep the wording a maintainer can
verify and add the agent-facing precision next to it, rather than replacing plain
language with notation only the agent needs.

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

### Confirm host mechanics before using them

A command, frontmatter field, string substitution, dynamic context injection, or
dependency rule from one host does not carry over to another. Resolve the target
first. Keep anything the target does not confirm out of the package, or state the
condition under which it applies.

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

Name every internal file, directory, and heading after the one responsibility it
owns, using the shortest wording that separates it from its siblings. A
maintainer should predict which file answers a question before opening it. Avoid
generic containers such as `misc`, `common`, or `notes`.

## Progressive disclosure

Order each file with
[human-first document craft](#human-first-document-craft). This section decides
where content lives:

1. Keep the outcome, scope boundary, and whole normal workflow in `SKILL.md`.
2. Keep ordered actions and necessary progress gates in `SKILL.md`.
3. Keep a definition or rule inline when every branch needs it at that point.
4. Put branch-specific detail behind a direct context pointer.

The pointer wording controls whether the agent loads the material. Name both the
condition and the reference's ownership:

```markdown
When editing tracked changes, read [redlining](references/redlining.md). It owns
the OOXML mutation and verification rules for revisions.
```

Keep references one hop from `SKILL.md` by default. When a large, mutually
exclusive catalog would bury the normal workflow, use one explicit routing
reference. Let that file own the complete selection map and link directly to
the selected implementation references; do not create a deeper chain.

Co-locate a concept's definition, rules, examples, and caveats. Do not repeat the
same meaning in `SKILL.md` and a reference.

## Human-first document craft

The project's own agent instructions, such as `AGENTS.md`, own voice, evidence,
and handoff. This section owns the shape of `SKILL.md` and its prose references,
so a maintainer and an agent can both follow them on one pass.

### Reading order

Order every document, and every section inside it, the way a first-time reader
learns it:

1. State the outcome and the scope boundary.
2. Show the whole workflow, its parts, and their boundaries.
3. Define a term, artifact, or state before the step that relies on it.
4. Put actions in causal order, and say why each step follows the previous one.
5. Attribute each action to whoever performs it: the agent, the user, a script,
   or the host.
6. Put exceptions, risks, and rare branches after the normal path.

Do not alternate between package-level design and local wording detail. When a
step needs a rule that a later step owns, move the rule earlier or point to its
owner instead of restating it.

### Visuals

Open `SKILL.md` with an `At a glance` block when the workflow has four or more
ordered steps, a branch, or a loop. Use one Mermaid flowchart when the path
branches and one compact table when it does not. The block replaces a prose
walkthrough of the workflow; it never accompanies one.

Hold every visual to the substitution test: a diagram or table earns its place
only when it replaces prose. When a table and a paragraph carry the same content,
delete one. Choose the format from the relationship it must show:

| Relationship | Format |
| --- | --- |
| A branching path through the workflow | Mermaid flowchart |
| Ordering or handover between the agent, user, script, and host | Mermaid sequence diagram |
| Owners, boundaries, exact mappings, or a selection rule | Table |
| Nesting, such as the package tree | Compact tree or nested list |
| One fact or one linear step | Plain text |

### Sentences and steps

Give each step one idea per sentence and per bullet. Split a sentence that
carries two independent rules instead of compressing them. Replace prose with
labeled bullets or a decision table when it holds several independent actions,
conditions, owners, or failure cases.

End every ordered step with a checkable completion criterion that names the
observable result. Close the workflow with one final acceptance gate, and do not
restate a step's criterion inside it.

### Reference files

Open a reference with the condition that sends a reader to it and the scope it
owns, so a maintainer who lands on it directly knows whether to keep reading.

Add a contents map when the file runs longer than roughly 100 lines. Name each
entry after the decision that section settles, not after its topic, so the reader
can jump straight to the one they need.

### Read-back gate

Before static validation, read back only the title, headings, table and diagram
labels, and bold labels. When they do not reveal the outcome, the normal path,
the authority boundary, and the finish condition, restructure before editing
sentences.

Then confirm three things about the full text: no step relies on a term the
package defines later, each rule has exactly one owner, and the amount of
structure matches the size of the skill.

## Workflow design

Arrange steps by dependency and cause, and shape them with
[human-first document craft](#human-first-document-craft).

Use conditional branches when creation, revision, review, or target hosts need
different actions. Do not present equivalent tools as a menu; give a selection
rule.

For critical transformations, use a static feedback loop:

```text
edit -> validate structure -> correct reported violations -> validate again
```

Keep verification proportional to risk and within the user's authorized scope.

## Reusable resources

### Scripts and executable code

Bundle a script when future agents would otherwise rewrite the same operation or
when deterministic execution materially reduces risk. Say whether to run the
script or read it as an algorithm.

Let the script settle the repeated operation instead of handing the decision back
to the agent. Then make it safe to run unattended:

- document its inputs, outputs, dependencies, exit behavior, and recovery;
- report boundary errors with useful messages instead of opaque failures;
- justify each configuration constant;
- declare required packages and runtime assumptions, and never assume a package
  or tool is already installed;
- use forward-slash paths and the exact tool identifier the target recognizes;
  and
- write verifiable intermediate output for destructive, batch, or high-impact
  operations.

### Templates and assets

Use a template when the output shape is strict and repeated. Document its
variables and which branch consumes it. Store fonts, images, boilerplate, and
other output inputs in `assets/`; do not place explanatory documentation there.

### Reference content

Store domain rules, schemas, API contracts, platform details, and substantial
examples in `references/`. Keep time-sensitive material labeled with its source,
version, and freshness rule.

How a reference opens and reads is owned by
[reference files](#reference-files).

## Content maintenance

Use one stable term per concept. This list owns removal for both prose and
prompt content. Remove:

- duplicated meaning, including one meaning repeated with synonyms;
- stale instructions, outdated snapshots, and old model behavior preserved as if
  current;
- explanations a capable agent already knows, and restatements of default model
  behavior that do not strengthen it;
- mechanics the resolved target already guarantees;
- examples that do not clarify a branch or output;
- tools or variants introduced without a decision rule;
- scripts that merely move reasoning into another file; and
- defensive flexibility, extra files, or abstractions for hypothetical
  requirements.

Replace a weak phrase such as "be thorough" with a checkable completion
criterion that names what must be accounted for.

## Static quality checklist

Apply [human-first document craft](#human-first-document-craft) to `SKILL.md` and
every changed prose reference. Restructure every violation before static
validation.

| Area | Passes when |
| --- | --- |
| Human readability | The [read-back gate](#read-back-gate) passes. Names reveal which file owns which rule. Every term is defined before the step that uses it. Structure is proportional to the skill. |
| Discovery and package | Name, directory, metadata, and invocation match the target. The description has one trigger per branch. Every script and asset has a consumer. |
| Workflow and disclosure | Steps, necessary progress gates, and final acceptance are visible. Outcome, normal path, ownership, and authority precede branch detail. Each reference has a precise one-hop context pointer; a router owns its complete selection map. |
| Ownership and validation | Each meaning has one owner. Terms and freshness rules are consistent. No placeholders, no-op instructions, sediment, or unused resources remain. Links, validators, and generated-output checks pass. |
