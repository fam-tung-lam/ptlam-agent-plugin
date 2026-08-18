# Public and Internal API Surface

This reference owns which library file a symbol reaches the outside world
through, and the annotations that mark a symbol internal, experimental, or
version-stamped.

## Two entry points, and only for two packages

`health_connector` and `health_connector_core` each expose two libraries.
`health_connector_logger`, `health_connector_hc_android`, and
`health_connector_hk_ios` expose one library apiece.

| Library file                              | Audience                             | Export style                                                                     |
| ----------------------------------------- | ------------------------------------ | -------------------------------------------------------------------------------- |
| `lib/health_connector.dart`               | App developers                       | Re-exports the core and logger public libraries plus `src/health_connector.dart` |
| `lib/health_connector_internal.dart`      | The two platform packages            | Re-exports `health_connector_core_internal.dart` and the whole logger library    |
| `lib/health_connector_core.dart`          | App developers                       | One `export … show` per source file                                              |
| `lib/health_connector_core_internal.dart` | The facade and the platform packages | One bare `export` per source file, with `hide` for abstract intermediates        |
| `lib/health_connector_logger.dart`        | Everyone                             | Bare exports of every `src/` file                                                |
| `lib/health_connector_hc_android.dart`    | The facade only                      | `export 'src/health_connector_hc_client.dart';`                                  |
| `lib/health_connector_hk_ios.dart`        | The facade only                      | `export 'src/health_connector_hk_client.dart';`                                  |

`health_connector_core.dart` names every public symbol in a `show` clause. A new
public type is invisible until you add it there. Abstract intermediates that
exist only to share fields — `DietaryMacronutrientRecord`,
`DietaryMineralRecord`, `DietaryVitaminRecord`, `SpeedActivityRecord`,
`DistanceActivityRecord`, and their data-type counterparts — stay out through a
`hide` clause on the whole-file export.

The facade's public library re-exports the logger with
`hide HealthConnectorLogger`, so app developers configure logging through
`HealthConnectorConfig` rather than the logger's static API. The internal
library re-exports the logger whole.

## Mark internal APIs

| Annotation           | Declared in             | Use for                                                                    |
| -------------------- | ----------------------- | -------------------------------------------------------------------------- |
| `@internalUse`       | `health_connector_core` | A symbol other packages in this monorepo call, but app developers must not |
| `@internal`          | `package:meta`          | A symbol nothing outside its own package may call                          |
| `@visibleForTesting` | `package:meta`          | A seam that exists only so a test can replace a collaborator               |
| `@experimentalApi`   | `health_connector_core` | A public API that may break outside semantic versioning                    |

`@internalUse` is a documentation and intent marker exported from the internal
library; `@internal` is the analyzer-enforced one. A cross-package symbol
usually carries both, as `HealthConnectorHCClient` does. Add `@nodoc` to a
dartdoc comment you want kept out of the generated site.

## Stamp the version

Every public type and member carries a `@sinceVx_y_z` constant naming the SDK
version that introduced it — `@sinceV1_0_0` through `@sinceV3_9_0` exist today.
Adding an API in a new minor version means adding the matching constant to
`lib/src/annotations/since.dart` first, then applying it. Never change an
existing symbol's `@sinceVx_y_z`: it records history, not the current release.
