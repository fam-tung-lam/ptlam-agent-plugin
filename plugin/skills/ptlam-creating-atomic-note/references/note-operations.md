# Note Operations

This file covers the action and completion rule for create, mature, review,
split, and merge. Follow only the selected section.

## Create a note

Capture a new thought freely before imposing structure. Then apply the atomicity
model and produce one note per independently useful building block. Keep a
source summary apart from the user's own claim when merging them would change
the meaning.

When no verified local shape exists, use this fallback:

```markdown
# <Declarative claim or precise concept>

> <One-sentence statement, when it clarifies the focus.>

<Explanation, mechanism, evidence, or boundary needed to understand the focal
building block.>

## Suggested connections

- <Note title> — <why this relationship matters>.

## Source

- <Source or attribution, when one exists.>
```

Leave out empty sections. If the user asks to save the result, resolve the exact
path before writing.

Done when each allowed building block has one self-contained draft or saved note
and every requested file effect is reported.

## Mature a note

Decide whether the note is a thinking capture, a finished thought without a
clear building block, or an identifiable idea that needs development. Advance it
only as far as the user's goal and the idea's expected value justify.

Keep useful uncertainty and abandoned paths when they explain how to continue.
If the note stays unfinished, label its state in the local convention or plain
prose and record the next concrete question.

Done when the note reaches the intended stage and any remaining work is visible
to a future reader.

## Review a note

Judge the note against the checks in `SKILL.md` and the tests in the atomicity
model. Lead with one verdict:

- **Atomic:** one building block is complete and reusable on its own;
- **Usably focused:** one focus is clear, but context or the note's purpose
  justifies material that is not purely atomic;
- **Unfinished:** the idea is still forming and needs a named next step; or
- **Mixed:** independent building blocks need separating, or a clearer main
  purpose.

Give evidence for every failed check and propose the smallest useful fix.
Rewrite or change the note only when the user asks.

Done when the verdict, evidence, and fixes cover every check.

## Split notes

Name each resulting building block before moving content. Give each result
enough context to stand alone. Keep sources, distribute evidence by the claim it
supports, and assign existing links by their real relationship.

Update backlinks only when the user allowed file changes and the targets are
known. Propose plain-title connections for unknown targets.

Done when every claim, citation, connection, and requested file effect has one
explicit destination and each result is useful on its own.

## Merge notes

Merge only notes that develop the same building block or serve the same
navigational purpose. Keep the sharper title, unique evidence, source
attribution, and distinct link context. Keep notes apart when they merely share
a topic.

Return a merged draft unless the user asked for file changes. Keep every source
note by default. Delete, archive, redirect, or rewrite backlinks only with
separate permission and known targets.

Done when the result stands alone and every destination, source-note fate,
connection, and backlink effect is unambiguous and allowed.

## Name a file with no local convention

When the user asks for a file and the destination has no naming convention,
derive a short, lowercase, hyphenated slug from the focal idea and use `.md`. Do
not invent a folder scheme or a metadata schema on the user's behalf.
