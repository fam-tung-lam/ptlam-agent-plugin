# Native Logging

`HealthConnectorLogger` is the only logging surface in this package. It writes
through `OSLog` and forwards every record to Dart over the Pigeon callback API
`HealthConnectorNativeLogApi`. This file owns its call shape and what belongs in
each argument.

## One call shape, five arguments

```swift
HealthConnectorLogger.error(
    tag: Self.tag,
    operation: "readRecord",
    message: "Failed to readRecord",
    context: ["data_type": request.dataType],
    exception: error
)
```

`debug`, `info`, `warning`, and `error` all take the same signature:
`(tag:operation:message:context:exception:)`, with the last three optional.

| Argument    | Put here                                                                                      |
| ----------- | --------------------------------------------------------------------------------------------- |
| `tag`       | `Self.tag` from `Taggable`, which resolves to the type's own name                             |
| `operation` | The name of the method being performed, stable across its start, success, and failure records |
| `message`   | A sentence describing what is happening, not the error's text                                 |
| `context`   | Small, non-identifying facts: counts, data type names, spans, flags                           |
| `exception` | The `Error` itself, on `error` records; never interpolate it into `message`                   |

Never build the tag by hand. Types that are not `NSObject` subclasses conform to
`Taggable` explicitly, as `HealthConnectorClient`,
`HealthConnectorPermissionService`, and `HealthConnectorPlistValidator` do. The
`HealthRecordHandler.process` extension is the one exception: it cannot use
`Self.tag` through a protocol extension, so it computes
`String(describing: type(of: self))` for the concrete handler.

## Match the level to the moment

| Level     | Use for                                                                    |
| --------- | -------------------------------------------------------------------------- |
| `debug`   | The start of an operation and its inputs                                   |
| `info`    | Successful completion, or a state change such as the client becoming ready |
| `warning` | A degraded but recoverable outcome                                         |
| `error`   | A failure being thrown, always with `exception:` supplied                  |

Log the start at `debug` and the success at `info` with the same `operation`
string. That pairing is what makes a native log readable next to the Dart log.

## Naming that matches the layer

`operation` is written in lowerCamelCase at the plugin and client layers, and in
snake_case in the services and the handler protocol. Both styles are in the
codebase; match the file you are editing rather than converting neighbours.

Context keys are predominantly snake_case, such as `data_type`,
`permission_count`, and `query_span_days`. Some older camelCase keys remain. Use
snake_case for every new key.

## Keep health data out of every record

A log record leaves the process twice: into the device's unified log and across
the Pigeon channel into the Dart-side logger. Never pass a measured value, a
record identifier, a date belonging to a user's data, or a source device name.
Log the count, the data type, and the span instead. The same restriction applies
to the `context` dictionary on a `HealthConnectorError`, because
[errors.md](errors.md) shows it being copied into the error payload sent to
Dart.

## Logging can be off

`HealthConnectorLogger.isEnabled` is set from `HealthConnectorConfigDto` during
`initialize`, and every method returns immediately when it is false. Never make
a log call carry a side effect, and never read a log to decide what the code
does next.
