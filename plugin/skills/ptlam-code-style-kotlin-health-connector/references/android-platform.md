# Platform Constraints on What the Native Code May Promise

Four device and host-app facts limit what this module can implement. Check them
before promising a capability across the Pigeon boundary.

## The host app declares the permissions

The plugin's own `src/main/AndroidManifest.xml` declares no health permissions.
It contains only a `<queries>` entry for `com.google.android.apps.healthdata`,
which is what lets the module see whether Health Connect is installed. Every
`android.permission.health.*` permission must be declared by the app that
depends on the plugin, as the example app does.

`HealthConnectorManifestService.checkPermissionsDeclared` reads the host
manifest and raises `HealthConnectorException.Configuration` with code
`PERMISSION_NOT_DECLARED` for anything missing. A permission the module can map
to a string is still unusable until the host app declares it, so a new record
type is not done when its permission mapping compiles.

## The host activity must be a ComponentActivity

`onAttachedToActivity` runs `check(activityInstance is ComponentActivity)` and
throws `IllegalStateException` otherwise, because permission requests use
`ComponentActivity.activityResultRegistry`. The example app's `MainActivity`
therefore extends `FlutterFragmentActivity`, not the default `FlutterActivity`.

Any new API that needs the activity must handle a null `activity`, which is the
normal state while the app is backgrounded or during a configuration change.
Report that as `HealthConnectorException.Configuration`, as
`launchHealthConnectPageInGooglePlay` does.

## Health Connect may be absent or out of date

`minSdk` is 26 because the Health Connect SDK requires it, but the SDK's
presence is still a runtime question.
`HealthConnectorClient.getHealthPlatformStatus(context)` wraps
`HealthConnectClient.getSdkStatus` and is the check a caller makes first;
`launchHealthConnectPageInGooglePlay` sends the user to the store page, falling
back to the browser when the Play Store app is missing. `getOrCreate` turns an
`UnsupportedOperationException` or `IllegalStateException` from the SDK into
`HealthConnectorException.HealthServiceUnavailable`.

## Some fields need SDK Extension 21

`SdkExtensionUtils.isAtLeastSdkExtension21()` reports whether the device's
Health Connect module bundles SDK Extension 21. `HealthConnectorClient`
evaluates it once at construction and stores it in
`supportsHealthConnectSdkExtension21`. Fields gated by that version, such as
`ExerciseSegment.weight`, are dropped silently on write and read back as `null`
on older devices, so gate the feature on that flag instead of writing and
hoping.

Finish when every new capability names the permission its host app must declare,
degrades predictably when Health Connect or an activity is missing, and gates
any extension-dependent field on the stored flag.
