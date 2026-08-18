# The Analyzer Contract

This reference owns where analysis rules live in this repository and the
project-specific rules a contributor trips over most. The Dart skill owns
analyzer strictness mechanics, `dart format`, and suppression discipline.

## One source of truth

`packages/health_connector_lint/lib/analysis_options.yaml` holds every rule.
Each of the other five packages has an `analysis_options.yaml` whose entire
content is:

```yaml
include: package:health_connector_lint/analysis_options.yaml
```

Change a rule in the lint package and nowhere else. Every package picks the
change up after `melos run get`. A package that needs a local exception is a
signal to reconsider the rule, not to add a second options file.

The lint package is a dev dependency of all five consumers and is versioned and
published like the rest, so a rule change ships as a `health_connector_lint`
version bump.

## What the configuration adds beyond the Dart defaults

The base is `package:lints/core.yaml`, plus:

| Setting                                                       | Effect                                                            |
| ------------------------------------------------------------- | ----------------------------------------------------------------- |
| `strict-casts`, `strict-inference`, `strict-raw-types`        | No implicit downcast, no inferred `dynamic`, no bare generic type |
| `dead_code`, `unused_local_variable`, `unused_import: error`  | These three fail the build rather than warn                       |
| `todo: info`                                                  | A `TODO` stays visible without blocking CI                        |
| `exclude: **/*.g.dart`, `**/generated_plugin_registrant.dart` | Pigeon and plugin-registrant output is never analyzed             |
| `formatter.trailing_commas: preserve`                         | `dart format` keeps your trailing-comma choice as written         |

`melos run analyze:dart:strict` adds `--fatal-infos --fatal-warnings`, so an
info-level lint fails the same as an error. CI runs exactly that.

## The rules contributors trip over

| Rule                                               | What it forces here                                                                  |
| -------------------------------------------------- | ------------------------------------------------------------------------------------ |
| `public_member_api_docs`                           | Every public member needs a doc comment; see doc-comments.md                         |
| `package_api_docs`                                 | Every library in a published package needs one too                                   |
| `lines_longer_than_80_chars`                       | Code and doc comments wrap at 80 columns                                             |
| `always_use_package_imports`                       | Import `package:health_connector_core/src/...`, never a relative path                |
| `implementation_imports`                           | Reach into another package through its library file, not its `src/`                  |
| `always_put_control_body_on_new_line`              | No single-line `if (x) return;`                                                      |
| `curly_braces_in_flow_control_structures`          | Every control body gets braces                                                       |
| `avoid_catches_without_on_clauses`                 | Catch `HealthConnectorException` or another named type, never bare `catch (e)`       |
| `only_throw_errors`                                | Throw an `Exception` or `Error` subtype; the record validators throw `ArgumentError` |
| `require_trailing_commas`                          | Multi-line argument and parameter lists end in a comma                               |
| `sort_pub_dependencies`                            | `pubspec.yaml` dependency blocks stay alphabetical                                   |
| `comment_references`                               | Every `[Symbol]` in a doc comment must resolve, or the analysis fails                |
| `directives_ordering`                              | Imports sorted, `dart:` before `package:`, exports in their own block                |
| `prefer_final_locals`, `omit_local_variable_types` | `final x = …`, not `var x = …` and not `final Foo x = …`                             |
| `avoid_print`                                      | Log through `HealthConnectorLogger`                                                  |

`comment_references` is the one that most often blocks a rename: renaming a type
breaks every doc comment that links to it, in files you did not touch. Run
`melos run analyze:dart:strict` after any rename before you assume it is done.
