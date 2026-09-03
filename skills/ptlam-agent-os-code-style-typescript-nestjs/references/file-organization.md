# File Organization

Where the `src/api` monorepo puts the app, features, and packages, what each
publishes, and where a monorepo-level file goes. The loaded NestJS skill owns
placement inside a feature's four layers.

## Three package kinds

```text
src/api/
├── pnpm-workspace.yaml                 # members, version catalog, disallowWorkspaceCycles
├── turbo.json                          # build, dev, test, typecheck; ^build runs dependencies first
├── biome.json                          # extends ptlam-agent-os-lints/biome
├── apps/
│   └── ptlam-agent-os-api/
│       ├── nest-cli.json, tsconfig.json, tsconfig.build.json, vitest.config.ts
│       ├── src/
│       │   ├── main.ts                 # reflect-metadata, then bootstrap one HTTP application
│       │   ├── app.module.ts           # composition root: config, operations, package modules, feature modules
│       │   ├── config/                 # typed configuration parsed once
│       │   ├── operations/             # health, readiness, and build information
│       │   ├── <join>/                 # app-owned adapters that fulfill one feature's port with another feature
│       │   └── **/*.spec.ts            # unit tests beside their source
│       └── test/*.e2e-spec.ts          # HTTP contract tests through the assembled application
├── features/
│   └── ptlam-agent-os-<feature>/
│       ├── package.json                # exports "." only; depends on packages, never on a feature
│       ├── tsconfig.json, tsconfig.build.json, vitest.config.ts
│       ├── src/
│       │   ├── index.ts                # public surface: the module, exported use cases or facade, tokens, domain types the app needs
│       │   ├── <feature>.module.ts
│       │   ├── application/            # dtos, ports, use-cases
│       │   ├── domain/                 # entities, value-objects, failures
│       │   ├── infrastructure/
│       │   │   ├── adapters/           # port implementations
│       │   │   └── persistence/        # schema and migrations for the tables this feature owns
│       │   ├── presentation/           # http, tasks
│       │   └── **/*.spec.ts
│       └── test/*.e2e-spec.ts          # module or adapter tests that need a container or a real resource
└── packages/
    └── ptlam-agent-os-<package>/
        ├── package.json                # exports "."; depends on packages only
        └── src/
            ├── index.ts
            └── ...                     # flat, organized by what the package does
```

| Kind    | Purpose                                                  | Structure                                                         |
| ------- | -------------------------------------------------------- | ----------------------------------------------------------------- |
| App     | Composes features and packages into one runnable process | `src/main.ts`, `src/app.module.ts`, `config/`, `operations/`      |
| Feature | One product capability the operator can name             | The four layers under `src/`, one exported module                 |
| Package | One reusable boundary with no product logic              | Flat `src/`; a Nest module only when the reusable thing is wiring |

The loaded skill's single-application tree (`src/<feature>/`, `integrations/`,
`shared/`, `tests/`) does not apply here. A feature is its own package, an
integration or shared module is a package, and tests sit where
[testing.md](testing.md) says.

## Roles this monorepo adds

| Location                      | Owns                                                                                               |
| ----------------------------- | -------------------------------------------------------------------------------------------------- |
| `config/`                     | Parsing and exposing typed configuration; the only reader of the environment                       |
| `<join>/`                     | App-owned adapters that fulfill one feature's port with another feature's exported surface         |
| `infrastructure/persistence/` | Schema and migrations for the feature's own tables, shaped by `agents/004_PRINCIPLES.md` section C |
| `packages/<system>/`          | One reusable client, pool, or broker facade per external system, free of feature policy            |

A package that wraps a database, cache, or broker owns the pool, the migration
runner, and its Nest registration. A feature owns its tables, queries, and
mapping, and the app hands every feature's migrations to that runner. A queue
processor or schedule stays in the owning feature's presentation layer.

## Adding a feature or package

1. Name it `ptlam-agent-os-<name>` and make the folder name match. Files are
   kebab-case with a role suffix, as `useFilenamingConvention` enforces.
2. Copy `package.json`, `tsconfig.json`, `tsconfig.build.json`, and
   `vitest.config.ts` from the nearest package of the same kind. Point
   `exports["."]` at `dist/index.js` with its `.d.ts`, give it a `build` script
   that emits `dist/`, and take every version from the catalog as `catalog:`.
3. Add it to each dependent's `package.json` as `workspace:*`, run
   `pnpm install`, then `pnpm build` so Turbo builds it before its dependents.
4. Run `pnpm --filter <package-name> build` after changing a feature or package
   while the app runs in watch mode; the watcher does not rebuild dependencies.

## One file spells the published surface

`src/index.ts` exports what the app may use and nothing else. For a feature that
is its module, the use cases or facade it exports, the tokens another module
must bind, and the domain types that cross to the app. Infrastructure adapters
never leave the feature. `noUndeclaredDependencies` rejects an import from a
package the manifest does not list; `noImportCycles` rejects a cycle inside a
package.
