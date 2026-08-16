# Networking and Storage

How the app talks to an API and to anything that persists.

## One client per API source

Each external API gets its own `Dio` instance and its own client class, with its
own base URL, timeouts, and interceptors. Two APIs never share a client, because
they never share an auth scheme or a retry policy for long.

An API client exposes one method per endpoint, takes and returns DTOs, and
contains no business rules. Everything cross-cutting — auth headers, token
refresh, retry, logging — belongs in an interceptor, so no endpoint method
repeats it.

Set connect, send, and receive timeouts explicitly on every client. The default
is "wait forever", which shows up as a spinner that never stops.

Accept a `CancelToken` on any request a screen can leave, and cancel it when the
BLoC closes.

Nothing above the repository imports `dio` or sees a `Response`, a status code,
or a `DioException`. [models.md](models.md) owns that conversion.

## One data source per concern

Every persisted concern gets its own named data source, not a shared "storage
service" with a bag of keys. `AppLocaleLocalStorage` owns the locale key and
nothing else; `AppThemeLocalStorage` owns the theme key.

A data source owns its key names, its encoding, and its defaults. Those key
strings appear in exactly one file, as private constants.

| Data | Store |
| --- | --- |
| Credentials, tokens, device keys | `flutter_secure_storage` |
| Locale, theme, onboarding flags, UI preferences | `shared_preferences` |
| Anything large, queried, or relational | Neither — it needs a real database |

`shared_preferences` is simple key/value, so use `SharedPreferencesAsync` and
keep the values small and non-critical. `flutter_secure_storage` holds small
opaque secrets; it is not a blob store.

## One repository per concern

A repository composes the data sources and clients for its concern and presents
one domain-shaped API. `AppLocaleRepository` reads and writes through
`AppLocaleLocalStorage` and the shared API client; `AppThemeRepository` does the
same for the theme. Every other concern follows that shape.

The repository owns the policy the layers above should not know:

- which source answers first, and what happens when the remote one fails;
- what a missing stored value falls back to; and
- when a local write is mirrored remotely.

A use case asks the repository for a concern. It never picks between a cache and
a network call itself.

## Failures and offline

A repository returns a domain failure rather than throwing — see
[models.md](models.md). Treat "offline" as an expected outcome with its own
failure variant, not an error to log and rethrow.

Never leave a caught storage or network exception silent. Either it becomes a
failure the caller handles, or it is logged with its cause — see
[logging.md](logging.md).
