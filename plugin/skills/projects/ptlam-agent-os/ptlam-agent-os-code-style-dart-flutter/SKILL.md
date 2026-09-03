# PTLam Agent OS Code Style Dart Flutter

Write, review, or fix Flutter code in the PTLam Agent OS `src/app` monorepo.
This skill owns only what that monorepo adds to the loaded Flutter rules: the
app, feature, and package kinds and their dependency direction, the lints
package and Melos commands, feature composition and routing across packages,
per-feature localization ownership, the project's test-level order, and the
charter rules every change must respect.

Not this skill: the four feature layers, BLoC and widget rules, models,
networking, storage, logging, dartdoc, or Dart mechanics. The loaded skills own
those.

<!-- PLUGIN-COMPILER:REQUIRED-SKILLS -->

## Before the first edit

1. Confirm the checkout: `src/app/pubspec.yaml` names `ptlam_agent_os_workspace`
   and `.fvmrc` sits beside it. Work from `src/app`.
2. Read the repository `AGENTS.md`, `src/app/README.md`, the root `pubspec.yaml`
   (pub workspace members and Melos scripts), and the `pubspec.yaml` of every
   package you touch. Match `pubspec.lock`; an upgrade is a separate change with
   its own checks.
3. Every package includes the `ptlam_agent_os_lints` rule set:
   `analysis_options.flutter.yml` for a Flutter package,
   `analysis_options.dart.yml` for a pure Dart package. Keep that include and
   change a rule in the lints package, never in one consumer. The set enables
   `always_use_package_imports`, so inside `lib/` write `package:` imports.
4. Name domain types with the binding vocabulary in `agents/002_VISION.md`. Its
   term Workspace is reserved, so call the pub or Melos grouping "the monorepo"
   in code and comments.
5. Record a new third-party dependency or a new package boundary under
   `docs/adrs/` before implementing it (`AGENTS.md`, rule 3); both are hard to
   reverse.

## The monorepo

| Kind    | Lives in                          | May depend on         | Owns                                                                   |
| ------- | --------------------------------- | --------------------- | ---------------------------------------------------------------------- |
| App     | `apps/ptlam_agent_os/`            | Features and packages | `main`, theme, router, dependency wiring, app-only screens, end-to-end |
| Feature | `features/ptlam_agent_os_<name>/` | Packages only         | One product capability in the four layers the loaded skill defines     |
| Package | `packages/ptlam_agent_os_<name>/` | Packages only         | One reusable boundary with no product logic; flat `lib/src/`           |

Dependencies point one way: app to feature to package. A feature never imports
another feature. [file-organization.md](references/file-organization.md) owns
the tree; [composition.md](references/composition.md) owns how the app joins
features.

## Run the monorepo

Melos runs every package from `src/app`:

```bash
melos bootstrap            # after adding a package or a dependency
melos run analyze          # flutter analyze in every package
melos run test             # flutter test in every package with a test/ directory
melos run test:e2e:macos   # the app's end-to-end journeys on macOS
melos run test:e2e:web     # the same journeys through ChromeDriver
```

Run a focused command inside the one package you are changing. Add a Melos
script only when every package needs the same step.

Code generation runs per package. Configure builders in that package's
`build.yaml` and run the loaded skill's `build_runner` command inside the
package that owns the generator, with `--delete-conflicting-outputs`.

## Pick a reference

| Concern                                                                       | Reference                                               |
| ----------------------------------------------------------------------------- | ------------------------------------------------------- |
| Creating an app, feature, or package; placing a file; deciding what to export | [file-organization.md](references/file-organization.md) |
| Registering a feature's dependencies, or letting one feature reach another    | [composition.md](references/composition.md)             |
| Declaring a feature route or composing the app router                         | [routing.md](references/routing.md)                     |
| Adding user-visible text, or changing the locale                              | [localization.md](references/localization.md)           |
| Choosing a test level, or placing and running a test                          | [testing.md](references/testing.md)                     |
| Layers, state, widgets, models, networking, storage, logging, documentation   | The loaded Flutter skill                                |

## Finish

Finish when the touched code satisfies its reference, every import follows the
app-to-feature-to-package direction, `melos run analyze` and
`fvm dart format --output=none --set-exit-if-changed .` from `src/app` report
nothing, the affected end-to-end journey and package tests pass, and every check
you could not run is named in the handoff.
