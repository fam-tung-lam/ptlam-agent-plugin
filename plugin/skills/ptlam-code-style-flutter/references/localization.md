# Localization

How user-visible text is declared, translated, and read.

Use [`slang`](https://pub.dev/packages/slang),
[`slang_flutter`](https://pub.dev/packages/slang_flutter), and
[`slang_build_runner`](https://pub.dev/packages/slang_build_runner) with the
Flutter SDK's `flutter_localizations` package.

Localization is a feature, not a utility. It lives at
`lib/features/localization/`, with the same `widgets/`, `entities/`,
`failures/`, `dtos/`, `bloc/`, `usecases/`, `repositories/` shape as any other
feature, and its translation files under `i18n/`.

## Every user-visible string is a key

No literal user-visible text in a widget. Add the key to the source-locale
catalog and every supported locale catalog under `i18n/`, then regenerate
through the shared `build_runner` command in
[SKILL.md](../SKILL.md#shared-toolchain).

Every locale file carries every key. A missing translation is a build-time
error, which is cheaper than discovering it on a user's device.

Name a key for what the text means, not what it says: `orders.emptyState.title`,
not `orders.noOrdersYet`. The wording changes; the meaning is why the key is
there.

Nest keys to match the feature and the page, so an unused key is visible when
its page is deleted.

## Do not build sentences from parts

Pass a parameter into one key. Never concatenate two translated fragments — word
order differs between languages and the result is unreviewable.

Use Slang's plural support for anything counted. `'$n items'` is wrong in
Russian at three different counts, and a plural key is the only way to get it
right.

Put date, time, number, and currency formatting through the locale-aware
formatter, not through string interpolation.

## Reading a translation

Read translations in the widget layer. A BLoC, use case, or repository emits a
key or a domain value; it never emits a translated sentence, because it has no
locale and no `BuildContext`.

An error shown to the user is a failure variant that the widget maps to a key —
see [models.md](models.md).

`strings.g.dart` is generated. Do not edit it; follow the repository's tracked
generated-output policy in [SKILL.md](../SKILL.md#shared-toolchain).

## Changing the locale

The locale is application state: `AppLocaleRepository` persists it through
`AppLocaleLocalStorage`, a BLoC in this feature owns it, and the app applies it
at the root. Do not call the locale setter from a page directly — dispatch an
event, as with any other state change.
