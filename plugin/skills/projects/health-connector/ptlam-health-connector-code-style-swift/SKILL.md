# PTLam Health Connector Code Style Swift

Write, review, or fix handwritten Swift under
`packages/health_connector_hk_ios/ios/`. This skill owns only the repository's
Swift conventions: access and declaration shape, mapper and extension naming,
structured logging calls, SwiftLint, and SwiftFormat.

Not this skill: iOS architecture, HealthKit behavior, Pigeon completion
threading, failure translation, handler capabilities, or end-to-end
registration.

<!-- PLUGIN-COMPILER:REQUIRED-SKILLS -->

## Apply the project conventions

1. Choose review or change mode under the inherited policy. Confirm the file is
   handwritten Swift under the package source tree. Leave generated `*.g.swift`
   alone.
2. Apply the source conventions below. Read [Swift checks](references/checks.md)
   for configuration or a check failure, and
   [native logging](references/logging.md) for a log call.
3. In review, report conformance findings. In change mode, make the smallest
   language-level fix. Do not move behavior between plugin, client, service,
   registry, handler, or mapper layers to fix a style finding.
4. Run from the monorepo root:

   ```bash
   melos run format:swift:check
   melos run analyze:swift
   ```

Use `melos run format:swift` only when rewriting files is allowed. Do not claim
native test coverage from these checks; they prove formatting and static
analysis only.

## Source conventions

Keep declarations internal by default. Mark only the Flutter-reflected plugin,
and the types the generated public protocol needs, as `public`.

Separate protocol conformances and specialized behavior with `// MARK:` sections
when the neighboring type does.

Mappers are extensions on the converted type. Name the destination in the
method: `toDto()`, `toHKSample()`, `toHKQuantitySample()`, or another exact
HealthKit type.

Keep multiline arguments, parameters, and collections in SwiftFormat's
before-first layout with trailing commas. Let SwiftFormat remove a redundant
`self` and control line wrapping instead of hand-aligning expressions.

## Finish

Finish when handwritten Swift follows the configured convention, generated
output stays generator-owned, the SwiftLint baseline is unchanged unless its
regeneration was separately requested, the applicable checks pass, and the
handoff names every unavailable check.
