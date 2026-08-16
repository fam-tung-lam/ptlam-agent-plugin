# File Organization

Where a file goes, what a feature publishes, and where its test lives. The
`ptlam-code-style` foundation owns the published-surface rule and the
create-structure-on-demand rule these paths satisfy.

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
            app/ ## UI shell, routing, and global composition only
                app.dart ## Installs the design-system ThemeData
                app_router.dart
                app_dependencies.dart ## Registers concrete get_it dependencies
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
                core/ ## What two or more features genuinely share
                localization/ ## Localization is a feature, not a utility
                    i18n/ ## Contains en.i18n.json and ru.i18n.json
                    localization.dart
                    ui/
                        localization_page.dart ## The feature's single page
                        components/ ## Logical UI components for the page
                    models/ ## Domain models and failures
                    bloc/
                        localization_bloc.dart
                        localization_event.dart
                        localization_state.dart
                    usecases/
                        dtos/ ## Every DTO owned by the feature
                    repositories/
                    utils/ ## Reusable low-level helpers without business logic
                    constants/ ## Constants reused inside the feature
                <feature_name>/
                    <feature_name>.dart ## Public export
                    ui/
                        <feature_name>_page.dart ## The feature's single page
                        components/ ## Logical UI components for the page
                    models/ ## Domain models and failures
                    bloc/
                        <feature_name>_bloc.dart
                        <feature_name>_event.dart
                        <feature_name>_state.dart
                    usecases/
                        dtos/ ## Every DTO owned by the feature
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

## A feature publishes one file

`<feature_name>/<feature_name>.dart` exports everything another feature may use
— usually the page, its route, and the models that cross the boundary.

Another feature imports that file and nothing else. Importing
`features/orders/bloc/orders_bloc.dart` from outside `orders/` is a defect even
though Dart allows it.

The same rule governs `packages/`: the barrel file at its root is the surface,
and `src/` is private.

## Where something goes

| Adding | Put it in |
| --- | --- |
| The feature's single page | `features/<name>/ui/<name>_page.dart` |
| A logical UI component used by that page | `features/<name>/ui/components/` |
| A widget two features render | `packages/<project_name>_design_system/src/components/` |
| A domain model or failure one feature owns | `features/<name>/models/` |
| Any DTO one feature owns | `features/<name>/usecases/dtos/` |
| A small reusable low-level helper with no business logic | `features/<name>/utils/` |
| A constant reused inside one feature | `features/<name>/constants/` |
| Something two features genuinely share | `features/core/` |
| A reusable boundary with no product logic | `packages/<name>/` |

`features/core/` is for what is already shared by two features, not for what
might be. A file lands there when its second consumer appears — until then it
belongs to the feature that has it.

Keep business rules in use cases, BLoCs, or domain types. A `utils/` helper may
format, parse, clamp, or adapt a low-level value; it never decides product
behavior. Keep a constant beside its only consumer until a second file in the
feature needs it, then move it to `constants/`.

Prefer one public class per file, named after the file. A small private helper
used only by that class may stay beside it.

## Where its test goes

Mirror the path from `lib/` into `test/`, then add the level segment:

```text
lib/features/orders/usecases/place_order.dart
-> test/features/orders/unit/place_order_test.dart
```

[testing.md](testing.md) owns the level choice and the naming.
