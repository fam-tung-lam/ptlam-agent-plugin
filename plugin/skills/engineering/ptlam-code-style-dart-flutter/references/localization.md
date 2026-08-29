# Localization

How user-visible text is declared, translated, and read.

Use [`slang`](https://pub.dev/packages/slang),
[`slang_flutter`](https://pub.dev/packages/slang_flutter), and
[`slang_build_runner`](https://pub.dev/packages/slang_build_runner) with the
Flutter SDK's `flutter_localizations`.

Localization is a feature, not a utility. It lives at
`lib/features/localization/` with the same four layers as any feature, plus its
translation files under `i18n/`. Its locale BLoC lives in `presentation/bloc/`,
the repository port in `application/ports/`, the implementation in
`infrastructure/adapters/`, storage in `infrastructure/data_sources/`, and
widgets in `presentation/`.

## Every user-visible string is a key

No literal user-visible text in a widget. Add the key to the source-locale
catalog and every supported locale catalog under `i18n/`, then regenerate
through the shared `build_runner` command in
[SKILL.md](../SKILL.md#shared-toolchain). Every locale file carries every key; a
missing translation is a build-time error.

Name a key for what the text means, not what it says: `orders.emptyState.title`,
not `orders.noOrdersYet`. Nest keys to match the feature and the page, so an
unused key is visible when its page is deleted.

## Do not build sentences from parts

Pass a parameter into one key. Never join two translated fragments; word order
differs between languages and the result cannot be reviewed. Use Slang's plural
support for anything counted. Put date, time, number, and currency formatting
through the locale-aware formatter, not string interpolation.

## Read a translation in the presentation layer

A BLoC, use case, or adapter emits a key or a domain value; it never emits a
translated sentence, because it has no locale and no `BuildContext`. An error
shown to the user is a failure variant the widget maps to a key; see
[models.md](models.md).

`strings.g.dart` is generated. Do not edit it; follow the tracked
generated-output policy in [SKILL.md](../SKILL.md#shared-toolchain).

## Change the locale through state

The locale selection is presentation state: `AppLocaleRepository` persists it
through `AppLocaleLocalDataSource`, a BLoC in this feature owns it, and the app
applies it at the root. Dispatch an event; never call the setter from a page.
