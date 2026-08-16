# Skill Package Layout

This reference owns what each package surface holds, how long a file may be,
and when detail leaves `SKILL.md`. The target host's own layout rules outrank
this file.

## What each surface owns

| Surface | Owns |
| --- | --- |
| `SKILL.md` | The outcome, the scope, the whole normal path, and the pointers out |
| Host metadata | Discovery and interface fields |
| `references/` | Conditional rules, schemas, and long examples |
| `scripts/` | Deterministic operations that repeat |
| `assets/` | Templates and files the produced output consumes |

Create a directory only when something concrete will live in it. Installation
guides, changelogs, and process notes belong outside the package. Behavior
another skill would invoke on its own belongs in its own skill.

## Keep every file at or under 100 lines

Count physical lines. Table rows and complete fenced blocks do not count.

When a file passes the limit, split it by responsibility or delete from it.
Compressing prose to fit is the one repair that is never allowed; see
[cut instead of compressing](writing-for-maintainers.md#cut-instead-of-compressing).

A file that only fits after compression was two files.

## Move detail out only when one branch needs it

1. `SKILL.md` keeps the outcome, the boundary, the whole normal path, and each
   step's finish condition.
2. A rule every branch needs stays inline.
3. A rule one branch needs moves behind a single pointer that names its
   condition and the file that owns it.
4. Use a routing reference only for a large catalog of mutually exclusive
   options.
5. Keep a concept's definition, rules, examples, and caveats in one place.
6. The reference opens with what it owns, never with when to read it. That
   condition belongs at the pointer that sent the reader here.

Every rule stays one hop from `SKILL.md`, and every condition is written once.
A reference that repeats its own trigger creates a second place to update when
the routing changes, and the two drift apart.

## Name it after what it does

Follow the target schema first. Otherwise use a short action-oriented name in
lowercase letters, digits, and hyphens, under 64 characters, matching the
directory name. Avoid `helper`, `misc`, `utils`, and `notes`.

A model-facing description is a pointer, not a summary. State the capability,
then one trigger per branch, then a reach clause if another skill composes this
one. Drop any trigger that only renames a branch, and any prohibition that
protects nothing.

## Bundle a script only when it removes real risk

Bundle a script when deterministic execution beats re-deriving the steps each
time. Document its inputs, outputs, dependencies, exit behavior, and recovery.
Keep the reasoning in the instructions, not in the script.

Put templates and media the output consumes in `assets/`. Put conditional
rules, schemas, and long examples in `references/`. Label anything
time-sensitive with its source, its version, and how a reader can tell it went
stale.
