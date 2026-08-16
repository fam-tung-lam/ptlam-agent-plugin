# Toolchain and Dependencies

The SDK, the package baseline, and code generation.

## FVM owns the SDK

Every project pins its Flutter version in `.fvmrc`, and every command runs
through FVM: `fvm flutter …`, `fvm dart …`. A bare `flutter` invocation uses
whatever the machine happens to have and is a defect in a script or a doc.

## Resolve the version when you need it

This file names packages and records no version numbers. Neither should any
other document here: a written version is wrong within weeks and keeps getting
copied into projects long after that.

**A new project** takes the latest stable Flutter and the latest stable release
of each package. Read the current version from pub.dev at the moment you add it.

**An existing project** gets read before any decision. `.fvmrc`, `pubspec.yaml`,
and `pubspec.lock` say what is already resolved — match that, and do not upgrade
anything as a side effect of an unrelated change.

Declare compatible constraints in `pubspec.yaml`. The committed `pubspec.lock`
owns the exact resolved graph and is the only authority on what a project
actually runs.

An upgrade is its own change, with its own reason and its own test run. Say what
it breaks and what you verified.

## The application baseline

These are the package choices. The reason column is what makes each one durable;
the version is whatever the rule above resolves to.

| Concern | Package | Why it is here |
| --- | --- | --- |
| Feature state | [`flutter_bloc`](https://pub.dev/packages/flutter_bloc) | Explicit event and state contracts; `Cubit` stays available for simple local state |
| Event ordering | [`bloc_concurrency`](https://pub.dev/packages/bloc_concurrency) | Makes sequential, restartable, droppable, or concurrent policy explicit instead of accidental |
| Routing | [`go_router`](https://pub.dev/packages/go_router) with [`go_router_builder`](https://pub.dev/packages/go_router_builder) | Generated typed routes make names and parameters compile-time checked, keeping deep links, redirects, and nesting |
| HTTP | [`dio`](https://pub.dev/packages/dio) | Interceptors, cancellation, timeouts, and pluggable adapters |
| JSON | [`json_annotation`](https://pub.dev/packages/json_annotation) with [`json_serializable`](https://pub.dev/packages/json_serializable) | Generated, reviewable mapping at the network boundary |
| Immutable data | [`freezed_annotation`](https://pub.dev/packages/freezed_annotation) with [`freezed`](https://pub.dev/packages/freezed) | Exhaustive unions, copy, and equality for DTOs, events, and states |
| Code generation | [`build_runner`](https://pub.dev/packages/build_runner) | One entry point for routes, JSON, Freezed, and Slang |
| Dependency composition | [`get_it`](https://pub.dev/packages/get_it) | Registers concrete adapters once in `app_dependencies.dart` |
| Credentials | [`flutter_secure_storage`](https://pub.dev/packages/flutter_secure_storage) | Opaque credentials and small device keys, never a blob store |
| Settings | [`shared_preferences`](https://pub.dev/packages/shared_preferences) | Non-sensitive key/value only, through `SharedPreferencesAsync` |
| Permissions | [`permission_handler`](https://pub.dev/packages/permission_handler) | One adapter for request, status, and settings flow |
| Localization | [`slang`](https://pub.dev/packages/slang), `slang_flutter`, `slang_build_runner`, SDK `flutter_localizations` | Type-safe JSON translations with pluralization and locale handling |
| Logging | [`logging`](https://pub.dev/packages/logging) | Levels and records behind the project's own `AppLogger` |
| Lints | [`very_good_analysis`](https://pub.dev/packages/very_good_analysis) | The opinionated ruleset, included from `analysis_options.yaml` |
| Tests | SDK `flutter_test`, [`bloc_test`](https://pub.dev/packages/bloc_test), [`mocktail`](https://pub.dev/packages/mocktail) | Unit and integration levels; fakes first, Mocktail for justified seams |

Adding a package outside this list needs a reason the baseline cannot cover.
Say what it replaces or what gap it fills before adding it.

## Code generation

`build.yaml` at the project root configures every generator. One command
regenerates all of them:

```bash
fvm dart run build_runner build --delete-conflicting-outputs
```

- Do not read or edit generated files: `*.g.dart`, `*.freezed.dart`,
  `*.config.dart`, `strings.g.dart`, and their siblings.
- Do not commit them. They are ignored, and regenerating is the only supported
  way to produce them.
- To change generated output, edit the annotated source and rerun the command.
- When a build fails, read the first error only. Later errors are usually
  cascade damage from missing symbols the first one prevented.
- After changing a dependency that generates code, rerun the build before
  running `fvm flutter analyze`.
