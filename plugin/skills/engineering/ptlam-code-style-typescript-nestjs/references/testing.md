# NestJS Testing

How tests add a Nest container or application only when framework behavior is
part of the contract.

## Choose the cheapest truthful level

| Level               | Use it to prove                                                               |
| ------------------- | ----------------------------------------------------------------------------- |
| Behavioral unit     | Domain and use-case behavior with ordinary construction and test doubles      |
| Module              | Provider tokens, exports, scopes, factories, overrides, and lifecycle wiring  |
| Application context | Standalone lookup, entry-shell wiring, startup, and cleanup                   |
| Application         | Global enhancers, configuration, routing, serialization, and shutdown         |
| Runner integration  | Queue, schedule, event, or CLI discovery and dispatch under its chosen runner |
| Entry point         | A transport or standalone contract under its real Nest seam                   |

Never create a `TestingModule` for a class you can construct directly. Use
`@nestjs/testing` only when container behavior is the subject or the assembled
module is the practical boundary.

## Exercise the real container seam

Build the narrowest module that owns the behavior. Override an external adapter
by its public token before `compile()`. Keep controllers, pipes, guards,
interceptors, filters, and serialization real in an application contract test.

Make a global enhancer overridable by registering its class as a provider and
binding the matching `APP_*` token with `useExisting`. Override the class token
in the test; never replace framework internals.

Use `get` for singleton providers. Use `resolve` for request or transient
providers, and supply one context ID when several resolutions must share a
request subtree. Use module selection with strict lookup when repeated dynamic
modules expose more than one instance.

Call `init()` before exercising an application. Apply the same composition
function production uses for any globals modules do not register. Close every
`TestingModule`, context, application, and microservice in `finally` or suite
cleanup, including after a failed setup.

## Test the chosen entry point

Use the HTTP adapter's supported harness. Exercise Express through its HTTP
server. Initialize Fastify until its instance is ready, then prefer its inject
mechanism. Assert the canonical path without redirect following, the exact
status, headers, body, validation failures, authentication, authorization,
mapped domain failure, and the relevant persisted or queued effect.

For GraphQL, assert the served schema operation and response envelope. For a
gateway, test the connection and the configured reply behavior: callback
acknowledgement when the adapter supports it, an emitted `WsResponse` or
response event for the native WebSocket adapter, or no reply for a one-way
event. For a microservice, test the pattern, serialized payload, response or
event behavior, and the broker's acknowledgement or retry seam. A hybrid
application test proves whether main-app global enhancers reach the connected
transport.

For a queue processor, assert the job name, validated payload, use-case call,
acknowledgement or failure, retry boundary, and repeat-safe effect through the
configured integration. For a schedule or event, start the narrowest runner
seam, let it find the registered shell, control its clock or trigger, and prove
dispatch and overlap or delivery policy. A direct shell test proves only its
isolated behavior, not runner registration.

Invoke a runner-managed CLI through its supported runner so the test keeps that
runner's context and dispatch contract. For a finite standalone command, create
the context, select the owning module strictly when needed, run the command,
assert its exit-facing result and effect, then close the context. Do not expect
HTTP enhancers to wrap a provider resolved straight from a context.

Inspect generated OpenAPI when an HTTP contract changes. Assert only the
affected paths, schemas, security requirements, and responses, so unrelated
generator ordering does not make the test brittle.

Run the configured test runner and type check. An entry-point test does not
replace cheaper failure and boundary cases at the behavioral level.

Finish when each test proves one framework or behavior contract at the cheapest
level, overrides enter through public tokens, the real adapter, transporter,
runner, or context proves its differences, and every Nest resource closes.
