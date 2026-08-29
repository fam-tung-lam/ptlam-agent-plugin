# File Organization

Where Flutter puts source and test files, how each feature expresses four
layers, and how a feature publishes its surface.

## Grow into this structure

Keep a small application flat until a second business capability makes feature
folders useful. Once a capability owns a feature folder, place its code under
`application/`, `domain/`, `infrastructure/`, or `presentation/`. Create a
subfolder only when its first owned file appears.

```text
<project_name>/
├── .fvmrc
├── analysis_options.yaml
├── build.yaml                       # route, Slang, JSON, and Freezed generators
├── pubspec.yaml
├── pubspec.lock
├── lib/
│   ├── main.dart                    # runs the app only
│   ├── settings.dart                # typed application configuration, when needed
│   ├── db.dart                      # database initialization, when needed
│   ├── app/                         # UI shell, routing, and global composition only
│   │   ├── app.dart                 # installs the design-system ThemeData
│   │   ├── app_router.dart
│   │   └── di.dart                  # registers concrete get_it dependencies
│   ├── integrations/                # shared clients and SDK facades
│   ├── shared/                      # framework-neutral, proven cross-feature reuse
│   ├── packages/                    # boundaries prepared for package extraction
│   │   ├── <project_name>_logger/
│   │   │   ├── <project_name>_logger.dart
│   │   │   └── src/
│   │   │       └── app_logger.dart
│   │   └── <project_name>_design_system/
│   │       ├── <project_name>_design_system.dart
│   │       └── src/
│   │           ├── style/
│   │           ├── theme/
│   │           └── components/
│   └── features/
│       └── orders/                  # one business capability
│           ├── orders.dart          # public feature export
│           ├── application/
│           │   ├── ports/           # repository and outbound contracts
│           │   │   └── orders_repository.dart
│           │   └── use_cases/       # one application operation per file
│           │       └── place_order_use_case.dart
│           ├── domain/
│           │   ├── entities/
│           │   │   └── order.dart
│           │   ├── failures/
│           │   │   └── orders_failure.dart
│           │   └── value_objects/
│           ├── infrastructure/
│           │   ├── adapters/        # application-port implementations
│           │   │   └── cached_orders_repository.dart
│           │   ├── clients/         # remote API mechanics
│           │   │   └── orders_api_client.dart
│           │   ├── data_sources/    # storage and platform-plugin mechanics
│           │   │   └── orders_local_data_source.dart
│           │   └── dtos/            # wire, storage, and plugin shapes
│           │       └── order_response_dto.dart
│           └── presentation/
│               ├── bloc/            # BLoCs, Cubits, events, and states
│               │   ├── orders_bloc.dart
│               │   ├── orders_event.dart
│               │   └── orders_state.dart
│               ├── pages/
│               │   └── orders_page.dart
│               └── widgets/
│                   └── order_card.dart
├── test/                             # mirrors lib, then adds the level
│   ├── packages/
│   │   └── <project_name>_logger/
│   │       └── unit/
│   └── features/
│       └── orders/
│           ├── test_doubles/         # doubles shared across levels
│           ├── unit/
│           │   ├── application/
│           │   │   └── use_cases/
│           │   ├── domain/
│           │   └── presentation/
│           │       └── bloc/
│           └── integration/
│               ├── infrastructure/
│               └── presentation/
└── tool/                             # deterministic project scripts, when needed
```

Keep this tree as plain text so it renders in every editor, terminal, diff, and
review. Localization is an ordinary feature with the same four layers and public
export; it adds its translation catalogs under `localization/i18n/`.

## Give each layer one role

| Path                           | Owns                                                         |
| ------------------------------ | ------------------------------------------------------------ |
| `<feature>.dart`               | The capability's deliberate public exports                   |
| `application/ports/`           | Repository and outbound contracts consumed by use cases      |
| `application/use_cases/`       | One transport-neutral application operation per file         |
| `domain/entities/`             | Domain values with identity                                  |
| `domain/failures/`             | Stable failures application and presentation code may handle |
| `domain/value_objects/`        | Immutable domain values defined by their contents            |
| `infrastructure/adapters/`     | Implementations of application ports                         |
| `infrastructure/clients/`      | Remote API clients with no product policy                    |
| `infrastructure/data_sources/` | Storage and platform-plugin access                           |
| `infrastructure/dtos/`         | Wire, storage, and plugin-owned shapes                       |
| `presentation/bloc/`           | BLoCs, Cubits, events, and states                            |
| `presentation/pages/`          | Route-level pages that provide or observe state holders      |
| `presentation/widgets/`        | Feature widgets and UI effects                               |

BLoC is part of the presentation layer. Widgets provide and observe it, but the
state holder delegates product operations to use cases and has no `BuildContext`
or widget dependency.

## Publish one feature surface

`<feature_name>/<feature_name>.dart` exports everything another feature may use:
usually the page, its route, an application facade, and the domain types that
cross the boundary. It never exports infrastructure. Another feature imports
that file instead of reaching into layer folders.
[state-management.md](state-management.md) owns the file layout inside
`presentation/bloc/`. The same rule governs `packages/`: the barrel file is the
surface, and `src/` is private.

## Place code by responsibility

| Adding                                       | Put it in                                               |
| -------------------------------------------- | ------------------------------------------------------- |
| A BLoC or Cubit                              | `features/<name>/presentation/bloc/`                    |
| A repository or outbound contract            | `features/<name>/application/ports/`                    |
| A use case                                   | `features/<name>/application/use_cases/`                |
| A domain entity                              | `features/<name>/domain/entities/`                      |
| A domain failure                             | `features/<name>/domain/failures/`                      |
| A value object                               | `features/<name>/domain/value_objects/`                 |
| A repository or platform-port implementation | `features/<name>/infrastructure/adapters/`              |
| A remote API client                          | `features/<name>/infrastructure/clients/`               |
| A storage or platform data source            | `features/<name>/infrastructure/data_sources/`          |
| A wire, storage, or plugin DTO               | `features/<name>/infrastructure/dtos/`                  |
| The feature's route-level page               | `features/<name>/presentation/pages/`                   |
| A logical widget used by that page           | `features/<name>/presentation/widgets/`                 |
| A widget two features render                 | `packages/<project_name>_design_system/src/components/` |
| Something two features really share          | `lib/shared/`                                           |
| A shared client or SDK facade                | `lib/integrations/`                                     |

`shared/` is for framework-neutral code already used by two features, not for
what might be shared later. Keep shared external-system setup in
`integrations/`; keep feature mapping and policy in the owning feature.

Keep a helper or constant beside its only consumer. When a second file in the
same layer needs it, create a narrowly named folder inside that layer. Never add
feature-root `utils/`, `helpers/`, `models/`, or `constants/` buckets. Prefer
one public class per file, named after the file.

## Suffix a class with its role

Suffix every state holder, repository, use case, client, and data source with
its role: `OrdersBloc`, `OrdersRepository`, `PlaceOrderUseCase`,
`OrdersApiClient`, `AppLocaleLocalDataSource`. Do not suffix a domain type or
DTO with a vague `Model`: `Order` for the entity, `OrderResponseDto` for the
external shape.

Finish when every feature source file apart from its public export sits in one
explicit layer, BLoCs and Cubits sit under `presentation/`, public imports enter
the feature export, infrastructure stays private, and tests mirror capability
and layer ownership.
