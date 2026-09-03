# Localization

Who owns translations and the active locale across packages. The loaded skill
owns key naming, plurals, formatting, and reading a translation in the
presentation layer.

| Owner              | Holds                                                                                 |
| ------------------ | ------------------------------------------------------------------------------------- |
| Feature            | `lib/src/i18n/` with one catalog per supported locale, and its generated translations |
| App                | The supported locale list, the active locale, and the delegates in `lib/app/app.dart` |
| A settings feature | The page that lets the operator pick a locale, and the storage that persists it       |

Every feature that shows text carries its own catalog and generates its own
translations, so a feature can be deleted with its strings. Add a key to the
owning feature's catalogs and regenerate inside that feature.

The app applies the active locale to every feature's translation root at startup
and on change. Verify the installed Slang major's multi-package procedure before
wiring a second feature; the API for sharing one locale across packages has
changed between majors.

The locale is application state. The settings feature persists it through a data
source, a BLoC in that feature owns it, and the app observes that BLoC and
applies the locale at the root.
