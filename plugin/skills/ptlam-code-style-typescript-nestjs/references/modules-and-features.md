# NestJS Modules and Feature Boundaries

How a Nest backend turns feature ownership into an explicit module graph.
Preserve one coherent existing graph and apply these defaults to new or changed
modules.

## Give each feature one module

`AppModule` composes configuration, integrations, operations, and feature
modules. It owns no feature behavior. A feature module registers its controllers
or other entry shells, repository adapters, and use-case factories. It imports
modules whose exported contracts it needs and exports only its public use cases,
facade, or stable injection tokens.

The feature module is the dependency-assembly file for its capability. Shared
integration modules own reusable clients and pools; feature modules connect
those clients to feature repository adapters. Register an adapter once under the
token its use case consumes.

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
reference. Nest 11 and later distinguish dynamic-module definitions by object
reference. For an earlier supported major, inspect and verify its installed
identity behavior; reusing one registration object remains safe.

## Keep dependency direction acyclic

Entry shells depend on use cases. Use cases depend on domain contracts.
Repositories and integrations implement those contracts and enter through module
factories and tokens. A feature reaches another feature through its exported
facade, never through its controller, persistence adapter, or internal provider.

Break a cycle by moving the orchestration to a caller, extracting a genuinely
shared policy, publishing a narrower token, or using an event handoff. Treat
`forwardRef()` and runtime `ModuleRef` lookup as migration tools for a cycle
that cannot yet be removed, not as the default design. Do not use barrel imports
between providers or modules when direct imports expose the real edge.

## Verify the graph mechanically

Run the repository's architecture or dependency-graph check when one exists. For
a new backend, configure a CI check that rejects cycles, cross-feature internal
imports, entry-shell imports of repository adapters or integration clients, and
use-case imports of Nest transport packages.

When no checker exists, search changed controllers, resolvers, gateways,
handlers, processors, schedules, and CLI shells for repository and integration
imports. Search cross-feature imports for paths below the target feature's
public surface. Report the missing automated check instead of implying the graph
was proven mechanically.

Finish when each provider has one registration owner, each cross-module
dependency enters an explicit export, entry shells reach infrastructure only
through use cases, the graph check passes when configured, changed code adds no
cycle, and every touched legacy cycle has an explicit removal seam.
