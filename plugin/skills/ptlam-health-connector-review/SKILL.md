# PTLam Health Connector Review

Review one working-tree changeset and return a prioritized findings report. Keep
the review read-only. Do not edit files, regenerate Pigeon output, run a
formatter in write mode, or offer fixes until the user asks for them.

<!-- PLUGIN-COMPILER:REQUIRED-SKILLS -->

## Resolve the review surface

1. Read repository instructions, then run `git status --short`, `git diff`, and
   `git diff --staged`. Name the exact added, changed, deleted, and generated
   files. Done when staged and unstaged scopes cannot be confused.
2. Read each changed file with enough surrounding source to judge behavior.
   Treat committed configuration and code as authoritative over `CLAUDE.md`.
3. Identify every affected package, language, public library, Pigeon contract,
   native layer, platform, test suite, document, and changelog.

## Review the change

### Correctness and failure behavior

- Check validation, empty and boundary inputs, paging, timestamps, units,
  identifiers, platform availability, and capability checks.
- Trace exceptions through native translation, Pigeon error DTOs, Dart mapping,
  and the public exception type. Preserve cancellation and completion behavior.
- Check that logs and error details contain no health values, identifiers,
  user-owned dates, or device names.

### Architecture and compatibility

- Keep package dependency direction and layer ownership intact.
- Treat public Dart exports, `@since` history, data-type ids, Pigeon DTOs,
  error-code strings, and plugin methods as release boundaries.
- Check Android handler registration and capabilities, iOS registration and
  availability gates, and every supported/unsupported platform branch.
- Flag hand-edited generated files. Compare each Pigeon source change with all
  expected generated outputs and the Swift post-processor.

### Language conventions

Apply the loaded project language guidance only to changed files in that
language. Report the violated rule and smallest correction; do not repeat the
whole convention.

### Evidence and release impact

- Require focused tests for changed Dart behavior and Kotlin behavior.
- State plainly that Dart platform tests do not execute native code and that the
  Swift package currently lacks an effective native test target.
- Check public dartdoc, platform limitations, examples, migration guidance,
  package changelogs, and semantic-version impact where behavior is public.
- Compare intended verification with the Melos scripts and relevant CI workflow.

Run check-mode analysis or tests only when the user authorizes their local build
artifacts. Never run `melos run pigeon`, `melos run format`, baseline
generation, or another rewriting command during review.

## Report findings

Order findings by severity. Each finding names the severity, file and line,
observable impact, evidence, and smallest correction.

| Severity | Use for                                                                                                          |
| -------- | ---------------------------------------------------------------------------------------------------------------- |
| Critical | Data corruption, crash, privacy or security exposure, broken public contract, or guaranteed runtime failure      |
| Major    | Incorrect platform behavior, missing registration or mapping, race, error loss, or architectural boundary breach |
| Minor    | Maintainability or project-convention defect that can safely follow the functional corrections                   |
| Coverage | Missing tests, native evidence, documentation, migration notes, changelog, or release proof                      |

Do not report a category with no finding. If no defect survives review, say so
and list the files, platforms, and checks that were not examined or run.

Finish after the report. Wait for a separate request before changing anything.
