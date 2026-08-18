---
name: ptlam-code-style-kotlin-health-connector
description:
  Write, review, and fix Kotlin code in the Health Connector plugin's Android
  Health Connect package against its plugin entry point, client facade, handler
  registry, service, mapper, and exception conventions, its detekt and ktlint
  configuration, and its JUnit 5, MockK, Kotest, and Robolectric tests. Use when
  adding a health record handler, changing native Android code under
  health_connector_hc_android, or fixing a melos analyze:kotlin, ktlintCheck, or
  test:kotlin failure. Apply ptlam-code-style-kotlin first for the Kotlin
  mechanics. Do not use for another repository or for this plugin's Dart or
  Swift code.
---

# PTLam Health Connector Kotlin Code Style

Conventions for the Kotlin code in the Health Connector plugin's Android Health
Connect package: module layout, the layering from the Flutter entry point down
to the Health Connect SDK, the record handler pattern, services, mappers, the
Pigeon boundary, failure translation, logging, concurrency, lint configuration,
and unit tests.

This skill owns what is true of this repository. The Kotlin skill loaded above
owns the language, coroutine, Gradle, ktlint, detekt, KDoc, and JUnit mechanics
underneath it. The Dart client and the iOS HealthKit package are out of scope:
send those to `ptlam-code-style-dart-health-connector` and
`ptlam-code-style-swift-health-connector`.

## Required skills

### `ptlam-code-style-kotlin`

**Reason:** Provides the Kotlin language, coroutine, Gradle, lint, KDoc, and JUnit mechanics this repository's conventions build on.

**Instructions:** Read and apply ptlam-code-style-kotlin first; it loads
ptlam-code-style as its own foundation.
Let Kotlin own the language, null safety, coroutine, Gradle, ktlint,
detekt, KDoc, and JUnit mechanics.
Use this skill only for Health Connector Android package structure,
handler and service architecture, Pigeon boundary, Health Connect SDK,
and test-fake conventions.
This specialization may be stricter than Kotlin, never looser.

Read [ptlam-code-style-kotlin](skills/ptlam-code-style-kotlin/SKILL.md).

## Module facts

| Fact           | Value                                                                  |
| -------------- | ---------------------------------------------------------------------- |
| Module root    | `packages/health_connector_hc_android/android/`                        |
| Kotlin package | `com.phamtunglam.health_connector_hc_android`                          |
| Main sources   | `android/src/main/kotlin/com/phamtunglam/health_connector_hc_android/` |
| Unit tests     | `android/src/test/kotlin/com/phamtunglam/health_connector_hc_android/` |
| Android floor  | `minSdk = 26`, `compileSdk = 36`, `compileSdkExtension = 19`           |
| JVM floor      | Java 11 source and target, Kotlin `jvmTarget` 11; CI builds on JDK 17  |
| Toolchain      | Kotlin 2.1.0, AGP 8.9.1, `connect-client` 1.2.0-alpha03                |

`android/build.gradle` adds `src/main/kotlin` and `src/test/kotlin` to the
source sets by hand and sets `namespace` and `group` to the Kotlin package. Put
every new file under those two directories and under that package.

## Run the checks

Run each melos script from the repository root.

| Purpose                    | Melos script                    | Gradle task it runs                       |
| -------------------------- | ------------------------------- | ----------------------------------------- |
| Format Kotlin              | `melos run format:kotlin`       | `ktlintFormat` in `android/`              |
| Check formatting only      | `melos run format:kotlin:check` | `ktlintCheck` in `android/`               |
| Static analysis            | `melos run analyze:kotlin`      | `detekt` in `android/`                    |
| Regenerate detekt baseline | `melos run baseline:kotlin`     | `detektBaseline` in `android/`            |
| Unit tests                 | `melos run test:kotlin`         | `testDebugUnitTest` in `example/android/` |
| Regenerate Pigeon code     | `melos run pigeon`              | none; runs `dart run pigeon`              |

Run the tests through the example app. `melos run test:kotlin` invokes
`./gradlew testDebugUnitTest` in
`packages/health_connector_hc_android/example/android`, never in `android/`. The
module's own `build.gradle` declares no Flutter dependency and its
`settings.gradle` names only the module, so the Flutter embedding that
`HealthConnectorHCAndroidPlugin` imports reaches the compile classpath only
through `dev.flutter.flutter-plugin-loader`, which the example app's
`settings.gradle.kts` applies. CI runs the same command from the same directory.

## Pick a reference

| Concern                                                            | Reference                                                 |
| ------------------------------------------------------------------ | --------------------------------------------------------- |
| Placing a file, tracing a call, or deciding what a layer may do    | [architecture.md](references/architecture.md)             |
| Adding, changing, or registering a health record handler           | [handlers.md](references/handlers.md)                     |
| Converting between a Pigeon DTO and a Health Connect record        | [mappers.md](references/mappers.md)                       |
| Translating a failure into an error code, or emitting a log record | [errors-and-logging.md](references/errors-and-logging.md) |
| Choosing a dispatcher, a scope, or a suspend boundary              | [concurrency.md](references/concurrency.md)               |
| Writing, placing, or fixing a unit test                            | [testing.md](references/testing.md)                       |
| Fixing a ktlint or detekt failure, or touching the baseline        | [analysis-config.md](references/analysis-config.md)       |
| Promising behavior that depends on the device or the host app      | [android-platform.md](references/android-platform.md)     |

## Apply it

1. Read `android/build.gradle`, `android/.editorconfig`, and
   `android/detekt.yml` before judging any configured limit. The repository's
   `CLAUDE.md` files describe this module but lag it; treat them as evidence to
   verify, not as the contract.
2. Trace the call you are changing from the Pigeon method on
   `HealthConnectorHCAndroidPlugin` through `HealthConnectorClient` to the
   handler or service that performs it. Name the layer that owns your change.
3. Make the change in that layer only, and keep every new declaration
   `internal`.
4. Translate failures once, at the boundary that already translates them, and
   log through `HealthConnectorLogger` at the same point.
5. Add or update the unit test beside the type you changed, under
   `src/test/kotlin/.../unit_tests/`.
6. Run `melos run format:kotlin`, then `melos run analyze:kotlin`, then
   `melos run test:kotlin`. Report the exact commands, their results, and every
   check you did not run.

## Finish

Finish when the change sits in one layer, every new declaration is `internal`
unless Flutter must reach it, no generated `*.g.kt` file was edited by hand, the
detekt baseline is unchanged unless you deliberately regenerated it, and the
formatter, analyzer, and unit tests all pass from the commands above.
