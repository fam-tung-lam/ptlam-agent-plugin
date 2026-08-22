# NestJS Modules and Feature Boundaries

How a Nest application turns business capabilities into an explicit module
graph. Preserve one coherent existing layout. Use this feature-first default
when no stronger project structure exists.

## Give each feature one module

Keep a small application flat until a second business capability makes a feature
directory useful. A grown service normally has this shape:

```text
src/
├── main.ts
├── app.module.ts
├── operations/
│   ├── operations.controller.ts
│   └── operations.module.ts
└── orders/
    ├── orders.module.ts
    ├── orders.controller.ts
    ├── orders.service.ts
    ├── orders.tokens.ts
    ├── dto/
    ├── domain/
    └── infrastructure/
```

`AppModule` composes configuration, infrastructure, operations, and feature
modules. It owns no feature behavior. A feature module registers its controllers
and providers, imports modules whose exported contracts it needs, and exports
only its public facade or stable injection tokens.

Keep transport DTOs separate from persistence entities and domain values. Add
`shared/` or `common/` only for a framework-neutral concept with multiple proven
consumers. Never use either as a destination for unowned helpers.

## Make the module API narrow

| Module field  | Meaning                                                      |
| ------------- | ------------------------------------------------------------ |
| `imports`     | Modules whose exported providers this module consumes        |
| `controllers` | Transport entry points owned by this module                  |
| `providers`   | Providers constructed in this module's container scope       |
| `exports`     | The deliberate public surface available to importing modules |

Import the owning module instead of registering its service again. Duplicate
provider registration creates another instance and bypasses the module's
configuration. Keep global modules rare; explicit imports make dependencies and
tests visible.

Use a dynamic module for reusable infrastructure that needs consumer-supplied
configuration. Prefer `ConfigurableModuleBuilder` over hand-maintained
`register` and `registerAsync` variants. When one configured dynamic-module
instance must be shared, create its registration object once and reuse that same
reference; current Nest module identity follows object identity.

## Keep dependency direction acyclic

Controllers depend on application providers. Application providers depend on
domain contracts. Infrastructure implements those contracts and enters through
tokens. A feature reaches another feature through its exported facade, never
through its controller, persistence adapter, or internal provider.

Break a cycle by moving the orchestration to a caller, extracting a genuinely
shared policy, publishing a narrower token, or using an event handoff. Treat
`forwardRef()` and runtime `ModuleRef` lookup as migration tools for a cycle
that cannot yet be removed, not as the default design. Do not use barrel imports
between providers or modules when direct imports expose the real edge.

Finish when each provider has one registration owner, each cross-module
dependency enters an explicit export, global reach is exceptional, changed code
adds no cycle, and every touched legacy cycle has an explicit removal seam.
