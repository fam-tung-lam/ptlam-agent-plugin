---
name: ptlam-code-style-python-fastapi
description:
  Write, review, and fix FastAPI application code against conventions for
  application lifespan, routes, request and response contracts, dependency
  injection, concurrency, service boundaries, errors, observability, and API
  tests. Use when adding or changing FastAPI endpoints, dependencies, exception
  handlers, middleware, schemas, background handoffs, or tests, or fixing
  OpenAPI and runtime failures. Apply ptlam-code-style-python first for the
  Python mechanics. Do not use for Python services that do not use FastAPI.
---

# PTLam FastAPI Code Style

Conventions for the FastAPI boundary of a Python service: application lifespan,
router composition, HTTP contracts, dependencies, concurrency, domain seams,
errors, observability, and API tests. This skill owns FastAPI mechanics only;
Python and the language-neutral foundation own everything underneath them.

## Required skills

### `ptlam-code-style-python`

**Reason:** Provides the Python language, data-model, concurrency, exception, and pytest mechanics underneath the FastAPI boundary.

**Instructions:** Read and apply ptlam-code-style-python first; it loads
ptlam-code-style as its own foundation.
Let Python own the interpreter and toolchain, modules, imports,
typing, general async work, Pydantic, exception mechanics, docstrings,
logging, and pytest.
Use this skill only for FastAPI application, HTTP, dependency,
lifecycle, and ASGI test mechanics.
This specialization may be stricter than Python, never looser.

Read [ptlam-code-style-python](skills/ptlam-code-style-python/SKILL.md).

## Before the first edit

1. Resolve the service root and read every applicable `AGENTS.md`.
2. Read `pyproject.toml`, the lockfile, and the application entry point. Record
   the installed FastAPI, Starlette, and Pydantic versions and whether each
   database, HTTP, storage, and queue client is synchronous or asynchronous.
3. Trace one request through router inclusion, dependencies, the handler,
   application or service code, persistence, exception handlers, middleware,
   and tests. Give every prefix, resource, transaction, and error translation
   one owner.
4. Treat working configuration and verified implementation as evidence. Do not
   turn an incidental legacy pattern into a rule or weaken the Python skill to
   match it.

## Pick a reference

| Concern | Reference |
| --- | --- |
| Constructing the app, startup and shutdown, settings, routers, or middleware | [application.md](references/application.md) |
| Declaring a path, request input, response output, status, or OpenAPI operation | [routes.md](references/routes.md) |
| Injecting authentication, a session, request context, or another capability | [dependencies.md](references/dependencies.md) |
| Choosing `def`, `async def`, streaming, or a background handoff | [concurrency.md](references/concurrency.md) |
| Separating HTTP, application, domain, and persistence responsibilities | [architecture.md](references/architecture.md) |
| Mapping validation, domain, authentication, or unexpected failures | [errors.md](references/errors.md) |
| Configuring access logging, correlation, error capture, or body visibility | [application.md](references/application.md) |
| Testing an endpoint, dependency, lifespan, or generated OpenAPI contract | [testing.md](references/testing.md) |

SQLAlchemy, Alembic, Celery, Sentry, and other integrations keep their own
repository mechanics. This skill owns only their FastAPI lifetime, transport,
and handoff seams.

## Apply the boundary

1. State the observable contract: method, canonical path, authentication,
   inputs, success status and body, and each promised error.
2. Choose synchronous or asynchronous execution from the whole call path.
3. Keep the handler at the HTTP boundary. Inject request-scoped capabilities,
   delegate reusable work through the repository's established boundary, and
   return a declared response shape.
4. Map failures once. When the API contract permits deferred work, return an
   accepted response only after a durable handoff succeeds.
5. Test success, invalid input, authentication and authorization, domain
   failure, and the relevant persisted or queued effect through the ASGI app.
6. Inspect OpenAPI for a public contract change, then run the Python checks and
   the affected API tests. Name every configured exclusion and unrun service.

## Finish

Finish when FastAPI dispatch and dependency scopes match the selected resource
APIs, every URL and error mapping has one owner, OpenAPI matches the intended
contract, and isolated ASGI tests prove the changed behavior.
