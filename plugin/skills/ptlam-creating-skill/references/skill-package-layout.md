# Skill Package Layout

This file covers what each folder holds, how long a file may be, and when detail
leaves `SKILL.md`. The host's own layout rules outrank it.

## What each surface owns

| Surface       | Owns                                                                |
| ------------- | ------------------------------------------------------------------- |
| `SKILL.md`    | The outcome, the scope, the whole normal path, and the pointers out |
| Host metadata | Discovery and interface fields                                      |
| `references/` | Conditional rules, schemas, and long examples                       |
| `scripts/`    | Deterministic operations that repeat                                |
| `assets/`     | Templates and files the produced output consumes                    |

Create a folder only when something concrete will live in it. Changelogs and
maintainer notes belong outside the package. Behavior another skill would ask
for on its own belongs in its own skill.

## Keep related guidance together until splitting pays off

Related rules that serve one workflow stay together while the file stays
readable. An `and` title or a paragraph that could stand alone is a warning, not
an order to split.

| Evidence                                                               | Decision                                    |
| ---------------------------------------------------------------------- | ------------------------------------------- |
| Same workflow owner, related rules, comfortable length                 | Keep together                               |
| Same owner and fragments too small to justify their own file           | Merge                                       |
| A subsection has its own conditional consumer or owner                 | Split                                       |
| Another workflow reuses a subsection without the surrounding rules     | Split, or promote one owner                 |
| Separation prevents irrelevant loading or duplicated maintenance       | Split                                       |
| Headings no longer show a readable path, or the file exceeds its limit | Split by workflow responsibility, or delete |
| The only benefit is conceptual purity while navigation grows           | Keep together                               |

Keep `SKILL.md` and every file in `references/` at or under 100 lines, not
counting table rows and fenced blocks. The limit is a ceiling and a review
signal, not a target. It does not apply to an asset, whose length is whatever
the produced output needs. Never compress prose to fit; see
[cut instead of compressing](writing-for-maintainers.md#cut-instead-of-compressing).

`SKILL.md` keeps the outcome, boundary, whole normal path, shared rules, and
each step's finish condition. Move a conditional workflow behind one pointer to
the reference that owns it. Use a routing reference only for a large catalog of
mutually exclusive options.

Keep a concept's definition, rules, examples, and caveats together. Open a
reference with what it covers; keep its read condition at the `SKILL.md`
pointer. Every rule stays one hop from `SKILL.md`, and every condition is
written once.

## Place resource guidance with its workflow

A resource list is not a responsibility. Give setup, use, commands, links, and
caveats to the surface that owns the related workflow.

| Resource's reach                                          | Owner                     |
| --------------------------------------------------------- | ------------------------- |
| Every branch uses it, or no conditional reference owns it | `SKILL.md`                |
| One conditional workflow uses it                          | That workflow's reference |

Do not create a generic `tools.md`, `toolchain.md`, `dependencies.md`, or
`sources.md` only to list resources. Give each rule one owner and link to it
anywhere else the resource appears.

For time-sensitive guidance, keep the required procedure local. An external link
may identify the current source, but the workflow must run without opening it.
Name a concrete staleness signal, such as a changed access rule, a new version,
or a procedure that stops working. Apply
[self-contained documentation](self-contained-documentation.md) to every
external link.

## Name it after what it does

Follow the target schema first. Otherwise use a short action-oriented name in
lowercase letters, digits, and hyphens, under 64 characters, matching the folder
name. Avoid `helper`, `misc`, `utils`, and `notes`.

A model-facing description is a pointer, not a summary. State the capability,
then one trigger per branch, then a reach clause when another skill composes
this one. Drop a trigger that only renames a branch, and a prohibition that
protects nothing.

## Bundle a script only when it removes real risk

Bundle a script when running the same steps deterministically beats re-deriving
them each time. Document its inputs, outputs, dependencies, exit behavior, and
recovery. Keep the reasoning in the instructions, not the script.

Put templates and media the output consumes in `assets/`. Put conditional rules,
schemas, and long examples in `references/`.
