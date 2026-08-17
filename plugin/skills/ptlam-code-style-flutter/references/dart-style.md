# Dart Style

Naming, formatting, imports, immutability, and analyzer exceptions.

`analysis_options.yaml` and the installed
[`very_good_analysis`](https://pub.dev/packages/very_good_analysis) version are
the source of truth. This file says what they enforce and why; when the two
disagree, the config wins and this file is stale.

## Naming

| Kind                                   | Form                         | Example                     |
| -------------------------------------- | ---------------------------- | --------------------------- |
| File, directory, package               | `lowercase_with_underscores` | `place_order_use_case.dart` |
| Class, enum, extension, typedef, mixin | `UpperCamelCase`             | `OrdersRepository`          |
| Member, variable, parameter, constant  | `lowerCamelCase`             | `maxRetryCount`             |
| Library-private symbol                 | Leading underscore           | `_OrdersView`               |

Constants are `lowerCamelCase` in Dart, never `SCREAMING_CAPS`.

Name a class after what it is, and suffix it with its role when the role is part
of the contract: `OrdersBloc`, `OrdersRepository`, `PlaceOrderUseCase`,
`AppLocaleLocalStorage`. Do not suffix a model — `Order`, not `OrderModel`.

## Formatting

`dart format` owns whitespace. Never hand-format around it, and never argue with
its output in review.

```bash
fvm dart format --output=none --set-exit-if-changed .
```

- Use the page width configured for the repository. Let the installed formatter
  decide line breaks; add trailing commas where the language or active lint
  requires them, not to force a particular layout.
- Single quotes for strings, doubles only to avoid escaping.
- No `new`. No redundant `this.` outside a constructor initializer.

## Imports

Three groups, each alphabetized, separated by a blank line: `dart:`, then
`package:`, then relative. Exported symbols come last, after all imports.

Inside `lib/`, import through `package:<project_name>/…` rather than a relative
path that climbs out of its own directory. A relative import is fine between
siblings in the same directory.

Import a feature or an internal package through its barrel file. Reaching into
another feature's `bloc/` or another package's `src/` is a defect — see
[file-organization.md](file-organization.md).

## Prefer const, final, and immutability

- `const` every widget and value the analyzer will accept as one. It removes a
  rebuild and an allocation.
- `final` for every local and field that is not reassigned. Reserve `var` for
  the ones that genuinely change.
- Declare a type on a public API and on a field. Omit it on a local whose
  initializer already says it.
- Never `dynamic`. When a type is genuinely unknown, use `Object?` and narrow it
  where you read it.

## Common trips

| Analyzer complaint           | What it wants                                                         |
| ---------------------------- | --------------------------------------------------------------------- |
| `public_member_api_docs`     | A doc comment — see [documentation.md](documentation.md)              |
| `lines_longer_than_80_chars` | Refactor the expression or use the repository's configured page width |
| `require_trailing_commas`    | A trailing comma on the construct named by the active lint            |
| `prefer_const_constructors`  | `const` on a widget whose arguments are all constant                  |
| `sort_pub_dependencies`      | Alphabetical order in `pubspec.yaml`                                  |
| `avoid_dynamic_calls`        | A real type instead of `dynamic`                                      |

## Exceptions

Suppress a lint at the narrowest scope that works — one `// ignore:` line, not a
file-wide `// ignore_for_file:` and never a project-wide rule removal.

Every suppression carries the reason on the line above it. A suppression with no
reason gets deleted at the next review, and whoever added it is not there to
explain.

When the same suppression appears three times, the rule is wrong for this
project or the code is. Decide which, and fix that instead.
