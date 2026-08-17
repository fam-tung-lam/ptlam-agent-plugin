# File Organization

Where Flutter puts source and test files, and how a feature publishes its
surface.

## The source tree

```mermaid
treeView-beta
    <project_name>/
        .fvmrc
        analysis_options.yaml
        build.yaml ## Configures route, Slang, JSON, and Freezed generators
        pubspec.yaml
        pubspec.lock
        lib/
            main.dart ## Runs the app only
            settings.dart ## Typed application configuration, when needed
            db.dart ## Database initialization, when needed
            app/ ## UI shell, routing, and global composition only
                app.dart ## Installs the design-system ThemeData
                app_router.dart
                di.dart ## Registers concrete get_it dependencies
            integrations/ ## One client or adapter facade per external system
            shared/ ## Framework-neutral code with at least two feature consumers
            packages/ ## Boundaries prepared for package extraction
                <project_name>_logger/
                    <project_name>_logger.dart ## Public export
                    src/
                        app_logger.dart
                <project_name>_design_system/
                    <project_name>_design_system.dart
                    src/
                        style/ ## Color, typography, icons, elevation, shape, and motion
                        theme/ ## Light and dark ThemeData
                        components/ ## Shared buttons, indicators, and pickers
            features/
                localization/ ## Localization is a feature, not a utility
                    i18n/ ## Contains one catalog per supported locale
                    localization.dart
                    widgets/
                        localization_page.dart ## The feature's single page
                        components/ ## Logical widgets for the page
                    entities/ ## Domain entities
                    failures/ ## Domain failures
                    dtos/ ## Wire or storage shapes
                    bloc/
                    usecases/
                    repositories/
                    utils/ ## Reusable low-level helpers without business logic
                    constants/ ## Constants reused inside the feature
                <feature_name>/
                    <feature_name>.dart ## Public export
                    widgets/
                        <feature_name>_page.dart ## The feature's single page
                        components/ ## Logical widgets for the page
                    entities/ ## Domain entities
                    failures/ ## Domain failures
                    dtos/ ## Wire or storage shapes
                    bloc/
                    usecases/
                    repositories/
                    utils/ ## Reusable low-level helpers without business logic
                    constants/ ## Constants reused inside the feature
        test/ ## Mirrors lib, then adds the level
            packages/
                <project_name>_logger/
                    unit/
            features/
                <feature_name>/
                    test_doubles/ ## Doubles genuinely shared across levels
                    unit/
                        test_doubles/ ## Doubles shared by unit tests only
                    integration/
                        test_doubles/ ## Doubles shared by integration tests only
        tool/ ## Deterministic project scripts, when needed
```

## Flutter spells the published surface with one file

`<feature_name>/<feature_name>.dart` exports everything another feature may use
— usually the page, its route, and the entities that cross the boundary.

Another feature imports that file rather than reaching into the feature's
directories. [state-management.md](state-management.md) owns the authored file
layout inside `bloc/`.

The same rule governs `packages/`: the barrel file at its root is the surface,
and `src/` is private.

## Where something goes

| Adding                                                   | Put it in                                               |
| -------------------------------------------------------- | ------------------------------------------------------- |
| The feature's single page                                | `features/<name>/widgets/<name>_page.dart`              |
| A logical widget used by that page                       | `features/<name>/widgets/components/`                   |
| A widget two features render                             | `packages/<project_name>_design_system/src/components/` |
| A domain entity one feature owns                         | `features/<name>/entities/`                             |
| A domain failure one feature owns                        | `features/<name>/failures/`                             |
| A DTO for wire or storage data                           | `features/<name>/dtos/`                                 |
| A small reusable low-level helper with no business logic | `features/<name>/utils/`                                |
| A constant reused inside one feature                     | `features/<name>/constants/`                            |
| Something two features genuinely share                   | `lib/shared/`                                           |
| A client or adapter for an external system               | `lib/integrations/`                                     |
| Application settings or database initialization          | `lib/settings.dart` or `lib/db.dart`                    |
| A reusable boundary with no product logic                | `packages/<name>/`                                      |

`shared/` is for what is already shared by two features, not for what might be.
A file lands there when its second consumer appears — until then it belongs to
the feature that has it. Keep external-system clients and adapters in
`integrations/`; keep feature behavior in the feature that consumes them.

The names `dtos`, `entities`, `repositories`, and `di` intentionally match the
backend vocabulary. They describe common architectural concepts instead of
framework-specific layers, which reduces context switching between mobile and
backend codebases.

Keep business rules in use cases, BLoCs, or domain types. A `utils/` helper may
format, parse, clamp, or adapt a low-level value; it never decides product
behavior. Keep a constant beside its only consumer until a second file in the
feature needs it, then move it to `constants/`.

Prefer one public class per file, named after the file. A small private helper
used only by that class may stay beside it.
