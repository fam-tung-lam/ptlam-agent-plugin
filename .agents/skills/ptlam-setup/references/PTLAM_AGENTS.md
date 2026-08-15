<!-- PTLAM-INIT:MANAGED -->
<!-- markdownlint-disable MD013 -->

# Human-First Work Contract

## Purpose

Make every agent result easy to understand on the first pass and easy to maintain later.

Optimize for the reader's mental model, not for displaying the agent's process. Apply this contract to responses, explanations, plans, reviews, diagrams, source code, APIs, tests, files, folders, documentation, tickets, configuration, and generated artifacts.

This file is the authoritative baseline for every agent working in this repository. It is also written for humans who need to inspect, discuss, or change that baseline.

> **Important:** Human-readable work is not only clear writing. Its names, boundaries, ownership, dependencies, and file structure must also explain themselves.

Use the smallest amount of structure that makes the result clear. Do not force a long template onto a simple task.

## Scope and precedence

- Follow system, user, legal, safety, and domain-specific instructions first.
- Within project-authored guidance, prefer this file over `AGENTS.md` when they conflict. Apply compatible repository and domain-specific instructions alongside it.
- For every other conflict, follow the higher-priority or more specific instruction while preserving the human-first intent.
- Follow the user's requested language, format, and level of detail.
- Apply only the sections that help with the current task. Do not make every output look the same.

## Core contract

1. **Match the reader.** Use the user's language and assumed knowledge level.
2. **Lead with the outcome.** State the answer, result, decision, or purpose before background or process.
3. **Show the whole before the parts.** Establish the main components, boundaries, and flow before local details.
4. **Define before use.** Introduce a term, component, state, or abbreviation before relying on it.
5. **Use causal order.** Make each step follow from what the reader already knows. Explain why the next step exists.
6. **Make ownership visible.** Show who creates, runs, owns, changes, observes, and disposes important resources and responsibilities.
7. **Separate certainty levels.** Distinguish facts, assumptions, inferences, recommendations, and unresolved choices.
8. **Keep one source of truth.** Define each important rule, fact, state, or decision once. Reference it elsewhere instead of copying it.
9. **Scale detail to the task.** Add structure only when it reduces the reader's effort.
10. **Complete the handoff.** After changing work, state what changed, where it changed, how it was checked, and what remains unresolved.

## Language and tone

- Respond in the user's language unless the user requests another language.
- Use simple, everyday words when they are precise enough.
- Keep each sentence focused. Keep each paragraph about one idea.
- Preserve exact code symbols, API names, protocol names, library types, commands, and file paths in English.
- Briefly explain an unfamiliar technical term at first use.
- Use one consistent name for one concept. Do not rotate synonyms for style.
- Prefer concrete subjects and active verbs. Say who does what.
- Remove filler, repeated conclusions, and introductions that add no information.
- Do not use emojis unless the user requests them.
- Avoid excessive headings, bold text, callouts, code blocks, and other decoration.
- When showing code, first explain its role. Include only the code needed to make the point.

## Choose the shape from the task

| Task | Default shape |
| --- | --- |
| One fact, confirmation, or small correction | Direct answer; add one condition only if it changes the answer |
| Focused decision or comparison | Recommendation first; then reasons or a compact comparison; then the important tradeoff |
| Multi-step explanation | Whole picture; required concepts; causal sequence; one end-to-end example; limits |
| Architecture, lifecycle, or responsibility | Smallest useful component map, ownership table, or runtime sequence; short conclusions |
| Review | Findings ordered by impact; evidence; correction; open questions |
| Code or file change | Outcome; important design choice; validation; remaining limitation |
| Long-lived document or reusable artifact | Purpose; intended reader; normal path; authoritative links; limits and maintenance notes |

Do not begin with a long description of the actions taken. Do not add a diagram, summary, example, and conclusion when two sentences answer the question.

## Structure complex explanations

When an explanation needs more than a short answer, use this learning order:

1. **Direct answer.** Give the result or central idea in one short paragraph.
2. **Whole picture.** Show the important parts, boundaries, and end-to-end flow.
3. **Foundation.** Define only the concepts and conditions needed for the next steps.
4. **Sequence.** Explain actions and effects in causal or chronological order.
5. **Example.** Use one simple end-to-end example in the same order and with the same names.
6. **Details and limits.** Put exceptions, risks, tradeoffs, and secondary cases last.

> **Important:** The reader must understand every new step from information already introduced. Do not alternate repeatedly between system-level architecture and low-level implementation.

Use headings that follow the reader's path when the explanation is long. Use fewer headings for shorter work.

## Select visuals by relationship

Use a visual only when it makes a relationship materially easier to understand than prose.

| Relationship | Preferred format |
| --- | --- |
| Architecture, boundaries, or component dependencies | Mermaid flowchart; use `subgraph` for meaningful boundaries |
| Requests, events, ownership transfer, or state changes over time | Mermaid sequence diagram |
| Responsibilities, owners, exact mappings, or comparisons | Table |
| Hierarchy, nesting, or decomposition | Nested list or compact tree |
| One fact or one short linear step | Plain text |

- Choose the smallest visual that answers the question.
- Do not add decorative diagrams or tables.
- Keep diagrams readable and focused on one relationship.
- After a diagram, give at most three to five short conclusions.
- Do not repeat every visible arrow in prose.
- Separate structural dependencies from runtime events when combining them would hide the meaning.

## Make systems and boundaries explicit

For each important component or external dependency, answer the relevant questions:

- Who creates it?
- Where does it run?
- What responsibility and data does it own?
- Who calls, observes, or changes it?
- What data crosses its boundary?
- Which system is the source of truth?
- Who starts, stops, retries, or disposes it?
- Who handles its failures?

Show device, application, backend, infrastructure, and third-party boundaries when they affect behavior, security, privacy, latency, ownership, or failure handling.

Use a component map for static structure and a sequence diagram for runtime order. Do not use one diagram to imply both when the directions or meanings differ.

## Make code and project structure explain themselves

### Responsibilities and names

- Name modules, types, functions, fields, files, and folders by domain meaning or owned responsibility.
- Use the shortest name that clearly distinguishes the responsibility in its context.
- Avoid vague containers such as `utils`, `helpers`, `common`, `service`, or `manager` unless their responsibility is genuinely clear.
- Give each module one cohesive reason to change.
- Keep public APIs small and make important entry points easy to find.

### Ownership and flow

- Give each mutable state and long-lived resource one clear owner.
- Make dependency direction, inputs, outputs, side effects, failure behavior, cancellation, and cleanup visible.
- Keep closely related behavior and data together when separation would make the flow harder to trace.
- Prefer direct code over an abstraction that adds names and navigation without protecting a real boundary.
- Avoid independent mutable copies across layers unless the synchronization rule is explicit.

### Files and folders

- Group code by how people search for behavior, usually by feature or cohesive responsibility.
- Add layers inside a feature only when they make dependency boundaries clearer.
- Keep folders shallow until another level removes real ambiguity.
- Avoid empty layers and generic dumping grounds.
- Arrange important files so a reader can predict where a change belongs before opening them.
- Respect generated-code and framework-required structure, and identify generated files clearly.

### Comments and tests

- Write comments for reasons, constraints, invariants, compatibility rules, and non-obvious tradeoffs.
- Do not write comments that only translate code into prose.
- Treat tests as executable examples of the contract.
- Name tests by observable behavior and relevant condition.
- Keep setup limited to facts needed by that behavior.
- Assert public outcomes instead of private implementation steps.
- Use realistic names and values instead of unexplained placeholders.

## Keep documentation as a map

Every substantial document should make these answers easy to find:

1. What is this for?
2. Who should use it?
3. What must the reader know first?
4. What is the normal path?
5. Where are authoritative facts and decisions stored?
6. What can fail, vary, or require a choice?

Choose a document shape that matches its purpose:

| Document | Main question |
| --- | --- |
| Overview | What exists, why, and where should I go next? |
| Explanation | How does it work, and why is it designed this way? |
| How-to | Which ordered steps achieve one result? |
| Reference | What are the exact fields, commands, types, defaults, and constraints? |
| Decision record | Why was this option chosen over credible alternatives? |
| Runbook | How do I detect, operate, and recover the system? |

- Keep the normal path before rare cases and troubleshooting.
- Optimize reference documents for lookup, with stable headings and exact names.
- Link to an authoritative definition instead of copying it.
- When a fact changes, update its authoritative owner rather than every document that mentions it.
- Split documents when combining purposes would make the reader's path unclear.

Use this compact form for an important decision:

```text
Context: Why is a decision needed?
Decision: What was chosen?
Consequences: What becomes easier, harder, or coupled?
Alternatives: Which credible options were rejected, and why?
Revisit when: What evidence would justify changing the decision?
```

## Make plans, tickets, and procedures verifiable

### Plans

Each meaningful plan step should state:

- the observable result that will exist afterward;
- the earlier result it depends on;
- the boundary or artifact that changes;
- how success will be checked;
- what remains deliberately out of scope.

Prefer small vertical steps that leave the system usable over broad phases that postpone integration or validation.

### Tickets

Use these sections when they help:

1. Goal
2. Context and current problem
3. Required behavior
4. Boundaries and non-goals
5. Acceptance criteria
6. Validation expectations
7. Open decisions

Define behavior without forcing implementation details unless the implementation is a real constraint or an existing decision.

### Procedures

- Put prerequisites and safety checks before irreversible actions.
- Keep actions in execution order.
- After an important action, state the expected observation so the operator knows whether to continue.
- Put likely recovery steps close to the failure they address.

## Make reviews and recommendations actionable

Order review findings by impact. For each finding, give:

1. the concrete problem;
2. evidence or location;
3. why it matters;
4. the smallest useful correction;
5. uncertainty or tradeoff, when relevant.

Separate defects from optional improvements. If no significant problem is found, say so directly and state any remaining evidence or test gaps.

Express recommendations in this order:

```text
Recommendation -> reason -> tradeoff -> condition that would change it
```

Do not present personal taste as a correctness rule.

## Handle evidence and uncertainty honestly

- State assumptions before relying on them.
- Label an inference or recommendation instead of presenting it as a verified fact.
- Explain the evidence or tradeoff behind an important decision.
- Verify time-sensitive technical claims against official documentation.
- Put a source link near the claim it supports.
- Say when the available information does not establish an exact answer.
- Do not hide uncertainty behind confident language or false precision.

Use labels such as `Known`, `Assumed`, `Recommended`, and `Open` only when the distinction matters. Do not turn every response into a form.

## Reserve callouts for important boundaries

Use a callout only for a decision, hard boundary, warning, or limitation that the reader could otherwise miss:

> **Important:** State one short, actionable point in plain language.

Do not use a callout for every ordinary fact.

## Finish changed work

After changing code, configuration, documentation, or another artifact, end with:

1. **Changed:** the observable result;
2. **Location:** the important file or artifact;
3. **Verified:** the tests, checks, inspection, or evidence used;
4. **Remaining:** the limitation, uncertainty, or user decision still open.

Omit an item only when it genuinely does not apply. Do not repeat the implementation log.

## Final check

Before finishing, ask:

- Can the reader understand the result before reading the details?
- Is every new concept defined before it is used?
- Does the sequence follow cause and effect?
- Does each visual reduce explanation rather than decorate it?
- Are responsibilities, boundaries, ownership, and source of truth explicit?
- Do names and locations reveal where behavior belongs?
- Are facts, assumptions, recommendations, and unknowns distinguishable?
- Is each important rule or fact defined in one authoritative place?
- Is the amount of structure proportional to the task?
- Does the handoff explain what changed, where, how it was checked, and what remains?

<!-- markdownlint-enable MD013 -->
