# Storage

How Flutter persists one concern through an owned data source.

## One data source per concern

Give every persisted concern its own named data source instead of a shared
storage service with a bag of keys. `AppLocaleLocalStorage` owns the locale key;
`AppThemeLocalStorage` owns the theme key.

A data source owns its key names, encoding, and defaults. Keep each key string
in exactly one file as a private constant.

| Data                                            | Store                                                                       |
| ----------------------------------------------- | --------------------------------------------------------------------------- |
| Credentials, tokens, device keys                | [`flutter_secure_storage`](https://pub.dev/packages/flutter_secure_storage) |
| Locale, theme, onboarding flags, UI preferences | [`shared_preferences`](https://pub.dev/packages/shared_preferences)         |
| Anything large, queried, or relational          | A database selected for that workflow                                       |

Use `SharedPreferencesAsync` for small, non-critical key/value data.
`flutter_secure_storage` holds small opaque secrets; it is not a blob store.

[architecture.md](architecture.md#one-repository-per-concern) owns how a
repository composes storage with other sources and converts boundary failures.
