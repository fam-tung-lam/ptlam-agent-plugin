# PTLam Testing

Test observable behavior through the smallest public seam that can establish
the risk. This foundation owns testing scope, level, behavior, test-double
boundaries, TDD activation, audit authority, verification depth, and the
fallback placement model. Current user instructions and applicable `AGENTS.md`
own project-specific requirements. Repository files supply facts about existing
commands, configuration, code, and layout. Active stack specializations own the
mechanics they define more specifically.

<!-- PLUGIN-COMPILER:REQUIRED-SKILLS -->

## At a glance

```mermaid
flowchart LR
    A[Resolve scope, rules, and testing mode] --> B[Define behavior, risk, and level]
    B --> M{Testing mode}
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
| Project-specific requirements and permitted exceptions | Current user instructions, then applicable `AGENTS.md` |
| Established commands, configuration, and layout | Current repository files |
| Stack-specific mechanics left open by the repository | Active specialization skill |
| API syntax, lifecycle, and stack defaults | The active specialization's bundled references |

Universal behavior rules in this skill remain mandatory. Resolve mechanics that
those rules leave open in this order: explicit user instructions, applicable
`AGENTS.md`, established repository commands and layout, active specialization,
then this skill's fallbacks. Report unresolved conflicts instead of choosing
silently. Repository files are evidence, not an additional preference store.

## 1. Resolve scope, rules, and testing mode

1. Resolve the target project from the user's paths and current worktree. Read
   current user instructions and every applicable `AGENTS.md` from the project
   root to the files in scope.
2. Choose one mode:

   | Mode | Authority |
   | --- | --- |
   | Write or fix | Create or change tests and make only authorized production changes |
   | Run or diagnose | Execute existing tests or isolate a failure cause; keep project files read-only |
   | Audit | Inspect and report; fixes require a separately selected write-or-fix mode |
   | TDD | Follow Red-Green-Refactor only when the user explicitly requests test-first work, TDD, or Red-Green-Refactor |

3. Read only the manifests, test configuration, neighboring production code,
   existing tests, scripts, and CI needed to perform the selected mode. Use
   these files to observe the current implementation, not to build or maintain
   a separate project-context record.

Complete this step when the project, testing mode, change authority, applicable
rules, and task-relevant repository evidence are known.

## 2. Define behavior, risk, and level

1. State the observable behavior or failure risk in repository domain language.
2. For write, fix, TDD, or audit mode, choose the smallest clear public seam.
   Ask only when materially different seams would change behavior, cost, or
   confidence.
3. Select exactly one primary level:
   [unit](references/test-levels/unit.md),
   [integration](references/test-levels/integration.md), or
   [end-to-end](references/test-levels/e2e.md). Load more than one only when each
   covers a distinct risk without duplicating assertions.
4. Select the active stack specialization. Let it own runner, configuration,
   commands, and stack compatibility. When the task does not match an available
   specialization, report the unsupported scope instead of inventing a new
   toolchain workflow.

Complete this step when the task has a supported behavior, public seam when
applicable, primary level, and active stack specialization.

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
no single source file, organize by that capability before its level. Leave
unrelated existing tests in place.

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
smallest requested or failing scope first. Use the active specialization's
bundled command fallback when the repository defines no command. Expand to a
containing suite only when it distinguishes the cause or establishes the
requested result.

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
4. Run stack-specific and repository-wide checks in proportion to risk, mode,
   and applicable user or `AGENTS.md` requirements.
5. Report the level, active specialization, changed behavior and files, exact
   commands and results, and every skipped or unavailable check.
6. Disclose remaining risks, migrations, conflicts, unsupported scope, and
   unresolved decisions.

Complete the task when the selected branch has one verified outcome, every file
effect stays within its mode authority, proportional checks are accounted for,
and the handoff does not imply that an unrun check passed.
