# NestJS Modules and Feature Boundaries

How a Nest backend turns feature ownership into an explicit module graph. Keep
one coherent existing graph, and apply these defaults to new or changed modules.

## Give each feature one module

`AppModule` composes configuration, integrations, operations, and feature
modules. It owns no feature behavior. A feature module registers its controllers
or other presentation adapters, its infrastructure adapters, and its use-case
factories. It imports the modules whose exported contracts it needs, and exports
only its public use cases, facade, or stable tokens.

The feature module is the assembly file for its capability. Shared integration
modules own reusable clients and pools; feature modules connect those clients to
feature adapters. Register an adapter once, under the port token its use case
consumes.

## Keep the module API narrow

| Module field  | Meaning                                             |
| ------------- | --------------------------------------------------- |
| `imports`     | Modules whose exported providers this module uses   |
| `controllers` | Transport entry points this module owns             |
| `providers`   | Providers built in this module's container scope    |
| `exports`     | The deliberate public surface for importing modules |

Import the owning module instead of registering its service again. Duplicate
registration creates a second instance and bypasses the module's configuration.
Keep global modules rare; explicit imports make dependencies and tests visible.

Use a dynamic module for reusable infrastructure that needs consumer-supplied
configuration. Prefer `ConfigurableModuleBuilder` over hand-maintained
`register` and `registerAsync` variants. When one configured instance must be
shared, create its registration object once and reuse that reference: Nest 11
and later tell dynamic modules apart by object reference. For an earlier major,
check its installed behavior; reusing one object stays safe.

## Keep the dependency direction acyclic

Presentation adapters depend on use cases. Use cases depend on domain types and
application ports. Infrastructure adapters and integrations implement those
ports and enter through module factories and tokens. A feature reaches another
feature through its exported facade, never through its presentation or
infrastructure internals.

Break a cycle by moving the orchestration to a caller, extracting a genuinely
shared policy, publishing a narrower token, or handing off through an event.
Treat `forwardRef()` and runtime `ModuleRef` lookup as migration tools for a
cycle you cannot yet remove, not as the default. Do not use barrel imports
between providers or modules when direct imports show the real edge.

## Check the graph mechanically

Run the repository's architecture or dependency-graph check when one exists. For
a new backend, configure a CI check that rejects cycles, cross-feature internal
imports, presentation imports of infrastructure adapters or integration clients,
and application or domain imports of Nest packages.

With no checker, search changed presentation adapters for infrastructure and
integration imports, application and domain files for Nest imports, and
cross-feature imports for paths below the target's public surface. Report the
missing automated check instead of implying the graph was proven mechanically.

Finish when each provider has one registration owner, each cross-module
dependency enters an explicit export, presentation reaches infrastructure only
through use cases and ports, the graph check passes when configured, changed
code adds no cycle, and every touched legacy cycle has an explicit removal seam.
