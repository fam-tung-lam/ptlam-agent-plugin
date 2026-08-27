# FastAPI Error Boundaries

How an application failure becomes one stable HTTP response without coupling the
layers below to the framework.

Keep each feature's domain exception types under `domain/failures/` and export
only the ones another feature may handle. Install their HTTP mappings once
through registered exception handlers in `app.py`. Keep `HTTPException` in
presentation and dependency providers for transport-local failures; never make
application, domain, or infrastructure code import FastAPI to report a status.

Choose validation and domain status codes from the existing API contract.
FastAPI's default validation status is not permission to change a service that
deliberately standardized another one. Assert one exact status in tests rather
than accepting several.

## Keep the envelope safe

- Return one documented error shape with stable machine-readable meaning.
- Distinguish authentication, authorization, absence, conflict, invalid input,
  throttling, and unavailable dependencies when callers can act differently.
- Never return tracebacks, SQL, internal class names, credentials, or raw
  upstream payloads.

Send an unexpected exception to the application's outer error capture and return
the stable 500 envelope. Keep the request correlation on the captured event and
out of the public body.

An exception handler takes the exact exception type and returns a declared
`Response`. Middleware that observes the result must not replace its status,
headers, or body by accident.

Finish when every promised failure maps once to an exact status and body, while
unexpected failures keep their diagnostic context without exposing it to
callers.
