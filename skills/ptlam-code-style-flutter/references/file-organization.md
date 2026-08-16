# File Organization

Where a file goes, what a feature publishes, and where its test lives. The
`ptlam-code-style` foundation owns the published-surface rule and the
create-structure-on-demand rule these paths satisfy.

## The source tree

```text
<project_name>/
├── .fvmrc
├── analysis_options.yaml
├── build.yaml                              # route, Slang, JSON, and Freezed generators
├── pubspec.yaml
├── pubspec.lock
├── lib/
│   ├── main.dart                           # runs the app, and nothing else
│   ├── app/                                # UI shell, routing, and global composition only
│   │   ├── app.dart                        # installs the design-system ThemeData
│   │   ├── app_router.dart
│   │   └── app_dependencies.dart           # get_it registrations; concrete wiring only
│   ├── packages/                           # boundaries prepared for extraction as real packages
│   │   ├── <project_name>_logger/
│   │   │   ├── <project_name>_logger.dart  # public export
│   │   │   └── src/
│   │   │       └── app_logger.dart
│   │   └── <project_name>_design_system/
│   │       ├── <project_name>_design_system.dart
│   │       └── src/
│   │           ├── style/                  # color, typography, icons, elevation, shape, motion
│   │           ├── theme/                  # light and dark ThemeData
│   │           └── components/             # shared buttons, indicators, pickers
│   └── features/
│       ├── core/                           # what two or more features genuinely share
│       ├── localization/                   # localization is a feature, not a utility
│       │   ├── i18n/                       # en.i18n.json, ru.i18n.json
│       │   ├── localization.dart
│       │   ├── ui/
│       │   ├── models/
│       │   ├── bloc/
│       │   ├── usecases/
│       │   └── repositories/
│       └── <feature_name>/
│           ├── <feature_name>.dart         # public export
│           ├── ui/                         # screens and their widgets
│           ├── models/                     # domain models, DTOs, failures
│           ├── bloc/
│           ├── usecases/
│           └── repositories/
├── test/                                   # mirrors lib/, then adds the level
│   ├── packages/
│   │   └── <project_name>_logger/
│   │       └── unit/
│   └── features/
│       └── <feature_name>/
│           ├── test_doubles/               # only doubles reused across levels
│           ├── unit/
│           └── integration/
└── tool/                                   # deterministic project scripts, when needed
```

## A feature publishes one file

`<feature_name>/<feature_name>.dart` exports everything another feature may use
— usually the screen, its route, and the models that cross the boundary.

Another feature imports that file and nothing else. Importing
`features/orders/bloc/orders_bloc.dart` from outside `orders/` is a defect even
though Dart allows it.

The same rule governs `packages/`: the barrel file at its root is the surface,
and `src/` is private.

## Where something goes

| Adding | Put it in |
| --- | --- |
| A screen and the widgets only it uses | `features/<name>/ui/` |
| A widget two features render | `packages/<project_name>_design_system/src/components/` |
| A model, exception, or DTO one feature owns | `features/<name>/models/` |
| Something two features genuinely share | `features/core/` |
| A reusable boundary with no product logic | `packages/<name>/` |

`features/core/` is for what is already shared by two features, not for what
might be. A file lands there when its second consumer appears — until then it
belongs to the feature that has it.

Prefer one public class per file, named after the file. A small private helper
used only by that class may stay beside it.

## Where its test goes

Mirror the path from `lib/` into `test/`, then add the level segment:

```text
lib/features/orders/usecases/place_order.dart
-> test/features/orders/unit/place_order_test.dart
```

[testing.md](testing.md) owns the level choice and the naming.
