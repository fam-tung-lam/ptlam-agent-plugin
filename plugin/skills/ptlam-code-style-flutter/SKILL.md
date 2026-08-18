# PTLam Flutter Code Style

Conventions for Flutter application code: the shared toolchain, architecture,
state, source tree, widgets, external boundaries, and tests.

<!-- PLUGIN-COMPILER:REQUIRED-SKILLS -->

## Before the first edit

1. Resolve the Flutter version through FVM. Invoke Flutter commands as
   `fvm flutter …` and Dart commands as `fvm dart …`; never use a global SDK.
   Every Dart command named anywhere in this skill runs through that prefix.
2. Establish which project you are in:

   | Project  | Version policy                                                     |
   | -------- | ------------------------------------------------------------------ |
   | New      | Latest stable Flutter and latest stable packages                   |
   | Existing | Read `.fvmrc`, `pubspec.yaml`, and `pubspec.lock`, then match them |

3. Read `analysis_options.yaml`. It, `pubspec.lock`, and `.fvmrc` are the source
   of truth for this project; the references below describe the intended
   baseline, not the resolved one.
4. Use [`very_good_analysis`](https://pub.dev/packages/very_good_analysis) as
   the analyzer rule set for a new project, included at its pinned version. Keep
   whatever set an existing project already includes.

For a new project, use the latest stable Flutter release and the latest stable
packages. For an existing project, match `.fvmrc`, `pubspec.yaml`, and
`pubspec.lock`; an upgrade is a separate change with its own verification.

## Shared toolchain

[`build_runner`](https://pub.dev/packages/build_runner) is the common entry
point for every package that generates code. Configure its builders in the
project-root `build.yaml`, then regenerate all outputs with:

```bash
fvm dart run build_runner build
```

Edit the authored source that owns a generated output; never hand-edit generated
files such as `*.g.dart`, `*.freezed.dart`, `*.mocks.dart`, route files, or
`strings.g.dart`. After generation, follow the repository's tracked-file policy:
commit generated outputs when the repository tracks them, and leave ignored
outputs untracked.

When a build fails, fix the first error before reading the cascade below it.
Rerun generation after changing any annotation or generator dependency, then run
analysis.

## Pick a reference

| Concern                                                                   | Reference                                               |
| ------------------------------------------------------------------------- | ------------------------------------------------------- |
| Placing a layer, defining a repository boundary, or wiring dependencies   | [architecture.md](references/architecture.md)           |
| Choosing, structuring, or connecting `setState`, `Cubit`, or `Bloc` state | [state-management.md](references/state-management.md)   |
| Declaring or invoking an application route                                | [routing.md](references/routing.md)                     |
| Adding a file or a feature; deciding what a feature exports               | [file-organization.md](references/file-organization.md) |
| Naming, formatting, imports, `const`, analyzer settings, and `// ignore:` | The Dart skill loaded above                             |
| Building a widget, splitting one, or using `BuildContext`                 | [widgets.md](references/widgets.md)                     |
| Defining a DTO, a domain entity, a failure, or a Freezed union            | [models.md](references/models.md)                       |
| Calling an external API                                                   | [networking.md](references/networking.md)               |
| Reading or writing persisted data                                         | [storage.md](references/storage.md)                     |
| Adding or changing user-visible text                                      | [localization.md](references/localization.md)           |
| Emitting a log record                                                     | [logging.md](references/logging.md)                     |
| Documenting a widget, BLoC, use case, or repository                       | [documentation.md](references/documentation.md)         |
| Writing, placing, or restructuring a test                                 | [testing.md](references/testing.md)                     |

## A check failed — where to look

| Failing check                                                        | Reference                                                                                           |
| -------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| `fvm flutter analyze`, a `very_good_analysis` lint                   | The Dart skill loaded above                                                                         |
| `fvm dart format` reports a diff                                     | The Dart skill loaded above                                                                         |
| `use_build_context_synchronously` fires after an `await`             | [widgets.md](references/widgets.md)                                                                 |
| `build_runner` fails, or generated output is missing                 | [Shared toolchain](#shared-toolchain), then the reference that owns the generator                   |
| A generated route or `strings.g.dart` symbol is undefined            | [localization.md](references/localization.md) (Slang), [routing.md](references/routing.md) (routes) |
| Flutter SDK or Dart SDK constraint mismatch                          | [Before the first edit](#before-the-first-edit)                                                     |
| `pumpAndSettle` times out, or a `blocTest` expectation never arrives | [testing.md](references/testing.md)                                                                 |

## Finish

Finish when the touched code satisfies the reference for its concern,
`fvm flutter analyze` and
`fvm dart format --output=none --set-exit-if-changed .` report nothing, the
affected tests pass, and every check you could not run is named in the handoff.
