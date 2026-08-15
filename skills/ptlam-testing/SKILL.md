---
name: ptlam-testing
description:
  Design, write, update, run, review, and diagnose automated tests at unit,
  integration, and end-to-end levels. Use when an agent needs to select a test
  level, add or repair tests, improve testability, assess test quality, audit
  test code for compliance, diagnose failures, or follow an explicitly requested
  test-first or Red-Green-Refactor workflow. Do not infer TDD merely from a
  request for tests or integration testing.
---

# PTLam Testing

Test observable behavior through the smallest public seam that can establish
the risk. This foundation owns testing scope, level, behavior, test-double
boundaries, TDD activation, audit authority, verification depth, and the
fallback placement model. Project evidence and active stack specializations own
the mechanics they define more specifically.

## Required skills

### `ptlam-managing-testing-context`

**Reason:** Provides verified project testing facts and preferences.

**Instructions:** Read and apply ptlam-managing-testing-context first in read-only mode
for every project-tied task. Let it own the project root, context
path, freshness, and stored testing facts. Report suggested
maintenance without writing context during testing work.

Read [ptlam-managing-testing-context](skills/ptlam-managing-testing-context/SKILL.md).

### `ptlam-resolving-testing-environment`

**Reason:** Owns testing environment and toolchain resolution.

**Instructions:** Apply ptlam-resolving-testing-environment when the environment or
toolchain is ambiguous, unverified, incompatible, missing, being
replaced, or explicitly under review. Pass it the read-only
testing-context result, then consume its resolved environment, tools,
constraints, and authority without repeating its selection workflow.

Read [ptlam-resolving-testing-environment](skills/ptlam-resolving-testing-environment/SKILL.md).

## At a glance

```mermaid
flowchart LR
    A[Consume project context and select testing mode] --> B[Define behavior, risk, level, and environment requirements]
    B --> C{Environment and toolchain viable?}
    C -- No --> D[Consume testing-environment result]
    C -- Yes --> M{Testing mode}
    D --> M
    M -- Run or diagnose --> H[Execute existing tests and isolate the cause]
    M -- Write, fix, TDD, or audit --> E[Apply the universal behavior contract]
    E --> F[Resolve placement and doubles]
    F --> G{Testing mode}
    G -- Write or fix --> I[Implement the scoped tests]
    G -- TDD --> J[Run Red-Green-Refactor slices]
    G -- Audit --> K[Report evidence-backed findings]
    H --> L[Verify and hand off]
    I --> L
    J --> L
    K --> L
```

## Decision ownership

| Decision | Source of truth |
| --- | --- |
| Scope, behavior, level, doubles, TDD, audit, verification depth | This foundation skill |
| Project root, durable testing facts, and context freshness | Required `ptlam-managing-testing-context` skill |
| Environment and toolchain selection | Required `ptlam-resolving-testing-environment` skill when current evidence is insufficient |
| Repository policy, established commands, and layout | Current repository evidence |
| Stack-specific mechanics left open by the repository | Active specialization skill |
| API syntax, lifecycle, and version-sensitive options | Installed tool's official documentation |

Universal behavior rules in this skill remain mandatory. Resolve mechanics that
those rules leave open in this order: explicit user instructions, repository
policy and established conventions, active specialization, this skill's
fallbacks, then current official tool guidance. Report unresolved conflicts
instead of choosing silently.

## 1. Consume project context and select testing mode

1. Start from the required `ptlam-managing-testing-context` read-only result.
   Use its project root, verified task-relevant facts and preferences, context
   state, and reported uncertainty. Do not maintain context during this
   workflow.
2. Choose one mode:

   | Mode | Authority |
   | --- | --- |
   | Write or fix | Create or change tests and make only authorized production changes |
   | Run or diagnose | Execute existing tests or isolate a failure cause; keep project files read-only |
   | Audit | Inspect and report; fixes require a separately selected write-or-fix mode |
   | TDD | Follow Red-Green-Refactor only when the user explicitly requests test-first work, TDD, or Red-Green-Refactor |

3. Read repository instructions, relevant decision records,
   manifests, test configuration, neighboring production code, existing tests,
   and CI. Treat live repository evidence as authoritative over cached context.

Complete this step when every project root, testing mode, change authority,
context state, and governing repository source is known.

## 2. Define behavior, risk, level, and environment requirements

1. State the observable behavior or failure risk in repository domain language.
2. For write, fix, TDD, or audit mode, choose the smallest clear public seam.
   Ask only when materially different seams would change behavior, cost, or
   confidence.
3. Select exactly one primary level:
   [unit](references/test-levels/unit.md),
   [integration](references/test-levels/integration.md), or
   [end-to-end](references/test-levels/e2e.md). Load more than one only when each
   covers a distinct risk without duplicating assertions.
4. Identify the execution environment, existing test tools, supported
   platforms, commands, and configuration owner.
5. Apply the required `ptlam-resolving-testing-environment` skill when the
   environment or toolchain is ambiguous, unverified, incompatible, missing,
   being replaced, or explicitly under review. Consume its environment,
   toolchain, constraints, commands, and authority decision without repeating
   its selection work.

Complete this step when the task has a supported behavior, public seam when
applicable, primary level, environment, toolchain, and configuration owner.

## 3. Apply the universal behavior contract

Apply this step only in write, fix, TDD, or audit mode.

Every test must:

- verify behavior through a public interface rather than private methods,
  internal calls, or incidental structure;
- use Given-When-Then. Prefer the tool's native API; otherwise add explicit
  `Given`, `When`, and `Then` comments rather than Arrange-Act-Assert;
- read as a behavior specification in repository domain language;
- derive expected values independently from a specification, worked example,
  or known literal rather than the production algorithm;
- cover one coherent behavior or risk, using several assertions only when they
  jointly describe that outcome;
- prefer real collaborators inside the selected seam and replace only a
  justified boundary;
- remain deterministic and isolated by controlling time, randomness, external
  services, and mutable global state at their boundaries; and
- clean up every resource it creates.

Use higher levels only for risks lower levels cannot establish. Do not repeat
the same assertion across levels or turn a coverage percentage into a substitute
for behavior-based design.

The following rules are invariant: Given-When-Then, public-seam behavior,
independent expectations, deterministic cleanup, nearest-scope reusable doubles,
read-only audit mode, and explicit-only TDD activation. Repository conventions,
specializations, and tool documentation may refine mechanics but cannot remove
these rules.

Complete this step when every planned test states one observable risk and
satisfies the universal contract before stack-specific mechanics are chosen.

## 4. Resolve placement and test doubles

Apply this step only in write, fix, TDD, or audit mode.

Use the placement owner selected by the precedence above. An established
repository layout wins over a specialization fallback. A specialization may
define a stack default when repository evidence is silent.

When no higher-precedence source defines placement, use this foundation
fallback: map the production root to the repository's test root, preserve the
production or capability scope, then add the test-level segment.

```text
<production-root>/<capability-scope>/<source-file>
-> <test-root>/<capability-scope>/<test-level>/<test-file>
```

Use repository names for the roots, capability directories, level directories,
and test filenames. Mirror remaining source directories and filenames when one
test corresponds to one production file. For a user journey or capability with
no single source file, organize by that capability before its level. Do not
reorganize unrelated legacy tests as a side effect.

When a touched test violates the active placement owner, tell the user. Move it
only when relocation is already in scope or separately authorized; then remove
the old location, update imports and configuration, and rerun the relevant
tests.

Whenever a double is present or proposed, read
[test doubles](references/patterns/test-doubles.md). Place a reusable double at
the nearest common scope within the resolved test layout; keep one-off setup in
the test. The double reference owns semantic roles, dependency selection,
placement, lifecycle, and false-confidence safeguards.

Complete this step when one source owns test placement, every new test has an
unambiguous location, and every double has a justified boundary and nearest
common owner.

## 5. Execute the selected testing mode

Run-or-diagnose mode skips steps 3 and 4, then enters its branch below.

### Run or diagnose

Keep project files read-only. Resolve the exact established command and run the
smallest requested or failing scope first. Expand to a containing suite only
when it distinguishes the cause or establishes the requested result.

For a failure, determine whether current evidence points to the test,
production behavior, expectation, configuration, dependency, or execution
environment. Report the cause and smallest useful correction. Do not apply the
correction unless the user separately authorizes a write or fix mode.

Complete this branch when the requested test result is recorded or the failure
cause is isolated as far as available evidence permits, with uncertainty named.

### Write or fix

Create or change tests freely within scope. In a testing-only task, make only
small behavior-preserving production refactors needed to expose a clean seam.
Change observable production behavior only when the request includes feature or
bug-fix implementation or the user confirms that expansion.

Establish whether the test, implementation, expectation, or environment is
wrong before changing an assertion. Never weaken a valid assertion merely to
make a failure pass.

### TDD

Read [test-driven development](references/workflows/test-driven-development.md)
and follow it one vertical behavior slice at a time. Do not activate this branch
for an ordinary request to add tests or integration coverage.

### Audit

Keep the audit read-only. When the user also asks for fixes, finish the
evidence-backed findings first, then enter write-or-fix mode with its separate
authority.

1. Define the reviewed scope and load every applicable reference.
2. Inspect production code when needed to judge behavior, seams, placement, and
   implementation coupling.
3. Identify mandatory violations and material missing scenarios at the public
   seam. Tie each gap to expected behavior, a failure mode, or a concrete risk.
4. Separate static findings from behavior verified by executed tests.
5. Report each finding with location, violated rule, evidence, impact, smallest
   useful correction, and uncertainty or trade-off. Include compliant aspects
   and areas that could not be verified.
6. Assign one scoped verdict: `Compliant`, `Compliant with recommendations`,
   `Non-compliant`, or `Not fully verified`.
7. Classify findings as `Critical` for false confidence or concealed severe
   breakage, `Major` for a mandatory violation or missing material behavior, and
   `Minor` for readability or maintenance harm.

Do not demand tests for every line, branch, or method, and do not impose a
numeric coverage threshold unless the user or repository defines one.

Complete this step when the requested run, diagnosis, write, fix, TDD cycle, or
audit has one clear outcome and stays within its authority.

## 6. Verify and hand off

1. After test or production changes, run the smallest focused test after each
   meaningful change.
2. In TDD, prove that Red fails for the expected reason before implementing
   Green.
3. After focused tests pass, run the containing package or module suite.
4. Run environment-specific and repository-wide checks in proportion to risk,
   mode, and repository policy.
5. Report the level, environment, tools, read-only context state, changed
   behavior and files, exact commands and results, and every skipped or
   unavailable check.
6. Disclose remaining risks, migrations, conflicts, stale or provisional
   context, and unresolved decisions.

Complete the task when the selected branch has one verified outcome, every file
effect stays within its mode authority, proportional checks are accounted for,
and the handoff does not imply that an unrun check passed.
