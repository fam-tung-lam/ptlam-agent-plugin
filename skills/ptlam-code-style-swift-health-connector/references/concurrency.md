# Isolation and Thread Safety in This Package

Which type gets which isolation tool here, why the project chose it, and the one
threading rule whose violation crashes the app. This file owns the isolation
choices this package made, not general Swift concurrency mechanics.

## Dispatch every Pigeon completion to the main thread

This is the rule to get right. A Pigeon completion handler invoked from a `Task`
or any other background context must go through the plugin's private helper:

```swift
Task {
    let result = try await client.readRecords(request: request)
    complete(completion, with: .success(result))
}
```

`complete(_:with:)` is one `DispatchQueue.main.async` around the completion
call. Calling `completion(...)` directly from a background context reaches
`FlutterStandardWriter.writeValue()` on that thread. `FlutterBinaryMessenger` is
not thread-safe: the writer mutates an `NSMutableData` while the Flutter engine
may be touching it from the main thread, and the engine expects channel replies
on the thread it runs on. The result is an `EXC_BAD_ACCESS` crash in the host
app, usually far from the code that caused it and hard to reproduce.

The plugin's private `process(operation:context:completion:action:)` already
wraps a `Task`, logs the lifecycle, and routes success, `HealthConnectorError`,
and unexpected errors through `complete(_:with:)`. Route new asynchronous Pigeon
methods through it rather than writing a bare `Task`.

A Pigeon method that never awaits, such as `getHealthPlatformStatus`, may call
its completion directly because it is still on the calling platform thread. The
moment you introduce an `await`, it must use `complete(_:with:)`.

## Pick the isolation the project already uses

| Type                             | Isolation                                                            | Why                                                                     |
| -------------------------------- | -------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| `HealthConnectorClient`          | `actor`                                                              | Compiler-enforced serial access to HealthKit, callable from any context |
| `HealthRecordHandlerRegistry`    | `final class`, `@unchecked Sendable`, `NSLock`                       | Its handler dictionary is mutated during init and read afterwards       |
| `HealthConnectorLogger`          | `final class` with static `NSLock` and `nonisolated(unsafe)` storage | A global enabled flag toggled from Dart at any time                     |
| `HealthConnectorHkIosPlugin`     | `NSLock` around lazy client creation                                 | Two concurrent `initialize` calls must not build two clients            |
| Handlers                         | `final class`, `@unchecked Sendable`                                 | Only immutable state plus a thread-safe `HKHealthStore`                 |
| `HealthConnectorDataSyncService` | `struct`, `@unchecked Sendable`                                      | Holds only the thread-safe `HKHealthStore`                              |
| `HealthConnectorError`           | `enum`, `@unchecked Sendable`                                        | Carries `[String: Any]?` context that the compiler cannot check         |

## Use NSLock, not Mutex

The registry and the logger both carry the same recorded reason for choosing
`NSLock`: `Mutex` requires iOS 18, and this package's floor is iOS 15. Do not
"modernize" either one to `Mutex` or to `@available`-gated storage without
raising the floor in `Package.swift` and the podspec together.

Where a lock guards state, the type is `@unchecked Sendable` and the doc comment
says so. Keep that comment when you touch the type; it is the only record that
the safety claim is manual.

## Earn every `@unchecked Sendable`

Two claims are honest in this package, and only two:

- The type stores nothing mutable, and any reference it holds is itself
  thread-safe. Handlers and the two services qualify.
- Every access to mutable state goes through a lock the type owns. The registry
  and the logger qualify.

A type that would need a third justification is a design signal, not a
suppression opportunity. Make it an actor, or push the state into
`HealthConnectorClient`, which already is one.

## Keep handlers stateless

A handler is created once in `registerAllHandlers()` and shared for the life of
the client across every concurrent request. Adding a mutable stored property to
a handler introduces a data race that `@unchecked Sendable` explicitly tells the
compiler not to catch. Pass per-request values as parameters instead.
