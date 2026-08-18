# Dispatchers and Scope

Dispatchers arrive through `DispatcherProvider`, so one test double replaces
every one of them. Name `Dispatchers.IO` only as a constructor default, and name
`Dispatchers.Main.immediate` only where Android requires the main thread.

## Follow the dispatcher down

| Step                                | What happens                                                                   |
| ----------------------------------- | ------------------------------------------------------------------------------ |
| Plugin constructor                  | Takes `dispatchers: DispatcherProvider = StandardDispatcherProvider`           |
| Plugin scope                        | `CoroutineScope(SupervisorJob() + dispatchers.io + CoroutineExceptionHandler)` |
| Every Pigeon method                 | `scope.launch { process(...) { ... } }`, then answers through the callback     |
| `HealthConnectorClient.getOrCreate` | Passes the same provider to the services and the registry                      |
| Client operations                   | `withContext(dispatchers.io)`                                                  |
| `HealthRecordHandlerRegistry`       | Gives each handler `dispatchers.io` as its `dispatcher`                        |
| `HealthRecordHandler.process`       | `withContext(dispatcher)` around the SDK call                                  |

`StandardDispatcherProvider` is the production `object` implementing
`DispatcherProvider` with `Dispatchers.Main`, `Dispatchers.IO`, and
`Dispatchers.Default`. Add a new dispatcher use by threading the provider
through, never by naming `Dispatchers` at a call site.

## Keep the scope's contract

The plugin creates its scope in the constructor and cancels it in
`onDetachedFromEngine`. `SupervisorJob` keeps one failed call from cancelling
the others, and the attached `CoroutineExceptionHandler` logs anything that
escapes a `launch`. A Pigeon method never returns a value directly; it launches
into this scope and delivers the result through the Pigeon callback, so it must
not block.

Two things deliberately hop off the injected dispatcher onto
`Dispatchers.Main.immediate`: `HealthConnectorLogger`, because Pigeon requires
the main thread for native-to-Dart events, and the two activity-result launches
in `HealthConnectorPermissionService`. `paginateAndAggregate` in
`CustomAggregatableHealthRecordHandler` still hard-codes `Dispatchers.IO` inside
a block that already runs on the handler's dispatcher; that is a leftover, not
the pattern to copy.

## Keep the seam testable

Injecting a `TestDispatcher` through the provider is what makes plugin, client,
service, and handler behavior deterministic under `runTest`. A hard-coded
dispatcher removes that seam. `Dispatchers.Main.immediate` inside a handler is
acceptable only in a test, where the test extension has already replaced
`Dispatchers.Main`; see [testing.md](testing.md).

Finish when every new suspend path receives its dispatcher from
`DispatcherProvider`, cancellation still propagates, and the work runs inside
the plugin scope that `onDetachedFromEngine` cancels.
