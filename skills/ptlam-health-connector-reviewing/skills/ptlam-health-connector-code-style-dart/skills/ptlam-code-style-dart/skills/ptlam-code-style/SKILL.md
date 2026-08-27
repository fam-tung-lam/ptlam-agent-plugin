---
name: ptlam-code-style
description:
  Hold source and test code to one language-neutral standard for complexity,
  source structure, boundaries, naming, readability, domain modeling,
  cross-boundary contracts, failure design, documentation, logging, evolution,
  and testing. Use when no stack specialization matches the project, and as the
  foundation every stack specialization composes. Use ptlam-modeling-domain
  instead for business terms and context boundaries, and ptlam-architecturing
  instead for a component, runtime, or data-store split, a published surface,
  state ownership, or a platform commitment.
---

# PTLam Code Style

Route every source and test concern through one language-neutral standard. This
foundation owns the shared rules and words. A stack specialization owns the
mechanics that satisfy them. When a specialization matches the project, use it;
it loads this skill for you.

## Who decides

For any question these rules leave open, take the first source that answers it:

| Order | Source                                         | Owns                                                                     |
| ----- | ---------------------------------------------- | ------------------------------------------------------------------------ |
| 1     | The user's current instructions                | Anything the user states for this task                                   |
| 2     | The applicable `AGENTS.md`                     | Project requirements and permitted exceptions                            |
| 3     | The feature specification and repository files | Confirmed behavior and constraints; established commands, config, layout |
| 4     | The active stack specialization                | Stack mechanics the repository leaves open                               |
| 5     | This skill                                     | The rules below and the fallbacks they point to                          |

Report an unresolved conflict instead of choosing quietly. A specification and
repository files are evidence, not another store of preferences. When a higher
source replaces a rule below, name that replacement in the handoff; silence or
an unrelated local example is not a replacement.

These rules serve the people who read the code next. Break one when it costs a
reader more than it returns, then record the reason where the surprise lives, as
[documentation.md](references/documentation.md) requires. An unexplained
deviation is the defect; an explained one is a decision.

## Pick a reference

Read the one reference for the concern in front of you. Each owns its rules,
examples, and caveats.

| Concern                                                                 | Reference                                                                                                                                                                                                                                               |
| ----------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Placing a file, adding a folder, or shaping the source tree             | [structure.md](references/structure.md)                                                                                                                                                                                                                 |
| Deciding what a unit publishes, which way it depends, where I/O sits    | [boundaries.md](references/boundaries.md)                                                                                                                                                                                                               |
| Naming a file, type, function, variable, or boolean                     | [naming.md](references/naming.md)                                                                                                                                                                                                                       |
| Writing or reshaping the body of a function                             | [readability.md](references/readability.md)                                                                                                                                                                                                             |
| Writing a doc comment, or explaining why code is the way it is          | [documentation.md](references/documentation.md)                                                                                                                                                                                                         |
| Shaping a domain type, a stored record, or a set of states              | [data-modeling.md](references/data-modeling.md)                                                                                                                                                                                                         |
| Promising something across a process, team, or release boundary         | [contracts.md](references/contracts.md)                                                                                                                                                                                                                 |
| Designing a failure, a retry, or a startup check                        | [errors.md](references/errors.md)                                                                                                                                                                                                                       |
| Emitting a log record, naming a logger, or picking a level              | [logging.md](references/logging.md)                                                                                                                                                                                                                     |
| Choosing sufficient code, reuse, deletion, a dependency, an abstraction | [complexity.md](references/complexity.md)                                                                                                                                                                                                               |
| Abstracting a repeated pattern, migrating a shape, recording a decision | [evolution.md](references/evolution.md)                                                                                                                                                                                                                 |
| Deciding what a test must prove, or working test-first on request       | [behavior-contract.md](references/behavior-contract.md)                                                                                                                                                                                                 |
| Choosing one test level for a risk                                      | The behavior contract, then [local-unit.md](references/test-levels/local-unit.md), [local-integration.md](references/test-levels/local-integration.md), [ui-golden.md](references/test-levels/ui-golden.md), or [e2e.md](references/test-levels/e2e.md) |
| Placing a new test file, or moving a misplaced one                      | [test-placement.md](references/test-placement.md)                                                                                                                                                                                                       |
| Adding, naming, or placing a test double                                | [test-doubles.md](references/test-doubles.md)                                                                                                                                                                                                           |

Where a system splits into components, runtimes, or stores, and what a published
surface promises, are architecture decisions outside this skill. Business
vocabulary is domain-modeling work outside this skill.

## Do the work

1. Resolve the project, then read the user's instructions and every applicable
   `AGENTS.md` from the root down to the files in scope.
2. Name the concern and read its one reference. For every test, read the
   behavior contract before choosing a level, placement, or double.
3. Pick the active stack specialization. When none matches, say so instead of
   inventing a toolchain.
4. Apply the rule, then let the specialization supply the mechanics.
5. Run the project's own formatter, linter, type check, and tests. Report the
   exact commands, their results, and every check you did not run.

When build, test, or run is not one fast command, name that friction in the
handoff. A loop people avoid is a defect in the project.

A review changes no files. Fixing what a review found needs separate permission.

## Finish

Finish when every touched file satisfies the rule for its concern, every open
mechanic traces to a named owner in the table above, every deliberate deviation
carries its reason, and the handoff never implies an unrun check passed.
