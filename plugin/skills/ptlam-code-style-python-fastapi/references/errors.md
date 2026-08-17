# FastAPI Error Boundaries

How application failures become one stable HTTP response without framework
coupling below the boundary.

Keep each feature's domain failures in its `exceptions.py` and export only the
ones another feature may handle. Install their HTTP mappings once through
registered exception handlers in `app.py`. Keep `HTTPException` in routes and
dependencies for transport-local failures; do not make a use case, repository,
or entity import FastAPI to report a status.

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
