# Skill Atomicity and Composition

This file covers the capability tests, the keep-or-split decision, the
self-contained contract, how a skill starts, and how a foundation and a
specialization share ownership.

The model adapts Sascha's
[Complete Guide to Atomic Note-Taking](https://zettelkasten.de/atomicity/guide/),
retrieved on 2026-08-15, from knowledge building blocks to agent capabilities.
The link records attribution only; the tests below are complete.

## What counts as one capability

One capability is the smallest behavior someone would ask for on its own. It has
one responsibility, produces one kind of result, works on one main file or
decision, and passes one standard for being done.

Judge this by behavior, not by file, tool, or step count. Internal files may sit
together as long as they serve that one behavior.

## The six tests

1. **Naming.** Can one action-oriented name identify it?
2. **Result.** Do all branches produce the same kind of result?
3. **Standard.** Do they work on the same main artifact under one standard for
   being done?
4. **Completeness.** Can the declared inputs and dependencies reach that
   standard?
5. **Independent reuse.** Would another caller ask for one branch on its own,
   for a different responsibility? If yes, split it.
6. **Composition.** Can another skill reuse this without copying its text?

Several verbs in the name are a warning, not proof. Create, review, and repair
belong together when the artifact, the responsibility, and the standard match.

## Keep, split, or route

| Evidence                                                                   | Decision                 |
| -------------------------------------------------------------------------- | ------------------------ |
| Branches share one artifact and one standard for being done                | Keep them together       |
| A branch has its own callers, result, or standard                          | Split it                 |
| A domain or host adds mechanics to an already complete capability          | Compose a specialization |
| Remembering several skills is the real problem, and routing has one result | Create a router          |
| A file serves only this capability                                         | Keep it internal         |
| Another caller would ask for a file's workflow                             | Promote it to a skill    |

For each split, name its capability, trigger, output, standard, boundary, and
the edges that join it to the others. Give shared behavior exactly one owner.

## Choose how the skill starts

| Choose           | When                                                                                  |
| ---------------- | ------------------------------------------------------------------------------------- |
| Model invocation | An agent should find the skill on its own                                             |
| User invocation  | Only a person should start it, because it interviews or writes outside the repository |
| A router skill   | Routing several skills is useful work by itself                                       |

A skill that other skills depend on must be model-invocable; a dependency the
model may not start is a contradiction.

## Make the contract self-contained

The package states its start conditions and required inputs, its ordered actions
and branch rules, its outputs and finish conditions, its permission and
side-effect limits, its stop conditions, and the dependencies that supply what
it does not own.

Self-contained does not mean dependency-free. A dependency is valid when the
host loads it, its promises cover what the caller needs, and ownership stays
explicit.

## Compose without duplicating ownership

Before writing or reviewing a foundation-and-specialization pair, map every
concern in scope:

| Concern       | Foundation owns                              | Specialization adds                     | Precedence      |
| ------------- | -------------------------------------------- | --------------------------------------- | --------------- |
| Test behavior | Observable behavior and double boundaries    | `blocTest` and Flutter runner mechanics | Foundation wins |
| Documentation | Public contract and the purpose of a comment | Dartdoc syntax and analyzer mechanics   | Foundation wins |

Classify every specialization rule as one of:

- an added domain or host mechanic;
- a stricter domain rule that does not weaken the foundation; or
- a pointer to the foundation owner.

A paraphrase of a foundation rule is none of the three. Remove it. Report a rule
whose owner is unclear instead of assigning it quietly.

Then confirm that the foundation stays complete on its own; the specialization
owns one domain or host capability and only that; the foundation owns the shared
behavior, words, and standard; the specialization owns only the stricter or
added mechanics; both declare load order, inputs, outputs, permission, and
precedence in the host metadata; and each points to the owner instead of
restating its rules.

Rule 1 passes when all six tests pass, every branch serves the one capability,
every prerequisite is declared, every shared rule has one owner, and the
ownership map holds no unclassified specialization rule.
