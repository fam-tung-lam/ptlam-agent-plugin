# What Actually Tests the iOS Boundary

Read this before you claim a Swift change is covered, and before you follow any
document that tells you to run a Swift test command.

## No automated test executes this package's Swift today

| Claim                                         | Verified state                                                                                                                                                          |
| --------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `swift test` in the package's `ios` directory | `Package.swift` declares one library target and no test target, and there is no `Tests/` directory. The command has nothing to run.                                     |
| `example/ios/RunnerTests/RunnerTests.swift`   | The unmodified Flutter plugin template. It drives a `FlutterMethodCall` through a `handle` method the plugin does not implement, and no melos script or CI job runs it. |
| Continuous integration                        | The reusable Swift workflow runs SwiftLint only. Its SwiftFormat step is commented out and no test step exists.                                                         |

`packages/health_connector_hk_ios/ios/CLAUDE.md` documents `swift test` and
`swift test --filter TestName`. Neither works against the package as it stands.
Do not report a Swift change as tested on the strength of that document.

## Where the boundary's behavior is proven

Dart unit tests under `packages/health_connector_hk_ios/test/unit_tests/`, run
by `melos run test:dart`, cover the Dart client and the Dart mappers with the
Pigeon API replaced by a `mocktail` double. They prove that the Dart side sends
and interprets the DTOs correctly. They execute no Swift at all.

The consequence is worth stating plainly. A defect that lives only in Swift
reaches a device before anything catches it: a wrong HealthKit unit, a missing
registry entry, a completion handler not dispatched to the main thread. Review
and manual verification on a real device are the only controls in place.

## What adding native Swift tests would take

1. Decide which code is even reachable from SwiftPM.
   `HealthConnectorHkIosPlugin` and `HealthConnectorLogger` both import the
   `Flutter` module, and the manifest declares no dependencies, so SwiftPM
   cannot build them. Mappers, `HealthConnectorError`, `utils/`, and the
   handlers do not.
2. For that Flutter-free subset, add a `.testTarget` to `Package.swift`
   depending on the `health_connector_hk_ios` target, and put its sources under
   `Tests/`. `swift test` then runs.
3. For anything touching Flutter or the Pigeon boundary, use the Xcode route
   instead: repair the `RunnerTests` target in
   `packages/health_connector_hk_ios/example/ios/Runner.xcodeproj` so it
   exercises the Pigeon API rather than a method channel, and run it through
   `xcodebuild test` with a simulator destination on a macOS runner.
4. Give handlers a seam before testing them. Each one stores a concrete
   `HKHealthStore`, and `HealthConnectorClient.getOrCreate()` calls the static
   `HKHealthStore.isHealthDataAvailable()`. Neither can be replaced by a double
   without introducing a protocol first, and the simulator has no real HealthKit
   data to fall back on.
5. Add a melos script and a CI step. Neither exists, so a suite nobody runs is
   the default outcome.

Do not start step 2 or 3 as a side effect of a feature change. It is a package
change with its own review, and the honest interim report is that the Swift side
is verified by lint and by hand.
