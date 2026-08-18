# Layers of the Android Native Module

Every Dart call enters one Kotlin path. Keep a change inside the layer that owns
it.

```text
Dart -> HealthConnectorHCAndroidPlugin -> HealthConnectorClient
     -> HealthConnectorPermissionService | HealthConnectorFeatureService
      | HealthConnectorManifestService  | HealthConnectorDataSyncService
      | HealthRecordHandlerRegistry -> a record handler -> HealthConnectClient
```

## Give each layer one job

| Layer                 | File or directory                         | Owns                                                                                         | Must not                                            |
| --------------------- | ----------------------------------------- | -------------------------------------------------------------------------------------------- | --------------------------------------------------- |
| Plugin entry point    | `HealthConnectorHCAndroidPlugin.kt`       | Flutter and activity lifecycle, Pigeon method bodies, the coroutine scope, callback delivery | Call the Health Connect SDK, or map a record        |
| Client facade         | `HealthConnectorClient.kt`                | Client creation, handler lookup, capability checks, batching, cross-service orchestration    | Touch Flutter types, or hold a `BinaryMessenger`    |
| Services              | `services/`                               | One Health Connect concern each, as listed below                                             | Know about handlers or about other services         |
| Registry              | `handlers/HealthRecordHandlerRegistry.kt` | Building every handler once and returning one by `HealthDataTypeDto`                         | Perform an operation itself                         |
| Handlers              | `handlers/`                               | One record type each, and the SDK calls for it                                               | Return a Flutter `Result`, or reach another handler |
| Mappers               | `mappers/`                                | Pure conversion between Pigeon DTOs and SDK types                                            | Call the SDK client, or log                         |
| Logger                | `logger/HealthConnectorLogger.kt`         | Sending structured log events to Dart                                                        | Decide control flow                                 |
| Generated Pigeon code | `pigeon/HealthConnectorHCAndroidApi.g.kt` | The wire contract                                                                            | Be edited by hand                                   |

`HealthConnectorClient` is the only type that constructs services and the
registry; it does so in its companion `getOrCreate(context, dispatchers)`. The
plugin holds one cached client behind a `Mutex` and creates it in `initialize`.

## What each service is responsible for

| Service                            | Responsibility                                                                                                                                            |
| ---------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `HealthConnectorPermissionService` | Requesting permissions through the activity result API, reading status, listing granted permissions, revoking all, and the exercise-route consent request |
| `HealthConnectorFeatureService`    | Reporting availability of a Health Connect platform feature from `HealthConnectFeatures`                                                                  |
| `HealthConnectorManifestService`   | Checking that requested permissions are declared in the host app's `AndroidManifest.xml`                                                                  |
| `HealthConnectorDataSyncService`   | Initial and incremental sync driven by Health Connect change tokens                                                                                       |

## Keep the surface internal

Declare every class, interface, object, function, and extension `internal`. Only
two declarations are public, and both must be: the plugin class, which Flutter
instantiates reflectively through its no-argument constructor, and the
`HealthConnectorException` hierarchy, which crosses that boundary.

Widen for tests with `@VisibleForTesting` rather than with `public`. The plugin
exposes an `@VisibleForTesting internal constructor` plus `setContext`,
`setActivity`, and `setClient`; `HealthConnectorClient` exposes an
`@VisibleForTesting internal constructor`. Add a seam the same way or not at
all.

## Treat the Pigeon output as read-only

`pigeon/HealthConnectorHCAndroidApi.g.kt` is generated from the Dart definition
at
`packages/health_connector_hc_android/pigeon/health_connector_hc_android_api.dart`.
Change the DTO or the API method there, run `melos run pigeon`, and implement
the regenerated method on the plugin class. Never hand-edit a `*.g.kt` file: the
next generation discards the edit, and both linters skip the file, so nothing
would catch a mistake in it. Changing the Dart definition also changes the Dart
client; that side belongs to `ptlam-code-style-dart-health-connector`.

Finish when the changed behavior lives in one layer, no layer imports its
caller, and every new declaration is `internal` or justified by Flutter reaching
it.
