# Failures and Logging

Failures are translated at three fixed boundaries and nowhere else. Each
boundary logs the failure it translates, so a failure is logged once.

| Boundary                                 | Where                                                 | Catches                                                    | Produces                                                          |
| ---------------------------------------- | ----------------------------------------------------- | ---------------------------------------------------------- | ----------------------------------------------------------------- |
| `HealthRecordHandler.process`            | `handlers/HealthRecordHandler.kt`                     | The four SDK exceptions below                              | A `HealthConnectorException`                                      |
| `HealthConnectorClient.process`          | `HealthConnectorClient.kt`, private inline, companion | Any remaining `Exception`                                  | `HealthConnectorException.Unknown`                                |
| `HealthConnectorHCAndroidPlugin.process` | plugin companion, private suspend                     | `HealthConnectorException`, then any remaining `Exception` | `Result.failure(exception.toDto())` passed to the Pigeon callback |

Both outer boundaries rethrow `CancellationException` before their generic
`catch`, so cancellation keeps propagating. Keep that ordering when you touch
them.

## Translate a source exception exactly once

`HealthRecordHandler.process` performs the whole SDK translation.

| Source exception           | Project exception                          | Error code               |
| -------------------------- | ------------------------------------------ | ------------------------ |
| `SecurityException`        | `HealthConnectorException.Authorization`   | `PERMISSION_NOT_GRANTED` |
| `IllegalArgumentException` | `HealthConnectorException.InvalidArgument` | `INVALID_ARGUMENT`       |
| `IllegalStateException`    | `HealthConnectorException.InvalidArgument` | `INVALID_ARGUMENT`       |
| `IOException`              | `HealthConnectorException.HealthService`   | `IO_ERROR`               |

Every branch passes the original as `cause` and writes a message naming the
operation and the `dataType`. Do not catch these four inside a handler
operation, a service, or a mapper: throw the plain exception and let `process`
convert it.

## Choose the exception variant

`HealthConnectorException` is a public sealed class over `Throwable`. Every
variant is a `data class` carrying `message`, an optional `cause`, and an
optional `context` map.

| Variant                    | Error code                      | Raise it for                                                                    |
| -------------------------- | ------------------------------- | ------------------------------------------------------------------------------- |
| `Authorization`            | supplied by the caller          | Permission denied, undetermined, or blocked by guest mode                       |
| `Configuration`            | fixed `PERMISSION_NOT_DECLARED` | A permission missing from the host `AndroidManifest.xml`, or a missing activity |
| `HealthServiceUnavailable` | supplied by the caller          | Health Connect absent, restricted, or needing an update                         |
| `HealthService`            | supplied by the caller          | A transient service failure: I/O, remote, rate limit, sync in progress          |
| `InvalidArgument`          | fixed `INVALID_ARGUMENT`        | A bad time range, an unknown record id, malformed data                          |
| `UnsupportedOperation`     | fixed `UNSUPPORTED_OPERATION`   | No handler for the type, or the handler lacks the capability                    |
| `Unknown`                  | fixed `UNKNOWN_ERROR`           | Anything the layers above did not classify                                      |

`HealthConnectorException.toDto()` in
`mappers/HealthConnectorExceptionMapper.kt` is the only place that shapes the
payload Dart receives. Add debugging detail by putting it in `context`, not by
widening that mapper.

## Call the logger the same way everywhere

`HealthConnectorLogger` is an `internal object` with `debug`, `info`, `warning`,
and `error`. Every call passes `tag` and `message`; pass `operation` and
`context` whenever you have them, and `exception` on every failure.

| Argument    | Carries                                                                          |
| ----------- | -------------------------------------------------------------------------------- |
| `tag`       | The declaring type's name: the class's `tag` property, or its `TAG` constant     |
| `operation` | The operation in `snake_case`, such as `read_records`                            |
| `message`   | A sentence about what happened; values belong in `context`                       |
| `context`   | A `Map<String, Any?>` with `snake_case` keys, such as `data_type` or `page_size` |
| `exception` | The `Throwable`, on warnings and errors only                                     |

The plugin, the client, and the handlers already name operations in
`snake_case`; the four services still pass their camelCase method names. Follow
the `snake_case` form in new code.

Log `debug` before an operation, `info` after it succeeds, and `error` in the
branch that translates the failure. Logging stays off until Dart enables it
through `initialize`, so a log call never substitutes for returning a value.

Finish when each failure is translated at exactly one boundary, carries its
cause, and is logged once with the tag of the type that translated it.
