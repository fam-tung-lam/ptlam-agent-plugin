# Verifying Skills

This file covers pruning, package checks, and the final report for every create,
refactor, or review operation.

For created or refactored files, delete everything
[writing for maintainers](writing-for-maintainers.md#delete-these-on-sight)
lists. For every operation, reapply Rule 1, run the available validators, and
inspect the package tree. Inspect the diff only when files changed.

| Check          | Passes when                                                                                                                    |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| Capability     | Rule 1 holds and every dependency names its owner                                                                              |
| Composition    | The foundation stays complete; each specialization rule adds a mechanic, tightens the domain, or points to its owner           |
| Layout         | Every file has a consumer and fits its limit; each split earns its cost through ownership, conditional loading, or readability |
| Disclosure     | `SKILL.md` holds the whole normal path; each reference sits one hop away behind a condition named there and nowhere else       |
| Self-contained | The package runs with every external URL unavailable; external links carry no required knowledge                               |
| Readability    | Title, headings, and visual labels alone reveal the path and how it ends                                                       |
| Visual form    | Each point uses the highest form that fits, replaces the prose it stands in for, and passes its diagram checks                 |
| Metadata       | Name, folder, description, and invocation agree with the host, and no body names a required skill                              |
| Freshness      | Nothing duplicated, stale, unused, or placeholder remains; links resolve                                                       |

For a review, return the verdict, evidence for every failed check, and the
smallest fix. For changed files, report what changed and where. Always name the
checks run, unavailable verification, and remaining doubt.

Finish when both rules hold or the review accounts for every failed check, and
every allowed authored or generated effect is current.
