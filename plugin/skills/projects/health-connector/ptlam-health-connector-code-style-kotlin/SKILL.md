# PTLam Health Connector Code Style Kotlin

Write, review, or fix Kotlin source and unit tests under
`packages/health_connector_hc_android/android/`. This skill owns only the
repository's Kotlin conventions: visibility, declaration and extension shape,
imports, logging calls, ktlint and detekt settings, and test form.

Not this skill: Android architecture, Health Connect behavior, Pigeon ownership,
handler capabilities, failure translation, or end-to-end registration.

<!-- PLUGIN-COMPILER:REQUIRED-SKILLS -->

## Apply the project conventions

1. Confirm the file is handwritten Kotlin under `src/main/kotlin` or
   `src/test/kotlin`. Leave generated `*.g.kt` alone.
2. Apply [source conventions](references/source-conventions.md). Read
   [ktlint and detekt](references/checks.md) for configuration or a check
   failure, and [unit tests](references/tests.md) for test code.
3. Make the smallest language-level fix. Do not move behavior between plugin,
   client, service, registry, handler, or mapper layers to fix a style finding.
4. Run from the monorepo root:

   ```bash
   melos run format:kotlin:check
   melos run analyze:kotlin
   melos run test:kotlin
   ```

Use `melos run format:kotlin` only when file changes are allowed. Run Kotlin
tests through the example app via the Melos script, not from the plugin module.

## Finish

Finish when handwritten Kotlin follows the configured convention, every new
suppression has a specific reason, the detekt baseline is unchanged unless its
regeneration was separately requested, the applicable checks pass, and the
handoff names every check not run.
