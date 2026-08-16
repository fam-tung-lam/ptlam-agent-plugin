# Logging

The Flutter mechanics for emitting, routing, and sanitizing log records.

## AppLogger is the only entry point

`AppLogger` lives in `lib/packages/<project_name>_logger/` and wraps
[`logging`](https://pub.dev/packages/logging). Application code depends on
`AppLogger` and never imports `package:logging` directly, so the sink and the
format change in one file.

Never use `print` or `debugPrint` in application code. They ignore the level
policy, ship to release builds, and cannot be captured by a crash reporter.

Give each logger a name under the project root, derived from where it logs:

```dart
final _log = AppLogger.of('orders.repository');
```

One root name means an embedding application can raise or silence everything the
project emits with a single call.

## Configure once, in main

`Logger.root.level` and the record handler are set once during startup, before
`runApp`. Nothing else changes the level at runtime except a deliberate
developer setting.

Log verbosely in debug and sparingly in release. Choose that by build mode, not
by commenting lines out.

## Route framework errors into the same logger

Wire both handlers during startup so a widget error and an unhandled async error
land in the same place as everything else:

- `FlutterError.onError` for errors raised inside the framework.
- `PlatformDispatcher.instance.onError` for uncaught asynchronous errors.

Without them, a build failure prints to the console and is invisible in whatever
the release build reports to.

## Where to log

| Layer                                                                      | Logs                                                         |
| -------------------------------------------------------------------------- | ------------------------------------------------------------ |
| Boundary that converts an external cause to a domain failure               | The sanitized operation and cause, once, at debug or warning |
| Other API clients, data sources, and repositories on the same failure path | Nothing; attach context without emitting a duplicate record  |
| Use case, BLoC                                                             | Nothing routine; a state transition is not an event          |
| Widget                                                                     | Nothing                                                      |

Log a failure once, where it is converted into a domain failure.

## Never log a request body

Dio's logging interceptor prints headers and bodies by default. That includes
the `Authorization` header, tokens, and whatever the user typed.

Log the method, the path, the status, and the duration. Nothing else leaves the
client.
