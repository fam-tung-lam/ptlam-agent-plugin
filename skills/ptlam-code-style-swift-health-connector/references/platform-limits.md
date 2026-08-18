# iOS Constraints on What the Native Code May Promise

HealthKit and iOS remove options that the plugin's cross-platform API otherwise
implies. These limits are not bugs to work around; they change what the Swift
side is allowed to return.

## The host app must declare two usage keys

| Key                              | Covers       |
| -------------------------------- | ------------ |
| `NSHealthShareUsageDescription`  | Read access  |
| `NSHealthUpdateUsageDescription` | Write access |

`HealthConnectorPlistValidator.validateUsageDescriptions(bundle:)` runs inside
`HealthConnectorClient.getOrCreate()` and treats a missing key and a
whitespace-only value the same way: it throws
`HealthConnectorError.permissionNotDeclared` naming the missing keys. Requesting
a HealthKit permission without a usage description terminates the host app, so
this check fails early on purpose. Keep it ahead of any store access you add.

The package also ships `PrivacyInfo.xcprivacy`, declaring health and fitness
data collected for app functionality with no tracking and no linkage.
`Package.swift` processes it as a resource and the podspec publishes it in the
`health_connector_hk_ios_privacy` bundle. Update the manifest when the data the
plugin touches changes, and keep both declarations in step.

## Read permission status is unknowable

HealthKit deliberately hides read authorization so an app cannot infer that a
user has no data of a given type. `HealthConnectorPermissionService` therefore
inspects `authorizationStatus(for:)` only when `accessType == .write`, and
returns `.unknown` for every read permission and for exercise-route reads.

Do not add a heuristic that guesses read authorization from an empty query
result. An empty result and a denied permission are indistinguishable here, and
guessing produces a wrong answer that Dart callers will trust.

When several types back one permission, the service aggregates optimistically:
any `.sharingAuthorized` yields `.granted`, all `.sharingDenied` yields
`.denied`, and anything mixed or undetermined stays `.unknown`.

## HealthKit samples are immutable

There is no update operation on this side, and there must not be one. A change
is a delete plus a write, decided by the caller. The plugin's update API is
Android-only; the Dart facade owns that distinction.

## Availability above iOS 15 is gated at the mapper

The package floor is iOS 15.0, and several HealthKit identifiers arrived later.
Gate them where the type is resolved, not at the call site, and fail with a
usable error rather than a silent fallback:

```swift
case .sleepingWristTemperature:
    if #available(iOS 16.0, *) {
        try HKQuantityType.make(from: .appleSleepingWristTemperature)
    } else {
        throw HealthConnectorError.unsupportedOperation(
            message: "Sleeping wrist temperature is only supported on iOS 16.0 and later",
            context: ["dataType": "sleepingWristTemperature", "minimumIOSVersion": "16.0"]
        )
    }
```

Give every switch over a HealthKit enum an `@unknown default` case, because
Apple adds cases in point releases and the compiler will not warn you at the
version you built against.

## Device availability is checked once

`HKHealthStore.isHealthDataAvailable()` gates client creation, and a false
result throws `healthServiceUnavailable`. `getHealthPlatformStatus` reports the
same fact as `.available` or `.notAvailable` without creating a client, which is
why it is a static method and completes synchronously.
