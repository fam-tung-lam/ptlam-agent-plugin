# PTLam Dart Flutter Code Style

Rules for Flutter application code: the shared toolchain, the four-layer feature
structure, presentation state, widgets, routes, external boundaries, and tests.
This skill owns Flutter mechanics only.

<!-- PLUGIN-COMPILER:REQUIRED-SKILLS -->

## Before the first edit

1. Resolve the Flutter version through FVM. Run Flutter as `fvm flutter …` and
   Dart as `fvm dart …`; never use a global SDK. Every Dart command named in
   this skill runs through that prefix.
2. Find out which project you are in:

   | Project  | Version policy                                                                                                          |
   | -------- | ----------------------------------------------------------------------------------------------------------------------- |
   | New      | Latest stable Flutter and latest stable packages                                                                        |
   | Existing | Read `.fvmrc`, `pubspec.yaml`, and `pubspec.lock`, then match them; an upgrade is a separate change with its own checks |

3. Read `analysis_options.yaml`. It, `pubspec.lock`, and `.fvmrc` are the
   project's truth; the references describe the intended baseline.
4. For a new project, include
   [`very_good_analysis`](https://pub.dev/packages/very_good_analysis) at its
   pinned version as the lint set. Keep whatever set an existing project uses.

## Shared toolchain

[`build_runner`](https://pub.dev/packages/build_runner) runs every code
generator. Configure the builders in the root `build.yaml`, then regenerate
everything with:

```bash
fvm dart run build_runner build
```

Edit the source that owns a generated file; never hand-edit `*.g.dart`,
`*.freezed.dart`, `*.mocks.dart`, route files, or `strings.g.dart`. Follow the
repository's tracked-file policy for generated output.

When a build fails, fix the first error before reading the rest. Rerun
generation after changing any annotation or generator dependency, then run
analysis.

## Pick a reference

| Concern                                                                      | Reference                                               |
| ---------------------------------------------------------------------------- | ------------------------------------------------------- |
| Placing a layer, defining a repository boundary, or wiring dependencies      | [architecture.md](references/architecture.md)           |
| Choosing or connecting `setState`, `Cubit`, or `Bloc` state                  | [state-management.md](references/state-management.md)   |
| Adding a file or feature, placing a BLoC, or choosing what a feature exports | [file-organization.md](references/file-organization.md) |
| Naming, formatting, imports, `const`, analyzer settings, `// ignore:`        | The Dart skill loaded above                             |
| Building a widget, splitting one, declaring a route, or using `BuildContext` | [widgets.md](references/widgets.md)                     |
| Defining a DTO, a domain entity, a failure, or a Freezed union               | [models.md](references/models.md)                       |
| Calling an external API                                                      | [networking.md](references/networking.md)               |
| Reading or writing stored data                                               | [storage.md](references/storage.md)                     |
| Adding or changing user-visible text                                         | [localization.md](references/localization.md)           |
| Emitting a log record                                                        | [logging.md](references/logging.md)                     |
| Documenting a widget, BLoC, use case, or repository                          | [documentation.md](references/documentation.md)         |
| Writing, placing, or reshaping a test                                        | [testing.md](references/testing.md)                     |

## A check failed: where to look

| Failing check                                                        | Reference                                                                                               |
| -------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| `fvm flutter analyze`, a `very_good_analysis` lint                   | The Dart skill loaded above                                                                             |
| `fvm dart format` reports a diff                                     | The Dart skill loaded above                                                                             |
| `use_build_context_synchronously` fires after an `await`             | [widgets.md](references/widgets.md)                                                                     |
| `build_runner` fails, or generated output is missing                 | [Shared toolchain](#shared-toolchain), then the generator's owner                                       |
| A generated route or `strings.g.dart` symbol is undefined            | [widgets.md](references/widgets.md) for routes, [localization.md](references/localization.md) for Slang |
| Flutter or Dart SDK constraint mismatch                              | [Before the first edit](#before-the-first-edit)                                                         |
| `pumpAndSettle` times out, or a `blocTest` expectation never arrives | [testing.md](references/testing.md)                                                                     |

## Finish

Finish when touched feature code sits under its `application/`, `domain/`,
`infrastructure/`, or `presentation/` layer and follows its reference,
`fvm flutter analyze` and
`fvm dart format --output=none --set-exit-if-changed .` report nothing, the
affected tests pass, and every check you could not run is named.
