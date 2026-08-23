# NestJS Transport Contracts

How controllers and handlers expose application behavior without leaking one
adapter or transporter into the core.

## Keep the entry point thin

A controller, resolver, gateway, or message handler owns transport metadata,
input extraction, authentication context, invocation, and output mapping. It
does not query persistence, commit a transaction, or construct an integration
client. Pass ordinary validated values to one injected use case.

State each operation's identity, input, success output, failure output,
authentication, authorization, and retry or delivery semantics. Use the
transport's own vocabulary:

| Transport    | Contract evidence                                                                |
| ------------ | -------------------------------------------------------------------------------- |
| HTTP         | Method, canonical path, status, headers, body, errors, and OpenAPI               |
| GraphQL      | Schema field, arguments, result or union, context, and resolver error            |
| WebSocket    | Event name, payload, acknowledgement, emitted error, and connection context      |
| Microservice | Pattern, request-response or event semantics, serializer, acknowledgement, retry |

Keep transport-specific exceptions and context objects at this boundary. Switch
`ArgumentsHost` or `ExecutionContext` to the verified transport before reading
its request, response, client, payload, or metadata.

## Attach one input contract

Use the project's one selected runtime validator. This layer owns how its schema
reaches Nest pipes and runtime metadata.

For a class-validator project, use concrete DTO classes because interfaces and
type-only imports do not survive for reflection. Install a global
`ValidationPipe` with `whitelist: true`. Choose `forbidNonWhitelisted`
deliberately from the public contract. Enable `transform` only with tested
coercions; prefer explicit parse pipes for path and query scalars over broad
implicit conversion.

For a schema-first project, derive the TypeScript type from its one schema and
attach that schema through one Nest pipe or maintained integration. Do not add
class-validator decorators beside it. Make OpenAPI metadata come from the same
schema integration when supported, or add explicit transport metadata without
creating a second validation contract.

Validate nested values, arrays, query strings, path values, headers, message
payloads, and configuration at the boundary that first accepts them. Map a
validator failure to the transport's stable error envelope without exposing the
raw rejected payload.

## Preserve transport differences

Prefer Nest response handling and return values over injecting the native HTTP
response. Use the native response only when streaming, cookies, raw bodies, or
another adapter-specific protocol feature requires it. Keep that code and its
types behind the adapter boundary.

Generate OpenAPI from the assembled HTTP application. Assert changed paths,
operation identifiers, security, parameters, request and response schemas, and
every promised status. Supply explicit metadata for unions, generics, arrays,
and DTOs that reflection cannot recover.

For microservices, use message patterns for request-response and event patterns
for one-way events. Record broker-specific delivery, acknowledgement, ordering,
and retry behavior; a Nest abstraction does not make those guarantees portable.
Make consumers idempotent when delivery can repeat. In a hybrid application,
verify whether global pipes, guards, interceptors, and filters are inherited by
each connected microservice.

Finish when the public contract matches generated or served metadata, invalid
input fails once, adapter-specific APIs stay at the boundary, and transport
tests prove the selected protocol semantics.
