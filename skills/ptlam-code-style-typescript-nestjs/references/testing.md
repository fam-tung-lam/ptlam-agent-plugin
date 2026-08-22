# NestJS Testing

How tests add a Nest container or application only when framework behavior is
part of the contract.

## Choose the cheapest truthful level

| Test level      | Use it to prove                                                              |
| --------------- | ---------------------------------------------------------------------------- |
| Behavioral unit | Domain and application behavior with ordinary construction and test doubles  |
| Module          | Provider tokens, exports, scopes, factories, overrides, and lifecycle wiring |
| Application     | Global enhancers, configuration, routing, serialization, and shutdown        |
| Transport       | The public protocol contract under the real adapter or transporter           |

Do not create a `TestingModule` for a class that can be constructed directly.
Use `@nestjs/testing` only when the container behavior is the subject or the
assembled module is the practical boundary.

## Exercise the real container seam

Build the narrowest module that owns the behavior. Override an external adapter
by its public token before `compile()`. Keep controllers, pipes, guards,
interceptors, filters, and serialization real in an application contract test.

Make a global enhancer overridable by registering its class as a provider and
binding the matching `APP_*` token with `useExisting`. Override the class token
in the test; do not replace framework internals.

Use `get` for singleton providers. Use `resolve` for request or transient
providers and supply one context ID when multiple resolutions must share a
request subtree. Use module selection with strict lookup when repeated dynamic
modules expose more than one instance.

Call `init()` before exercising an application. Apply the same composition
function production uses for any globals not registered by modules. Close every
`TestingModule`, application context, Nest application, and microservice in
`finally` or suite cleanup, including a failed setup after acquisition.

## Test the selected transport

Use the HTTP adapter's supported harness. Exercise Express through its HTTP
server. Initialize Fastify until its instance is ready, then prefer its inject
mechanism. Assert the canonical path without redirect following, exact status,
headers, body, validation failures, authentication, authorization, mapped domain
failure, and relevant persisted or queued effect.

For GraphQL, assert the served schema operation and response envelope. For a
gateway, test connection and event acknowledgement through the configured
adapter. For a microservice, test the pattern, serialized payload, response or
event behavior, and broker-specific acknowledgement or retry seam. A hybrid
application test proves whether main-app global enhancers reach the connected
transport.

Inspect generated OpenAPI when an HTTP contract changes. Assert only affected
paths, schemas, security requirements, and responses so unrelated generator
ordering does not make the test brittle.

Run the configured test runner and type check. A transport test does not replace
the cheaper failure and boundary cases at the behavioral level.

Finish when each test proves one framework or behavior contract at the cheapest
level, overrides enter through public tokens, the real adapter or transporter
proves its differences, and every Nest resource closes.
