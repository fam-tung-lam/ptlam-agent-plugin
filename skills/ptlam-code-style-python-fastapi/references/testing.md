# FastAPI Testing

ASGI mechanics underneath the test standard owned by `ptlam-code-style` and the
pytest mechanics owned by `ptlam-code-style-python`.

Exercise the assembled application through its HTTP boundary. Assert the exact
status, response body, important headers, authentication result, and externally
observable database or job effect. Keep service and repository edge cases at
their cheaper Python test level.

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
  `TestClient` or the installed transport's
  `raise_app_exceptions=False` equivalent.

The official [async test](https://fastapi.tiangolo.com/advanced/async-tests/)
and [lifespan test](https://fastapi.tiangolo.com/advanced/testing-events/)
guides own current client behavior.

## Isolate request dependencies

Override the exact dependency callable stored in `app.dependency_overrides`.
Install the override in a fixture. In `finally`, restore that key's previous
value or delete only that key so the test preserves overrides it did not own.

Keep the assembled router, validation, dependency graph, exception handlers,
and middleware real. Apply the foundation's test-double rule at external
effects exposed through the selected dependency or application seam.

Cover success, malformed and boundary input, missing authentication, denied
authorization, mapped domain failure, and unexpected external failure when the
change can produce them. For a queued operation, assert the durable handoff and
payload instead of running the worker inside every endpoint test.

Inspect `app.openapi()` or its served document when a public operation changes.
Assert the affected path, schema, security requirement, and status without
snapshotting unrelated generated output.

Finish when the test would fail for a broken HTTP contract, all overrides and
resources are cleaned up, and no uncontrolled service leaves the process.
