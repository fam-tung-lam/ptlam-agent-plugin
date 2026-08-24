# PTLam NestJS Code Style

Conventions for the NestJS boundary of a TypeScript backend: feature-first
hexagonal structure, use cases, modules, dependency injection, application
composition, entry points, persistence handoffs, integrations, observability,
health, and Nest tests. This skill owns NestJS mechanics only.

<!-- PLUGIN-COMPILER:REQUIRED-SKILLS -->

## Before the first edit

1. Resolve the application root and read every applicable `AGENTS.md`.
2. Read `package.json`, the lockfile, the workspace and Nest CLI configuration
   when present, the covering TypeScript configuration, each runnable entry
   point, the root module, test configuration, and CI. Record the installed
   `@nestjs/*` versions, runtime adapters, transports, workers, validation and
   API-description integrations, decorator and metadata transform, reflection
   bootstrap, and real commands.
3. Map the source and test tree and the module import graph. Trace one operation
   from its controller, resolver, gateway, message handler, processor, schedule,
   or CLI shell through one use case, repository or integration port, resource,
   exception translation, and tests.
4. Record provider tokens and scopes, global enhancers, request-context
   propagation, transaction owners, lifecycle hooks, health checks, and each
   application or testing close path.
5. Treat the locked packages and verified runtime behavior as the mechanic.
   Apply current rules to changed code without reorganizing unrelated legacy
   code.

For a new application, select the current stable Nest major, keep official Nest
packages on compatible majors, and pin the latest Node LTS that satisfies their
declared engine. With the official TypeScript legacy decorator pipeline, enable
`experimentalDecorators` and `emitDecoratorMetadata` in the configuration that
builds and runs Nest code. Install and load `reflect-metadata` before bootstrap,
or verify the selected compiler and runtime's equivalent integration. Preserve
an existing supported runtime and Nest major until migration is in scope.

## Pick a reference

| Concern                                                                                 | Reference                                                       |
| --------------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| Starting or reorganizing the backend, a feature, integrations, or the test tree         | [file-organization.md](references/file-organization.md)         |
| Designing a use case or enforcing the entry-to-use-case-to-repository pipeline          | [use-cases.md](references/use-cases.md)                         |
| Changing a feature module, public facade, import edge, dynamic module, or module graph  | [modules-and-features.md](references/modules-and-features.md)   |
| Constructing an application or worker, loading configuration, or managing its lifecycle | [application-lifecycle.md](references/application-lifecycle.md) |
| Declaring an HTTP, GraphQL, WebSocket, or Nest microservice contract                    | [transport-contracts.md](references/transport-contracts.md)     |
| Placing middleware, a guard, interceptor, pipe, or exception filter                     | [execution-pipeline.md](references/execution-pipeline.md)       |
| Choosing a provider token or scope, carrying context, or breaking a DI cycle            | [providers-and-context.md](references/providers-and-context.md) |
| Wiring persistence, transactions, remote effects, logging, metrics, or health           | [operations.md](references/operations.md)                       |
| Testing behavior, module wiring, an application context, worker, or transport           | [testing.md](references/testing.md)                             |

## Apply the Nest boundary

1. State the observable entry-point contract. Identify the adapter or
   transporter for a network operation; for a job, schedule, event, or CLI,
   state its trigger, input, result or effect, retry behavior, and concurrency.
2. Put the operation in one feature module. Keep its application DTOs, ports,
   and use cases; domain types; infrastructure adapters; presentation shells;
   and tests under that feature.
3. Keep every entry shell at its trigger boundary. Delegate one operation and
   its transaction decision to one injected use case.
4. Validate external input once with the project's runtime validator. Attach it
   through a pipe for a Nest execution pipeline; invoke the same contract at a
   queue, schedule, event, or CLI shell dispatched by its selected runner. A
   custom standalone host resolves its shell from an application context. Keep
   accepted coercions, rejected fields, metadata, and public contracts aligned.
5. Register cross-cutting enhancers through the Nest container when they need
   dependencies. Make their order and transport reach explicit.
6. Keep providers singleton-scoped unless a measured lifetime requirement
   justifies another scope. Account for every request-scope bubble.
7. Start and stop resources through the application lifecycle. Enable and test
   graceful shutdown for long-running hosts that receive termination signals.
8. Test domain and use-case behavior without a Nest container. Add module,
   runner-integration, application-context, application, and transport tests
   only for the Nest behavior each level can prove.
9. Run focused tests, the configured type and code checks, affected module or
   application tests, public contract checks, then the project-wide gates.

## Finish

Finish when the feature tree exposes one familiar
entry-to-use-case-to-repository path, changed code adds no module cycle and
leaves any touched legacy cycle with an explicit removal seam, provider
visibility and scopes are intentional, every inbound contract is validated once,
transactions and durable effects have one owner, shutdown closes every resource,
and affected tests pass under the real adapter, transporter, worker seam, or
application context.
