# Failure Translation on the iOS Side

Every failure that reaches Dart is a `HealthConnectorErrorDto`. This file owns
which layer performs which step of that translation and how a HealthKit error
maps onto the project's own error type.

## Throw one error type, convert at one layer

| Layer        | Wrapper                                                    | Responsibility                                                                                       |
| ------------ | ---------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| Handler      | `HealthRecordHandler.process(operation:context:block:)`    | Logs start and finish, maps `HKError` through `create(from:)`, wraps anything else as `unknownError` |
| Client       | `HealthConnectorClient.process(operation:context:action:)` | Re-throws a `HealthConnectorError` untouched, maps `HKError`, wraps the rest                         |
| Plugin entry | `HealthConnectorHkIosPlugin.process(...)`                  | Calls `toErrorDto()` and completes on the main thread                                                |

Only the plugin layer produces a DTO. A handler, a service, a mapper, or the
client throws `HealthConnectorError` and nothing else. Finding `toErrorDto()`
below the entry point means the error was flattened too early, and the layers
above it lost the ability to react to the case.

Wrap new handler work in `process` rather than writing your own do/catch. It is
what keeps logging and error mapping identical across roughly seventy handlers.

## The error cases and their wire codes

`HealthConnectorError` is an enum conforming to `LocalizedError`,
`CustomDebugStringConvertible`, and `@unchecked Sendable`. Each case carries a
`message`, an optional `cause`, and — for all but the two service-availability
cases — an optional `context` dictionary.

| Case                                | Wire code                              |
| ----------------------------------- | -------------------------------------- |
| `permissionNotGranted`              | `PERMISSION_NOT_GRANTED`               |
| `permissionNotDeclared`             | `PERMISSION_NOT_DECLARED`              |
| `invalidArgument`                   | `INVALID_ARGUMENT`                     |
| `healthServiceUnavailable`          | `HEALTH_SERVICE_UNAVAILABLE`           |
| `healthServiceRestricted`           | `HEALTH_SERVICE_RESTRICTED`            |
| `healthServiceDatabaseInaccessible` | `HEALTH_SERVICE_DATABASE_INACCESSIBLE` |
| `unsupportedOperation`              | `UNSUPPORTED_OPERATION`                |
| `unknownError`                      | `UNKNOWN_ERROR`                        |

These codes are a cross-language contract. Adding or renaming one is a change to
the Dart side as well; hand that half to
`ptlam-code-style-dart-health-connector`.

## How a HealthKit error becomes a project error

`HealthConnectorError.create(from:)` lives in
`mappers/HealthConnectorErrorMapper.swift`. It captures the `NSError` domain,
code, and failure reason into `context`, then maps `HKError.code`:

| `HKError.Code`                     | Result                                                                      |
| ---------------------------------- | --------------------------------------------------------------------------- |
| `.errorAuthorizationDenied`        | `.permissionNotGranted`                                                     |
| `.errorAuthorizationNotDetermined` | `.permissionNotGranted`                                                     |
| `.errorUserCanceled`               | `.permissionNotGranted`, message "User cancelled authorization request"     |
| `.errorInvalidArgument`            | `.invalidArgument`                                                          |
| `.errorHealthDataUnavailable`      | `.healthServiceUnavailable`                                                 |
| `.errorDatabaseInaccessible`       | `.healthServiceDatabaseInaccessible`                                        |
| `.errorHealthDataRestricted`       | `.healthServiceRestricted`                                                  |
| `.errorNoData`                     | `.unknownError`, message "No health data available for the requested query" |
| `@unknown default`                 | `.unknownError` carrying the original as cause                              |

Anything that is not an `HKError` becomes `.unknownError` with the original
error preserved as `cause`. Add a new `HKError.Code` case here, never in a
handler.

## Know what `toErrorDto()` ships

`toErrorDto()` builds `HealthConnectorErrorDto(code:message:details:)` and fills
`details` with the stringified `context`, the cause's description, the `NSError`
domain, code, and every `userInfo` entry, any `failureReason` and
`recoverySuggestion`, the `debugDescription`, and the first ten frames of
`Thread.callStackSymbols`.

Two consequences worth holding onto. Everything in a `context` dictionary
crosses the channel into a Dart-visible payload, so it is bound by the same
restriction [logging.md](logging.md) sets on log records. And
`Thread.callStackSymbols` is captured on every converted error, so do not use
these errors for expected, high-frequency control flow.
