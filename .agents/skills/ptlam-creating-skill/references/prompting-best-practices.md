# Prompting Best Practices

Use this reference when a skill must steer non-trivial reasoning, tool use,
output shape, long context, or agentic behavior. It adapts the durable guidance
from Anthropic's
[Claude prompting best practices](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices).
Model-specific behavior can drift; verify the current target documentation
before depending on exact model names or runtime features.

Read only the sections that match what the skill must steer.

## Contents

| Section | Decides |
| --- | --- |
| [Clarity and context](#clarity-and-context) | What the agent must be told outright |
| [Prompt structure](#prompt-structure) | How instructions, inputs, and examples are separated |
| [Examples](#examples) | Whether an example is needed, and what it must show |
| [Output control](#output-control) | What the agent produces and in what shape |
| [Tool use and action authority](#tool-use-and-action-authority) | Which actions the agent may take, and how |
| [Reasoning calibration](#reasoning-calibration) | How much deliberation to ask for |
| [Long context and state](#long-context-and-state) | How work survives a long or resumed session |
| [Agentic work](#agentic-work) | How much autonomy the agent gets |
| [Prompt review](#prompt-review) | Whether the instructions are ready to use |

## Clarity and context

Write as if the agent is capable but new to the user's local norms. State
outright:

- the outcome it must reach;
- the context it cannot infer;
- the constraints it must respect;
- the authority it has to act; and
- the shape of the output.

Use ordered instructions when sequence or completeness matters.

Explain the reason behind a non-obvious rule. A reason lets the model apply the
rule to cases the skill never lists; an unexplained rule invites literal
compliance without judgment.

Prefer one strong instruction over several restatements. Give each concept one
name and use it consistently.

## Prompt structure

Use the smallest structure that removes ambiguity:

- prose for one principle;
- bullets for a peer set of rules;
- numbered steps for ordered work;
- explicit headings or tags when instructions, data, and examples could be
  confused; and
- templates when the output schema is strict.

For large inputs, put the source material in a clearly bounded section and the
task after it. Label each document when several must be told apart. Require the
agent to ground its conclusions in the supplied material when the reader must be
able to trace where a claim came from.

## Examples

Use examples when the desired format, tone, boundary, or transformation remains
ambiguous after direct instruction. Make them:

- relevant to the real branch;
- varied enough to reveal the rule rather than one surface pattern; and
- clearly separated from instructions and user data.

For Claude targets, descriptive XML tags such as `<example>`, `<context>`, and
`<input>` can separate roles in a complex prompt. Verify that the target host
preserves the tags before relying on them.

Examples are reference, not the workflow's completion criteria. Avoid examples
that teach accidental values, paths, or provider assumptions.

## Output control

Describe what to produce rather than centering the unwanted form:

```text
Write connected prose with short headings and use a list only for discrete
items.
```

State the fields, ordering, length limit, language, and destination file the
output must have. Use an exact template only when exactness is part of the
contract. Match the prompt's own organization to the requested output when
practical.

A formatting rule never outranks meaning. Do not let one hide required evidence
or produce an invalid artifact.

## Tool use and action authority

Match the verb to the authority the user granted: action verbs when
implementation is authorized, advisory verbs when the user wants analysis.
Resolve ambiguity from local evidence before asking. Do not infer authority for
destructive, externally visible, or materially broader actions.

Name a tool only when the target exposes it and the tool materially improves
reliability. Use fully qualified identifiers when the host requires them.

Request parallel operations only for independent work. Keep dependent actions
sequential, and resolve real parameters before calling a tool. Avoid a
speculative call whose side effects or cost exceed the task.

## Reasoning calibration

Choose the level of detail with
[match specificity to risk](skill-best-practices.md#match-specificity-to-risk).
Add step-by-step reasoning instructions only for fragile operations where
intermediate choices must be observable.

Stop endless exploration with a commitment rule:

```text
Choose the best-supported approach and continue until new evidence contradicts
it or the approach fails its completion criterion.
```

Ask for a final self-check against explicit acceptance criteria when omission is
the primary risk. Do not request hidden chain-of-thought or expose private
reasoning; request concise evidence, decisions, and verification instead.

## Long context and state

For long-running work:

- maintain a compact plan or progress record when the host supports it;
- store structured state in a structured format and narrative progress in prose;
- preserve exact file, ref, or artifact identities needed to resume safely;
- re-read controlling instructions after context restoration; and
- continue from verified state instead of reconstructing it from memory.

Keep that record in version control only within the user's Git authority. Do not
turn progress tracking into extra repository files unless the workflow needs
them.

## Agentic work

Grant autonomy in proportion to how reversible the action is. Let the agent act
on its own for reversible local work inside the authorized scope. Require
confirmation, or an instruction that was already explicit, for destructive,
hard-to-reverse, externally visible, or shared-system changes.

Use subagents only when the host and user authorize them and the workstreams are
independent or benefit from isolated context. Keep one owner for integrated
decisions and conflict-prone edits.

Use prompt chaining when a pipeline genuinely needs an inspected intermediate
artifact. Prefer one coherent workflow when separate calls add no control or
information boundary.

## Prompt review

Before using the instructions, confirm that:

- the outcome and authority are explicit;
- the structure separates instructions, inputs, examples, and output schema;
- every branch has the context it needs and no unrelated context;
- tool names and target-specific mechanics are verified;
- positive target behavior dominates over negation;
- the degree of freedom matches the operation's risk;
- examples reveal a general rule rather than one answer; and
- every sentence changes behavior or supplies necessary context.
