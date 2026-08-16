# FastAPI Routes and HTTP Contracts

The typed HTTP surface: canonical paths, request data, response data, status,
and OpenAPI metadata.

## Compose the URL once

Give each feature or capability one `APIRouter`. Declare each shared prefix and
tag either on that router or where a parent includes it, never at both levels.
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
- Declare the response through a precise return type or `response_model`.
  Choose `response_model` when the runtime object differs from the public
  schema. Never expose an ORM object or internal field accidentally.
- Set a non-default success status with `fastapi.status`. A 204 response carries
  no body.
- Reuse the API's stable error model and declare each promised non-success
  status and body with `responses=` or the repository's central OpenAPI
  customization. Raising `HTTPException` alone does not document that schema.

FastAPI validates, documents, serializes, and filters a declared response. The
official [response model guide](https://fastapi.tiangolo.com/tutorial/response-model/)
owns the current details.

Read raw request bytes only when the protocol requires the exact bytes, such as
a signed webhook. Authenticate the raw body before parsing it and document why
normal typed-body validation is intentionally deferred.

Finish when the canonical URL does not redirect, input and output schemas hide
internal data, and OpenAPI records the intended status and error contract.
