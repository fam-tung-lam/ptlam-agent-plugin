---
name: ptlam-agent-os-code-style-typescript-nestjs
description:
  Write, review, and fix NestJS code in the PTLam Agent OS src/api monorepo
  against its app, feature, and package kinds and their dependency direction,
  the pnpm catalog, Turbo, Biome, and Vitest facts, feature composition through
  the root module and join adapters, feature-owned persistence, the project's
  highest-level-first test order, and its charter vocabulary and decision-record
  rules. Use when creating an app, feature, or package there, placing a file,
  wiring a feature module into the app, letting one feature reach another,
  choosing a test level, or fixing a pnpm, Turbo, Biome, or Vitest project
  failure. Compose this skill from any PTLam Agent OS workflow that changes
  TypeScript files. Do not use for the four feature layers, use cases,
  providers, transports, or TypeScript mechanics on their own, or for another
  repository.
---

# PTLam Agent OS Code Style TypeScript NestJS

Write, review, or fix NestJS code in the PTLam Agent OS `src/api` monorepo. This
skill owns only what that monorepo adds to the loaded NestJS rules: the app,
feature, and package kinds and their dependency direction, the pnpm, Turbo,
Biome, and Vitest facts, feature composition across packages, the project's
test-level order, and the charter rules every change must respect.

Not this skill: the four feature layers, use cases, module API, providers,
enhancers, lifecycle, transports, operations, or TypeScript mechanics. The
loaded skills own those.

## Required skills

### `ptlam-code-style-typescript-nestjs`

**Reason:** Provides the feature-first hexagonal structure, use cases, module API, providers, enhancers, lifecycle, transports, operations, and Nest test mechanics this monorepo's conventions build on.

**Instructions:** Read and apply ptlam-code-style-typescript-nestjs first; it loads
ptlam-code-style-typescript and ptlam-code-style as its own
foundations.
Let it own the four feature layers, use cases, module API, tokens
and scopes, enhancers, lifecycle, transport contracts, operations,
and Nest test mechanics.
Use this skill only for the src/api monorepo: package kinds and
dependency direction, toolchain facts, root-module composition and
join adapters, feature-owned persistence, the project's test-level
order, and charter rules.
Where this skill names a monorepo mechanic that replaces the
single-application layout, test placement, or test-level order,
this skill wins. Everywhere else it may be stricter, never looser.

Read [ptlam-code-style-typescript-nestjs](skills/ptlam-code-style-typescript-nestjs/SKILL.md).

## Before the first edit

1. Confirm the checkout: `src/api/package.json` names
   `ptlam-agent-os-api-workspace` and `pnpm-workspace.yaml` sits beside it. Work
   from `src/api`.
2. Read the repository `AGENTS.md`, `src/api/README.md`, `pnpm-workspace.yaml`,
   `turbo.json`, the root `tsconfig.json` and `biome.json`, and each touched
   package's `package.json`, `tsconfig*.json`, and `vitest.config.ts`.
3. Treat these verified monorepo facts as the mechanic:

   | Concern    | Fact                                                                                                                                                                                        |
   | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | Runtime    | Node pinned in `.nvmrc` (`nvm use`); pnpm from `packageManager`; every version declared once in the catalog and used as `catalog:`                                                          |
   | Modules    | ES modules, `NodeNext`, `verbatimModuleSyntax`; a relative import ends in `.js`                                                                                                             |
   | Decorators | `experimentalDecorators` and `emitDecoratorMetadata` in the root `tsconfig.json`; `import "reflect-metadata"` opens `main.ts`                                                               |
   | Lint       | Biome policy from `ptlam-agent-os-lints`: `useImportType`, `noProcessGlobal`, `noConsole`, `noImportCycles`, `noUndeclaredDependencies`, `useFilenamingConvention`, cognitive complexity 15 |
   | Tests      | Vitest projects `unit` (`src/**/*.spec.ts`) and `e2e` (`test/**/*.e2e-spec.ts`); supertest for HTTP; class-token injection works under this setup                                           |
   | Gate       | `pnpm check` runs `quality:check`, `typecheck`, `test`, and `build` for the monorepo                                                                                                        |

4. Name domain types with the binding vocabulary in `agents/002_VISION.md`. Its
   term Workspace is reserved, so call the pnpm grouping "the monorepo" in code
   and comments.
5. Record a new third-party dependency or a new package boundary under
   `docs/adrs/` before implementing it (`AGENTS.md`, rule 3); both are hard to
   reverse.

## The monorepo

| Kind    | Lives in                          | May depend on         | Owns                                                                       |
| ------- | --------------------------------- | --------------------- | -------------------------------------------------------------------------- |
| App     | `apps/ptlam-agent-os-api/`        | Features and packages | Bootstrap, the root module, configuration, operations, HTTP contract tests |
| Feature | `features/ptlam-agent-os-<name>/` | Packages only         | One product capability in the four layers behind one exported module       |
| Package | `packages/ptlam-agent-os-<name>/` | Packages only         | One reusable boundary with no product logic; flat `src/`                   |

Dependencies point one way: app to feature to package. A feature never depends
on another feature. [file-organization.md](references/file-organization.md) owns
the tree; [composition.md](references/composition.md) owns how the app joins
features.

## Run the monorepo

Run from `src/api`:

```bash
pnpm install                          # after adding a package or a dependency
pnpm --filter <package-name> test     # one package
pnpm --filter <package-name> build    # rebuild a dependency while the app watches
pnpm typecheck && pnpm quality:check  # before the affected package's tests
pnpm check                            # the full gate
```

Biome's `useImportType` flags a runtime class import that appears only in a
constructor signature. Suppress it on that line with the reason the existing
controllers use:

```typescript
// biome-ignore lint/style/useImportType: NestJS needs this runtime value for emitted constructor metadata.
import { AppService } from "./app.service.js";
```

## Pick a reference

| Concern                                                                                | Reference                                               |
| -------------------------------------------------------------------------------------- | ------------------------------------------------------- |
| Creating an app, feature, or package; placing a file; deciding what a package exports  | [file-organization.md](references/file-organization.md) |
| Composing the root module, or letting one feature reach another                        | [composition.md](references/composition.md)             |
| Choosing a test level, or placing and running a test                                   | [testing.md](references/testing.md)                     |
| Layers, use cases, module API, providers, enhancers, lifecycle, transports, operations | The loaded NestJS skill                                 |

## Finish

Finish when the touched code satisfies its reference, every dependency follows
the app-to-feature-to-package direction, changed code adds no cycle, the
affected entry-point test passes, and `pnpm check` passes or every skipped gate
is named in the handoff.
