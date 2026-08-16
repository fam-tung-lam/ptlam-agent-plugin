# Localization

How user-visible text is declared, translated, and read.

Localization is a feature, not a utility. It lives at
`lib/features/localization/`, with the same `ui/`, `models/`, `bloc/`,
`usecases/`, `repositories/` shape as any other feature, and its translation
files under `i18n/`.

## Every user-visible string is a key

No literal user-visible text in a widget. Add the key to `i18n/en.i18n.json`,
add its translation to `i18n/ru.i18n.json`, and regenerate through the shared
`build_runner` command in [toolchain.md](toolchain.md).

Both locale files carry every key. A key present in one and missing from the
other is a build-time error, which is the point — it is far cheaper than
discovering it on a Russian device.

Name a key for what the text means, not what it says: `orders.emptyState.title`,
not `orders.noOrdersYet`. The wording changes; the meaning is why the key is
there.

Nest keys to match the feature and the screen, so an unused key is visible when
its screen is deleted.

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

`strings.g.dart` is generated. Do not read or edit it, and do not commit it —
see [toolchain.md](toolchain.md).

## Changing the locale

The locale is application state: `AppLocaleRepository` persists it through
`AppLocaleLocalStorage`, a BLoC in this feature owns it, and the app applies it
at the root. Do not call the locale setter from a screen directly — dispatch an
event, as with any other state change.
