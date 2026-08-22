# PTLam NestJS Code Style

Conventions for the NestJS boundary of a TypeScript application: feature
modules, dependency injection, application composition, execution pipelines,
transport contracts, persistence handoffs, observability, health, and Nest
tests. This skill owns NestJS mechanics only.

<!-- PLUGIN-COMPILER:REQUIRED-SKILLS -->

## Before the first edit

1. Resolve the application root and read every applicable `AGENTS.md`.
2. Read `package.json`, the lockfile, `nest-cli.json`, the covering TypeScript
   configuration, the bootstrap file, the root module, test configuration, and
   CI. Record the installed `@nestjs/*` versions, runtime adapter, transports,
   validation integration, API-description integration, and real commands.
3. Map the module import graph. Trace one inbound operation through middleware,
   guards, interceptors, pipes, the controller or handler, application
   providers, persistence, and exception translation.
4. Record provider tokens and scopes, global enhancers, request-context
   propagation, transaction owners, lifecycle hooks, health checks, and each
   application or testing close path.
5. Treat the locked packages and verified runtime behavior as the mechanic.
   Apply current rules to changed code without reorganizing unrelated legacy
   code.

For a new application, select the current stable Nest major, keep official Nest
packages on compatible majors, and use a Node runtime that satisfies their
declared engine. Preserve an existing supported major until migration is in
scope.

## Pick a reference

| Concern                                                                                      | Reference                                                       |
| -------------------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| Creating or changing a feature module, facade, import edge, dynamic module, or project shape | [modules-and-features.md](references/modules-and-features.md)   |
| Constructing the app, loading configuration, or managing startup and shutdown                | [application-lifecycle.md](references/application-lifecycle.md) |
| Declaring an HTTP, GraphQL, WebSocket, or microservice contract                              | [transport-contracts.md](references/transport-contracts.md)     |
| Placing middleware, a guard, interceptor, pipe, or exception filter                          | [execution-pipeline.md](references/execution-pipeline.md)       |
| Choosing a provider token or scope, carrying context, or breaking a DI cycle                 | [providers-and-context.md](references/providers-and-context.md) |
| Wiring persistence, transactions, remote effects, logging, metrics, or health                | [operations.md](references/operations.md)                       |
| Testing domain behavior, module wiring, an application, global enhancers, or a transport     | [testing.md](references/testing.md)                             |

## Apply the Nest boundary

1. State the observable transport contract and identify its adapter or
   transporter before changing framework code.
2. Put the operation in one feature module. Export only the narrow facade or
   token another module consumes.
3. Keep controllers and message handlers at the transport boundary. Delegate
   business behavior and transaction decisions to injected application
   providers.
4. Attach the project's one runtime validator through a pipe. Keep accepted
   coercions, rejected fields, metadata, and generated API contracts aligned.
5. Register cross-cutting enhancers through the Nest container when they need
   dependencies. Make their order and transport reach explicit.
6. Keep providers singleton-scoped unless a measured lifetime requirement
   justifies another scope. Account for every request-scope bubble.
7. Start and stop resources through the application lifecycle. Enable and test
   graceful shutdown for long-running hosts that receive termination signals.
8. Test domain behavior without a Nest container. Add container, application,
   and transport tests only for the Nest behavior each level can prove.
9. Run focused tests, the configured type and code checks, affected module or
   application tests, public contract checks, then the project-wide gates.

## Finish

Finish when changed code adds no module cycle and leaves any touched legacy
cycle with an explicit removal seam, provider visibility and scopes are
intentional, every inbound contract is validated once, global enhancers reach
the intended transports in a verified order, transactions and durable effects
have one owner, shutdown closes every resource, and the affected Nest tests pass
under the real adapter or transporter.
