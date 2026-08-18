# Tests in This Repository

This reference owns where a Dart test file goes in this monorepo, which test
package it imports, and the seams available for replacing a platform client.
The language-neutral foundation owns what a test must prove; the Dart skill
owns `package:test` runner mechanics.

## Test tree per package

| Package                       | Test root mirrors `lib/src/` at | Shared fixtures at       |
| ----------------------------- | ------------------------------- | ------------------------ |
| `health_connector_core`       | `test/src/`                     | `test/utils/`            |
| `health_connector`            | `test/unit_tests/src/`          | `test/unit_tests/utils/` |
| `health_connector_hc_android` | `test/unit_tests/src/`          | `test/unit_tests/utils/` |
| `health_connector_hk_ios`     | `test/unit_tests/src/`          | `test/unit_tests/utils/` |
| `health_connector_logger`     | `test/unit_tests/src/`          | `test/utils/`            |

`health_connector_core` is the exception: its tests sit directly under
`test/src/`, with no `unit_tests/` level. Follow the package you are in rather
than normalizing one to the other.

A test file is named `<subject>_test.dart` and sits at the path its subject
occupies under `lib/src/`. A mapper test for
`lib/src/mappers/health_record_mappers/steps_record_mapper.dart` goes to
`test/unit_tests/src/mappers/health_record_mappers/steps_record_mapper_test.dart`.

The fixture file is `fake_data.dart`, exposing a `FakeData` class of static
constants — `FakeData.fakeId`, `FakeData.fakeStartTime`, `FakeData.fakeEndTime`,
`FakeData.fakeDataOrigin`. Import it by relative path and add to it rather than
inventing per-file constants.

## Pick the test package by package type

| Package                                                                | Import                                   |
| ---------------------------------------------------------------------- | ---------------------------------------- |
| `health_connector_core`, `health_connector_logger`, `health_connector` | `package:test/test.dart`                 |
| `health_connector_hc_android`, `health_connector_hk_ios`               | `package:flutter_test/flutter_test.dart` |

The platform packages need the Flutter binding for platform-channel types, so
they use `flutter_test`; the pure-Dart packages and the facade use
`package:test`. `melos run test:dart` runs `flutter test` in every package with
a `test/` directory, which works for both.

Add `package:mocktail/mocktail.dart` when you need a mock, and
`package:parameterized_test/parameterized_test.dart` for a table of cases.
`parameterizedTest(description, cases, callback)` takes a `List<List<Object>>`
of rows; use it for enum and unit conversion coverage, where the alternative is
forty near-identical `test` calls.

## Inject a platform client

| Seam                                           | Replaces                                         |
| ---------------------------------------------- | ------------------------------------------------ |
| `HealthConnectorImpl(healthPlatformClient: …)` | The whole platform client behind the facade      |
| `HealthConnectorHCClient.platformClient = …`   | The Android Pigeon API inside the Android client |
| `HealthConnectorHKClient.platformClient = …`   | The iOS Pigeon API inside the iOS client         |

The two static setters are `@visibleForTesting` and `@internal`. They mutate
static state, so set them in `setUp` for every test that depends on them rather
than once in `setUpAll`.

With `mocktail`, declare the mock as `class MockX extends Mock implements X {}`
and register a `registerFallbackValue` in `setUpAll` for every non-primitive
argument type the mock will match — the facade and platform client tests each
register a long list, and a missing entry fails at `any()` rather than at the
assertion.

A platform client test that uses an `EventChannel` calls
`TestWidgetsFlutterBinding.ensureInitialized()` in `setUpAll`.

## What a change must prove

| Change                     | Must have a test that                                                      |
| -------------------------- | -------------------------------------------------------------------------- |
| A new record type          | Constructs it, rejects each bound, and round-trips `copyWith` and equality |
| A new mapper               | Asserts `toDto()` field by field and `toDomain()` field by field           |
| A new enum mapper          | Covers every value in both directions                                      |
| A facade method            | Covers the success path and each thrown `HealthConnectorException`         |
| A platform-only capability | Asserts `UnsupportedOperationException` on the unsupported platform        |

Mapper tests assert individual fields rather than comparing whole DTOs, because
a DTO has no value equality. Record tests may compare whole records, because
records do.

Before you hand off, run `melos run test:dart` and report its result. CI runs
`flutter test --coverage` per package on top of format and strict analysis.
