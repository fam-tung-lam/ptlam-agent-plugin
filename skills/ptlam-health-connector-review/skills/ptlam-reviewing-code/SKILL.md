---
name: ptlam-reviewing-code
description:
  Review one bounded code changeset and return an evidence-backed, prioritized
  findings report and readiness verdict. Use when reviewing a pull request,
  branch, commit range, or explicit revision comparison. Use when reviewing
  staged, unstaged, or untracked working-tree changes. Use when judging an
  implementation against a task, issue, or specification. Compose this skill
  when a stack or project review needs the general review standard.
---

# PTLam Reviewing Code

Review one bounded code changeset and return a prioritized findings report and
readiness verdict. Keep the review read-only. A review request does not
authorize edits, review comments, approvals, pushes, or merges.

## Required skills

### `ptlam-code-style`

**Reason:** Provides the language-neutral complexity, source, boundary, failure, documentation, logging, and testing conventions a code review judges.

**Instructions:** Read and apply ptlam-code-style before judging source or tests.
Let it own precedence; code complexity; source structure and
boundaries; naming and readability; data modeling; contracts;
failures; documentation; logging; evolution; test behavior, levels,
placement, and doubles.
Apply a matching stack specialization when one is available.
Let this skill own the review surface, intent, risk examination,
finding gate, severity, verification limits, and readiness verdict.

Read [ptlam-code-style](skills/ptlam-code-style/SKILL.md).

### `ptlam-architecturing`

**Reason:** Supplies the judging-suitability standard for a changeset that introduces a structure expensive to reverse.

**Instructions:** Read ptlam-architecturing while examining the change.
Apply only its judging-suitability standard, and only when the
changeset introduces a component, runtime, or data-store split, a
published surface, state ownership, or a platform commitment.
Let it own the verdict on that structure and the stale heuristics
to revalidate.
Keep this skill's ownership of the review surface, finding gate,
severity, and readiness verdict.
Skip it for a changeset that introduces no such structure.

Read [ptlam-architecturing](skills/ptlam-architecturing/SKILL.md).

## Establish the review contract

1. Resolve the target repository and worktree. Read the current request and
   every applicable repository instruction from the root to the changed files.
2. Pin one review surface with the table below. Resolve every revision before
   reading the diff, then name the exact comparison and changed-file list.

| Surface                  | Comparison                                                                     |
| ------------------------ | ------------------------------------------------------------------------------ |
| Uncommitted working tree | Inspect staged and unstaged changes separately, including untracked files.     |
| Commit or tag            | Compare the requested revisions with the user's stated semantics.              |
| Branch                   | Compare its merge base with the requested base unless the user says otherwise. |
| Pull request             | Use its exact base, head, commits, description, linked work, and CI state.     |

1. Resolve expected behavior from the user's task or statement, specification,
   issue, or linked requirement. Treat the pull-request description, tests, and
   changed documentation as implementation claims, not as authority for expected
   behavior. When no independent intent exists, use those claims to understand
   scope but state that specification conformance remains unverified.
2. Map the affected behavior, callers, boundaries, configuration, generated
   ownership, tests, and release surfaces. Read tests first when they express
   the changed behavior, then read every changed file with enough surrounding
   code to trace its effects.

Stop and report the unresolved surface when a revision is invalid, the diff is
empty, generated ownership is ambiguous, or the requested scope cannot be
distinguished from unrelated work.

## Examine the change

Apply the loaded code-style guidance to changed source and tests. Use the table
below to cover risks that code conventions alone cannot settle.

| Concern                     | Examine                                                                                                  |
| --------------------------- | -------------------------------------------------------------------------------------------------------- |
| Intent and correctness      | Required behavior, edge inputs, state transitions, error paths, and unintended scope                     |
| Regression evidence         | Whether tests fail without the change, cover the risk, and assert behavior rather than implementation    |
| Architecture and simplicity | Ownership, dependency direction, duplicated paths, speculative abstractions, and complexity merely moved |
| Security and privacy        | Trust boundaries, validation, authorization, injection, secrets, sensitive output, and unsafe defaults   |
| Concurrency and reliability | Races, cancellation, idempotency, retries, resource lifetime, partial failure, and migration safety      |
| Performance                 | Unbounded work, repeated I/O, N+1 access, blocking hot paths, large allocations, and missing pagination  |
| Compatibility               | Public contracts, persisted data, configuration, supported platforms, generated files, and rollout       |

When a package manifest or lockfile changes, read
[reviewing dependency changes](references/dependency-changes.md).

When the changeset introduces a component, runtime, or data-store split, a
published surface, state ownership, or a platform commitment, read the loaded
architecture skill's judging-suitability standard. Admit a finding on that
structure only when that standard's verdict is not yet suitable. Report an
unknown need as missing intent rather than a finding.

Inspect existing CI evidence only when it belongs to the exact revision under
review. Run check-mode commands only when task authority and repository rules
allow their local artifacts. Keep formatters, generators, snapshot updates,
baseline creation, dependency installation, and every other rewriting command
out of a review. A passing check narrows uncertainty; it never proves the
implementation correct.

## Admit a finding

Report a finding only when all four conditions hold:

1. The changeset introduces the defect or makes a pre-existing defect reachable.
2. The impact is concrete and matters to behavior, safety, operability, or
   maintainability.
3. The evidence identifies the affected file and smallest useful line or range.
4. The correction is specific and no wider than the defect.

Treat a code smell as a lead to investigate, never as a finding by itself.
Exclude taste, speculative future concerns, unrelated pre-existing defects, and
deterministic tool output that adds no diagnosis. Name a structural remedy when
the defect is structural. Prefer the remedy that removes moving pieces.

| Severity | Threshold                                                                                                |
| -------- | -------------------------------------------------------------------------------------------------------- |
| Critical | Exploitable security or privacy exposure, data loss, broken public contract, crash, or certain outage    |
| Major    | Reachable incorrect behavior, race, error loss, compatibility break, or material architecture regression |
| Minor    | Local maintainability or convention defect with a concrete cost and no present behavior failure          |

Severity reflects impact, not confidence. Investigate uncertain evidence or
record it as an unverified risk instead of promoting a guess into a finding.

## Report the verdict

Lead with findings from highest to lowest severity. For each one, give a short
title, severity, file and line, observable impact, evidence, and smallest
correction. Do not add a category with no finding.

After the findings, list the exact evidence inspected, checks run, checks not
run, and any missing intent or platform coverage. End with one verdict:

| Verdict                          | Use when                                                                  |
| -------------------------------- | ------------------------------------------------------------------------- |
| Not ready                        | A Critical or Major finding remains, or required evidence is missing.     |
| Ready with non-blocking findings | Only Minor findings remain and the required evidence supports the change. |
| Ready                            | No finding survives review and the required evidence supports the change. |

If no finding survives, say so plainly before the verification limits. Finish
after the report; wait for a separate request before changing code or GitHub
state.
