# PTLam Health Connector Review

Add Health Connector project and platform risks to the loaded code-review
foundation. Keep its review surface, read-only authority, finding gate,
severity, output shape, and readiness verdict unchanged.

<!-- PLUGIN-COMPILER:REQUIRED-SKILLS -->

## Map the Health Connector surface

1. Identify every affected package, language, public library, Pigeon contract,
   native layer, platform, test suite, document, and changelog.
2. Treat committed configuration and code as authoritative over `CLAUDE.md`.
3. Match every generated file in the review surface to its Pigeon source and the
   Swift post-processor.

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

### Project language conventions

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

Run Health Connector check-mode analysis or tests only under the foundation's
authority rules. Keep `melos run pigeon`, `melos run format`, baseline
generation, and every other rewriting command out of the review.

Return project findings and verification limits to the foundation. Let it assign
severity, order the report, and decide the readiness verdict.
