# Writing for Maintainers

This file covers the file template, reading order, sentence shape, visuals, and
what to cut. The target repository's own writing rules outrank it.

Write for the person who will change this skill in six months. They read it
once, fast, then act. An agent reading the same text is the easier reader.

## Use the catalog template

Every `SKILL.md` in this catalog has the same shape, so a reader can predict it:

1. `# PTLam <Name>`.
2. Two to four sentences: what it produces, for whom, and what it does not do.
3. The compiler marker `<!-- PLUGIN-COMPILER:REQUIRED-SKILLS -->` on its own
   line. The compiler replaces it with the dependency block from
   `plugin/plugin.yml`.
4. A heading phrased as the question the workflow answers, followed by one
   Mermaid flowchart of the whole path.
5. Numbered steps, `## 1. <Verb phrase>`, each ending with `Done when …`.
6. A closing `Finish when …` sentence, in the last step or under `## Finish`.

A rule catalog (a skill that routes to references by concern instead of running
steps) uses `## Before the first edit`, `## Pick a reference`, `## Do the work`,
and `## Finish` instead of numbered steps.

## Order each file the way someone learns it

1. What this produces, and for whom.
2. What it does not cover.
3. The whole path, start to finish.
4. The terms and rules those steps depend on.
5. Exceptions and failure cases.

Never use a term before you define it. Never mention a result before you
introduce it.

## Use plain words

Write short sentences with everyday words. Prefer "use" to "utilize", "start" to
"initiate", "permission" to "authority", "file" to "artifact" when it is a file.
Keep a technical term when it is the exact name of a thing, and explain it the
first time it appears.

Match detail to the cost of being wrong:

| Situation                                     | Write                         |
| --------------------------------------------- | ----------------------------- |
| Context picks among safe options              | A principle                   |
| Order prevents an omission                    | Numbered steps                |
| The operation is fragile, exact, and repeated | The exact command or template |

Verify a host mechanic before you name it. A confidently wrong command costs
more than a principle that made the reader think.

## Give every sentence one job

- One idea per sentence and per bullet. Split a sentence carrying two rules.
- Name who acts. "The build fails" hides whether that is the agent, the user, or
  CI.
- End every numbered step with a result someone can observe.
- Use one word per concept across the whole package.

## Prefer a diagram, then a table, then prose

| Form            | Fits when                                                     |
| --------------- | ------------------------------------------------------------- |
| Mermaid diagram | The point is a path, branch, hierarchy, lifecycle, or handoff |
| Table           | The point maps one key to one value                           |
| Prose           | The point is a single rule, definition, or caveat             |

A visual replaces the prose it stands in for; it never sits beside it. When a
nearby paragraph says what the visual says, delete one. Never force a diagram
onto content with no shape.

## Cut instead of compressing

Split a long file, or delete from it. Never fold separate points into one denser
sentence: the file shrinks and the reader's job grows.

Compressed, and unusable:

> Define the responsibility, artifact, branches, inputs, outputs, side effects,
> acceptance, boundaries, and dependencies, then apply Rule 1.

The same content, split, and usable:

> Write one line for each: the responsibility, the result it produces, its
> branches, its inputs, and its standard for being done.
>
> Then apply Rule 1 to what you wrote.

## Delete these on sight

Repeated meaning. Stale instructions. Host behavior that is already the default.
Examples nothing refers to. Tool variants the skill did not choose. Capabilities
that belong to a neighboring skill. Prerequisites copied from a dependency.
Abstractions with no concrete case behind them. Any explanation that changes no
decision and no finish condition.

Keep the sentence that warns someone honestly about cost, difficulty, or risk.

## Read back before you call it done

Read only the title, the headings, and the visual labels. If that alone does not
reveal the path and how it ends, restructure the file. Do not fix it by
polishing sentences.
