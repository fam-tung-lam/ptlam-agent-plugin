# PTLam Health Connector Code Style Dart

Write, review, or fix Dart source and tests in the Health Connector SDK. This
skill owns only the repository's Dart conventions: analyzer and formatter
settings, imports, declaration shape, documentation, structured logging calls,
and test layout.

Not this skill: workspace architecture, public API decisions, platform support,
Pigeon ownership, domain capabilities, or end-to-end feature completeness.

<!-- PLUGIN-COMPILER:REQUIRED-SKILLS -->

## Apply the project conventions

1. Find the changed Dart file and its package `analysis_options.yaml`. Confirm
   whether it is handwritten source, a part file, a test, or generated output.
   Leave generated `*.g.dart` alone.
2. Apply [source conventions](references/source-conventions.md) to handwritten
   code and [analyzer and formatter](references/analyzer-and-formatter.md) to
   configuration or check failures.
3. Read [documentation](references/documentation.md) for a public declaration or
   a dartdoc failure. Read [tests](references/tests.md) for test placement,
   imports, doubles, fixtures, or structure.
4. Make the smallest language-level change that satisfies the convention. Do not
   redesign a package or a cross-platform contract to fix a style finding.
5. Run focused tests, then the repository checks from the monorepo root:

   ```bash
   melos run format:dart:check
   melos run analyze:dart:strict
   melos run test:dart
   ```

Run `melos run doc:generate` when public documentation changed.

## Finish

Finish when handwritten Dart follows the project convention, generated files
stay generator-owned, the applicable checks pass, and the handoff names every
check not run. Report a functional or architecture defect you notice to its
owner instead of absorbing it here.
