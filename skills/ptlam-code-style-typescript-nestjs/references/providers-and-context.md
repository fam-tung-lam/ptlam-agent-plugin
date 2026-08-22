# NestJS Providers and Request Context

How provider tokens, lifetimes, and contextual data move through the dependency
graph.

## Inject explicit contracts

Use constructor injection for required collaborators. Mark injected references
`private readonly` when the class owns no public exposure or reassignment.
Inject concrete local providers by class. Use an exported symbol or established
token for an interface, external adapter, configured value, or replaceable
implementation; keep the token in a dependency-light file.

Register one of `useClass`, `useValue`, `useFactory`, or `useExisting` according
to who owns construction. Give an async factory precise dependencies and let
bootstrap fail if it cannot create a required provider. Use `useExisting` when
an alias and its original token must resolve to the same instance, including a
global enhancer that tests need to override by its class token.

Do not use the service locator as ordinary injection. Limit `ModuleRef` to
framework extension points or migration seams that genuinely resolve a runtime
token. Use `get` for static providers and `resolve` with the correct context ID
for scoped providers.

## Choose the narrowest necessary scope

| Scope     | Choose when                                                             | Cost to account for                                  |
| --------- | ----------------------------------------------------------------------- | ---------------------------------------------------- |
| Singleton | The default; the provider is safe to share across operations            | Mutable state must be concurrency-safe               |
| Request   | State is unique to one request or message and cannot be passed directly | Scope bubbles to consumers and adds per-request work |
| Transient | Each injecting consumer truly needs its own instance                    | Construction repeats per consumer                    |

Measure before introducing request scope. A request-scoped provider makes its
dependent controller and upstream providers request-scoped. Never put a shared
database pool, SDK client, schema, or stateless service in request scope.

Prefer passing a typed principal, tenant, correlation identifier, or transaction
explicitly into the application operation. When ambient context is required
across many calls, populate one context carrier at the transport edge and expose
only the typed values consumers need. Use the protocol's real request, GraphQL
context, gateway client, or job reference; an HTTP request type is not portable
across transports.

Gateways must remain singleton-scoped. A request-scoped gateway cannot be tied
to one request because it owns long-lived sockets. Application lifecycle hooks
also do not run on request-scoped providers.

## Keep scope and cycles testable

Retrieve singleton providers with `get`. Retrieve request or transient providers
with `resolve`, reusing one context ID only when the test needs one DI subtree.
Register a representative request payload for a manually created context before
resolving a provider that consumes it.

Treat a new `forwardRef()` as a design finding. Prefer an orchestrator, narrow
facade, application event, or extracted policy that restores one dependency
direction. When a migration temporarily keeps the cycle, prevent constructor
logic from depending on indeterminate instantiation order and record the seam
that removes it.

Finish when every token has one construction owner, scope follows measured
lifetime, contextual data uses the correct protocol, singleton state is safe,
and the provider graph has no new cycle.
