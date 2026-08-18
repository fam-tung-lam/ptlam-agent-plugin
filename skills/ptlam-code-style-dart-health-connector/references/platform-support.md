# Platform Support and Cross-Platform Promises

This reference owns the annotations that record where an API works and the
platform behavior differences that limit what Dart code may promise.

## Annotate what a symbol supports

Every annotation below is declared in
`health_connector_core/lib/src/annotations/` and reaches other packages through
`health_connector_core_internal.dart`.

| Annotation                                | Means                                                                           |
| ----------------------------------------- | ------------------------------------------------------------------------------- |
| `@supportedOnHealthConnect`               | Android Health Connect only                                                     |
| `@supportedOnHealthConnectSdkExtension21` | Health Connect with SDK Extension 21; ignored on read, throws on write below it |
| `@supportedOnAppleHealth`                 | iOS HealthKit only                                                              |
| `@supportedOnAppleHealthIOS16Plus`        | iOS HealthKit, iOS 16 or newer                                                  |
| `@supportedOnAppleHealthIOS17Plus`        | iOS HealthKit, iOS 17 or newer                                                  |
| `@supportedOnAppleHealthIOS18Plus`        | iOS HealthKit, iOS 18 or newer                                                  |
| `@readOnly`                               | The platform computes this value; it cannot be written or deleted               |

A data type supported everywhere carries no `@supportedOn…` annotation. A data
type with a version floor carries both the platform annotation and the version
one, as `HealthDataType.rowingDistance` does with `@supportedOnAppleHealth` and
`@supportedOnAppleHealthIOS18Plus`.

`@SupportedOn` accepts a `platform` and an optional `osVersion`; the named
constants above are the only forms in use. Add a new constant to
`supported_on.dart` rather than writing the raw annotation inline.

An annotation is documentation. The runtime promise comes from two places you
must also update:

1. `List<HealthPlatform> get supportedHealthPlatforms` on the data type. It
   drives `HealthDataType.healthConnectDataTypes`,
   `HealthDataType.appleHealthDataTypes`, and the permission check in
   `HealthConnectorImpl.requestPermissions`.
2. An explicit `throw UnsupportedOperationException(...)` on the path the
   unsupported platform would take.

`@readOnly` means the data type implements only the readable and aggregatable
interfaces — never `WriteableHealthDataType` or a `Deletable…` interface — so
the write path fails to compile rather than at runtime.

## What the two platforms do differently

| Behavior                    | Android Health Connect                  | iOS HealthKit                               |
| --------------------------- | --------------------------------------- | ------------------------------------------- |
| Updating a record           | Supported                               | Not supported; records are immutable        |
| Read permission status      | Accurate `granted` or `denied`          | Always `unknown`, by Apple's privacy design |
| Listing granted permissions | `getGrantedPermissions()` works         | Throws `UnsupportedOperationException`      |
| Revoking permissions        | Supported                               | Not supported                               |
| Platform feature status     | Queried from Health Connect per feature | Always `available`                          |
| Feature permission status   | Queried per feature                     | Always `granted`                            |

These differences decide what a doc comment may promise. Never write "returns
whether the permission was granted" for a read permission: on iOS the honest
answer is `PermissionStatus.unknown`, and callers must branch on it. Say what
each platform returns, and say it in the member's own doc comment rather than
only in the library comment.

`HealthConnector.create()` picks the client from `Platform.isIOS` and returns
`HealthConnectorImpl`. Facade code that needs a platform-only capability
switches on `HealthPlatform`, throws `UnsupportedOperationException` in the
unsupported branch, and downcasts to the concrete client in the supported one —
as `getGrantedPermissions()` does. Log the refusal at `error` before throwing.
