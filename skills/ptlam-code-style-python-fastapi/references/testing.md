# FastAPI Testing

ASGI test mechanics for an assembled FastAPI application.

Exercise the assembled application through its HTTP boundary. Assert the exact
status, response body, important headers, authentication result, and externally
observable database or job effect. Keep service and repository edge cases at
their cheaper Python test level.

## Mirror capability ownership

For the default new-service layout, place use-case tests under
`tests/<feature>/unit/usecases/` and real repository or router collaboration
tests under `tests/<feature>/integration/`. Put fixtures owned by one feature in
that feature's `conftest.py`.

Put composed application, lifespan, and unversioned operations tests under
`tests/app/integration/`. Keep a reusable test double at the nearest common
feature and test-level scope. Use pytest markers for suite selection when the
repository configures them; markers do not replace the ownership expressed by
the test tree.

Placement is the only architecture rule here. The active testing contract owns
what each level proves. Preserve a coherent established test root and leave
unrelated tests in place.

## Select the client

- Use `TestClient` as a context manager for synchronous pytest tests so the app
  lifespan runs.
- Use the repository-supported async ASGI client and transport when the test
  must await other async collaborators. HTTPX or httpx2 names and compatibility
  belong to the installed FastAPI and Starlette versions. Arrange lifespan
  explicitly because a bare transport might not start it.
- Disable redirect following when testing a canonical path or trailing-slash
  policy.
- Leave application-exception propagation enabled for ordinary tests. Only when
  asserting the outer 500 envelope, use `raise_server_exceptions=False` on
  `TestClient` or the installed transport's `raise_app_exceptions=False`
  equivalent.

The official [async test](https://fastapi.tiangolo.com/advanced/async-tests/)
and [lifespan test](https://fastapi.tiangolo.com/advanced/testing-events/)
guides own current client behavior.

## Isolate request dependencies

Override the exact dependency callable stored in `app.dependency_overrides`.
Install the override in a fixture. In `finally`, restore that key's previous
value or delete only that key so the test preserves overrides it did not own.

Keep the assembled router, validation, dependency graph, exception handlers, and
middleware real. Replace external effects only through the selected dependency
or application seam.

Cover success, malformed and boundary input, missing authentication, denied
authorization, mapped domain failure, and unexpected external failure when the
change can produce them. For a queued operation, assert the durable handoff and
payload instead of running the worker inside every endpoint test.

Inspect `app.openapi()` or its served document when a public operation changes.
Assert the affected path, schema, security requirement, and status without
snapshotting unrelated generated output.

Finish when the test would fail for a broken HTTP contract, all overrides and
resources are cleaned up, and no uncontrolled service leaves the process.
