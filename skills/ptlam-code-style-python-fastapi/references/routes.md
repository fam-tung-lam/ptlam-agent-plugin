# FastAPI Routes and HTTP Contracts

The typed HTTP surface: canonical paths, request data, response data, status,
and OpenAPI metadata.

## Compose the URL once

Give each feature one `APIRouter` in `presentation/http/controller.py`. Split it
into `presentation/http/v1.py`, `presentation/http/v2.py`, and later versions
only when a second public version exists. Declare each shared prefix and tag
either on that router or where a parent includes it, never at both levels.
Attach the API version once near the application boundary.

For the root operation of an already-prefixed router, use `""` unless the API
contract intentionally includes a trailing slash. Test canonical paths with
redirect following disabled so an accidental 307 does not pass invisibly.

## Make the signature the contract

- Type every path, query, header, cookie, and body parameter.
- Use `Annotated` with `Path`, `Query`, `Header`, or `Body` when the transport
  needs constraints, aliases, or documentation beyond the Python type.
- Group cohesive query fields in a Pydantic query model when the installed
  FastAPI version supports the intended binding.
- Declare the response through a precise return type or `response_model`. Choose
  `response_model` when the runtime object differs from the public DTO. Never
  expose an ORM object or internal field accidentally.
- Set a non-default success status with `fastapi.status`. A 204 response carries
  no body.
- Reuse the API's stable error model and declare each promised non-success
  status and body with `responses=` or the repository's central OpenAPI
  customization. Raising `HTTPException` alone does not document that DTO.
- Attach one realistic payload to each request and response DTO through
  `model_config` `json_schema_extra` or `openapi_examples`, so the generated
  documentation shows a concrete example beside the type.

FastAPI validates, documents, serializes, and filters a declared response. The
[response model guide](https://fastapi.tiangolo.com/tutorial/response-model/)
identifies the framework feature; it is not required reading. When installed
behavior differs, inspect the locked packages and assert the local response and
OpenAPI contract.

Read raw request bytes only when the protocol requires the exact bytes, such as
a signed webhook. Authenticate the raw body before parsing it and document why
normal typed-body validation is intentionally deferred.

## Bound every collection operation

Give a list endpoint an explicit page size with a default and a maximum, a
deterministic sort, and the filters the caller actually needs. Return the paging
state the client needs to request the next page.

Add these when the endpoint is created. Retrofitting paging onto a published
`GET /items` that returned everything is a breaking change for every consumer
that already depends on the full list.

## Make a repeated write safe

A mobile client, a proxy, or an operator will send the same write twice. Accept
an idempotency key, or derive one from the operation's natural key, and return
the original result for the repeat instead of creating a second row, charge, or
message.

Declare the key in the signature like any other input, and record which
operations promise it in the API contract.

## Delegate one operation

A handler parses transport input, calls one injected use case, and shapes the
declared response. It imports no repository, session, SQLAlchemy object, or
integration client. Map a multi-field body to an application DTO or command;
pass a single path or query value directly when that is the complete operation
input.

Finish when the canonical URL does not redirect, input and output DTOs hide
internal data, every collection response is paged and ordered, a repeated write
produces one effect, and OpenAPI records the intended status and error contract.
