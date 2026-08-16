# FastAPI Error Boundaries

How Python failures become one stable HTTP response without framework coupling
below the boundary. The Python skill owns exception chaining and logging
mechanics.

Let domain and infrastructure code raise their own typed failures. Map them
once in a route only when the mapping is local, or in a registered exception
handler when several operations share it. Keep `HTTPException` in routes and
dependencies; do not make the domain import FastAPI to report an HTTP status.

Choose validation and domain status codes from the existing API contract.
FastAPI's default validation status is not permission to change a service that
deliberately standardized another one. Assert one exact status in tests rather
than accepting several.

## Preserve a safe envelope

- Return one documented error shape with stable machine-readable meaning.
- Distinguish authentication, authorization, absence, conflict, invalid input,
  throttling, and unavailable dependencies when callers can act differently.
- Do not return tracebacks, SQL, internal class names, credentials, or raw
  upstream payloads.

Route an unexpected exception to the application's outer error capture and
return the stable 500 envelope. Keep request correlation on the captured event
and out of the public body.

An exception handler takes the precise exception type and returns a declared
`Response`. Middleware that observes the result must not replace its status,
headers, or body accidentally.

Finish when every promised failure maps once to an exact status and body, while
unexpected failures retain diagnostic context without exposing it to callers.
