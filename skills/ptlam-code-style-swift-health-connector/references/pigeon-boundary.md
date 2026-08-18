# The Pigeon Boundary on the Swift Side

Pigeon owns the type-safe channel between Dart and Swift. This file covers what
is generated, how to regenerate it, and the post-processing step without which
the package does not compile.

## One generated file, never hand-edited

| Item                 | Value                                                                        |
| -------------------- | ---------------------------------------------------------------------------- |
| Contract             | `packages/health_connector_hk_ios/pigeon/health_connector_hk_ios_api.dart`   |
| Generated Swift      | `.../Sources/health_connector_hk_ios/pigeon/HealthConnectorHKIOSApi.g.swift` |
| Error class          | `HealthConnectorErrorDto`, set through `SwiftOptions(errorClassName:)`       |
| Excluded from lint   | `.swiftlint.yml` excludes `**/*.g.swift`                                     |
| Excluded from format | `.swiftformat` excludes `**/pigeon`                                          |

That single file holds every `*Dto` type, the `HealthConnectorHKIOSApi` protocol
that `HealthConnectorHkIosPlugin` implements, `HealthConnectorHKIOSApiSetup`,
and the reverse callback API `HealthConnectorNativeLogApi` that the logger uses.
It is checked into the repository and it is roughly ten thousand lines long.

Never edit it. Because it is excluded from both tools, neither SwiftLint nor
SwiftFormat will flag a hand-edit, and the next regeneration silently discards
it. Change the Dart contract instead and regenerate.

## Regenerate with melos, never with pigeon alone

Run `melos run pigeon` from the monorepo root. Running `dart run pigeon` by hand
for this package produces Swift that does not compile, because it skips the
post-processing step below.

The `pigeon` script runs four steps in order: Pigeon for the Android package,
Pigeon for the iOS package, the Python post-processor, and `melos format`. The
same script also runs from the `melos version` pre-commit hook, so a release
regenerates the file whether or not you did.

## What the post-processor fixes

`packages/health_connector_hk_ios/scripts/add_public_keyword_to_swift_code.py`
rewrites the generated file in place. Pigeon emits `HealthConnectorHKIOSApi` as
a public protocol but leaves the DTO types it references at internal visibility.
Swift rejects that: every type appearing in a public protocol's signature must
itself be public. Without the script the package fails to build.

The script adds `public` to five things:

| Pattern                                                                     | Reason                                     |
| --------------------------------------------------------------------------- | ------------------------------------------ |
| `enum <Name>Dto:` and `struct <Name>Dto:` at column zero                    | DTOs appear in public signatures           |
| `final class HealthConnectorErrorDto:`                                      | It is the channel's error type             |
| `protocol MeasurementUnitDto`, `HealthRecordDto`, `DeleteRecordsRequestDto` | Base protocols the DTOs conform to         |
| Indented `static func ==`                                                   | `Equatable` conformance on a public struct |
| Indented `func hash(into`                                                   | `Hashable` conformance on a public struct  |

The script matches on line prefixes, so a change in Pigeon's output shape can
make it silently do nothing. The symptom is a build error saying a public
protocol exposes an internal type. Fix the script's patterns; do not add
`public` to the generated file by hand, and do not add a `// swiftlint:disable`
in place of a fix.

## After a contract change

1. Edit the Dart contract, then run `melos run pigeon` from the monorepo root.
   The generated Swift and Dart files both update.
2. Build the iOS example app or open the package in Xcode. A new protocol method
   surfaces as a conformance error on `HealthConnectorHkIosPlugin`, which is the
   signal telling you what to implement.
3. Implement the method at the entry point using its `process` wrapper, so the
   result reaches Dart on the main thread. See [concurrency.md](concurrency.md).
4. Commit the regenerated file together with the hand-written change. Leaving
   them in separate commits breaks every checkout in between.

The Dart half of the same contract belongs to
`ptlam-code-style-dart-health-connector`, and the Android half to
`ptlam-code-style-kotlin-health-connector`.
