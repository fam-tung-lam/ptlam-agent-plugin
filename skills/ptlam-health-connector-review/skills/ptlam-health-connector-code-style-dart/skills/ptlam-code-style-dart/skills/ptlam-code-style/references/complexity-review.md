# Reviewing Repository Complexity

Review one requested repository or source scope for evidence-backed,
behavior-preserving reductions in owned code, dependencies, and abstractions.
Return a prioritized report. Keep the review read-only; the request does not
authorize fixes, dependency changes, generated output, comments, commits, or
publication.

## Establish the review surface

1. Resolve the repository, revision or working-tree state, and applicable
   repository instructions. Name the exact snapshot being reviewed.
2. Confirm the one requested scope. Resolve its languages, supported runtimes,
   entry points, manifests, build targets, and source-generation boundaries.
3. Inventory repository-owned source, tests, configuration, dependencies, and
   public contracts before searching for reductions.

Exclude vendored or third-party source, generated output, build artifacts,
lockfiles, snapshots, and fixtures from findings unless the user explicitly
includes them. Inspect them only when they identify an owner, consumer, or
constraint. Report the owning template, generator, manifest, or source instead
of proposing edits to derived files.

Stop and report the unresolved surface when the repository or requested revision
is inaccessible, ownership cannot distinguish authored from derived or vendored
code, or the requested scope cannot be separated from unrelated work.

## Find and prove reductions

Apply the loaded minimum-change hierarchy across the review surface. Use each
category below as a search lead, then trace the complete responsibility before
admitting a finding.

| Opportunity      | Evidence required                                                                                   |
| ---------------- | --------------------------------------------------------------------------------------------------- |
| Delete           | No reachable caller, registration, external contract, migration role, or required side effect       |
| Reuse            | Repository-owned behavior already satisfies the same inputs, outputs, failures, and lifecycle       |
| Standard library | The supported runtime provides the required semantics and edge-case behavior                        |
| Platform         | Every declared target provides the capability or has an accounted fallback                          |
| Dependency       | Removal or existing reuse preserves all call sites, targets, license duties, and supply-chain needs |
| Abstraction      | The layer, configuration, or variation has no present independent behavior or required boundary     |

A finding must identify the exact symbol or path, its current callers and
responsibility, the safe deletion or replacement, the preserved behavior, and
the evidence that rules out hidden use. Treat similarity, line count, a
single-implementation interface, or a delegating wrapper as a lead rather than
proof. Account for reflection, dependency injection, dynamic loading, code
generation, external consumers, and staged migrations.

Rank surviving findings by verified maintenance reduction, then confidence and
change risk. Never rank line count above correctness, security, data safety,
accessibility, compatibility, or operability.

## Verify without changing the repository

Use existing evidence from the reviewed snapshot. Run check-mode commands only
when repository rules allow their local artifacts. Keep formatters, generators,
dependency installation, snapshot updates, baselines, and all other rewriting
commands out of the review.

When behavior preservation cannot be proved read-only, record the item as an
unverified candidate or verification limit instead of a finding. A passing check
narrows uncertainty; it does not prove that a proposed reduction is safe.

## Report the review

Lead with findings in priority order. For each one, give a short title,
opportunity, exact path and line, current responsibility, removal or
replacement, preservation evidence, risk, and the smallest verification needed
before implementation. Quantify removable lines or dependencies only when the
snapshot makes the exact reduction countable.

After the findings, list unverified candidates, evidence inspected, excluded
surfaces, checks run, checks not run, and remaining uncertainty. If no finding
survives, say so plainly. Do not issue a code-review readiness verdict; this
review judges removable complexity, not the scope's correctness or safety.

Finish when every reported reduction passes the evidence gate and the report
accounts for the complete review surface and its verification limits.
