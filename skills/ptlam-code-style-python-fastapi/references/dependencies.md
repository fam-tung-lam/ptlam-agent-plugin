# FastAPI Dependencies

How request-scoped capabilities, cleanup, authentication, and authorization
enter the HTTP boundary.

Declare a dependency as a typed callable. Prefer
`Annotated[T, Depends(provider)]`; store that annotation in a named alias when
several handlers consume the same capability. Pass the callable to `Depends`
without calling it.

Dependencies own framework concerns such as an authenticated principal, a
request database session, settings, correlation context, and an external client
borrowed for the request. Application and domain code receive ordinary typed
arguments and never import `Depends`.

## Own cleanup with yield

A dependency that acquires a resource yields once. Put cleanup in `finally` or
inside its context manager. Roll back a failed transaction when this dependency
owns that policy, then close the session on every exit.

Select sync or async dependency syntax from the resource API. Match any
dependency scope option to the installed FastAPI version and the response
lifetime; streaming responses can outlive the handler return.

The official [dependency](https://fastapi.tiangolo.com/tutorial/dependencies/)
and [yield dependency](https://fastapi.tiangolo.com/tutorial/dependencies/dependencies-with-yield/)
guides own current caching, scope, and teardown behavior.

## Fail closed

Authenticate in one dependency and return a typed principal or credential
context. Authorize as close as possible to the protected operation. Distinguish
missing or invalid authentication from an authenticated caller lacking
permission according to the API's stable 401 and 403 contract.

Attach the authentication scheme's required `WWW-Authenticate` header to a 401.
When OAuth scopes are part of the public contract, declare them with `Security`
and enforce the requested scopes in the owning dependency.

Use a decorator dependency for a guard whose value no handler needs, or prefix
an injected guard parameter with `_` when the project prefers visible
signatures. Do not read credentials again inside the service.

Finish when each request-scoped capability has one provider, one cleanup path,
and an exact dependency callable that a test can override.
