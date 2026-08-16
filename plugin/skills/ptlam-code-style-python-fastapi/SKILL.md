# PTLam FastAPI Code Style

Conventions for the FastAPI boundary of a Python service: feature-package
structure, application composition and lifespan, HTTP contracts, dependencies,
use cases, persistence registration, concurrency, domain seams, errors,
observability, and API tests. This skill owns FastAPI mechanics only; Python and
the language-neutral foundation own everything underneath them.

<!-- PLUGIN-COMPILER:REQUIRED-SKILLS -->

## Before the first edit

1. Resolve the service root and read every applicable `AGENTS.md`.
2. Read `pyproject.toml`, the lockfile, and the application entry point. Record
   the installed FastAPI, Starlette, and Pydantic versions and whether each
   database, HTTP, storage, and queue client is synchronous or asynchronous.
3. Map the current source and test tree. Trace one request through router
   inclusion, dependencies, the handler, use case, repository, session or
   remote client, exception handlers, middleware, and tests. Give every prefix,
   resource, transaction, and error translation one owner.
4. Treat working configuration and verified implementation as evidence. Do not
   turn an incidental legacy pattern into a rule or weaken the Python skill to
   match it.

## Pick a reference

| Concern | Reference |
| --- | --- |
| Starting or reorganizing the service package, a feature, shared code, or the test tree | [file-organization.md](references/file-organization.md) |
| Constructing the app, startup and shutdown, settings, routers, or middleware | [application.md](references/application.md) |
| Declaring a path, request input, response output, status, or OpenAPI operation | [routes.md](references/routes.md) |
| Injecting authentication, a session, request context, or another capability | [dependencies.md](references/dependencies.md) |
| Choosing `def`, `async def`, streaming, or a background handoff | [concurrency.md](references/concurrency.md) |
| Tracing or enforcing the route-to-use-case-to-repository request pipeline | [architecture.md](references/architecture.md) |
| Designing a use case or choosing its transaction boundary | [use-cases.md](references/use-cases.md) |
| Publishing a feature facade, enforcing imports, or breaking a feature cycle | [feature-boundaries.md](references/feature-boundaries.md) |
| Registering SQLAlchemy models or wiring Alembic metadata | [persistence.md](references/persistence.md) |
| Mapping validation, domain, authentication, or unexpected failures | [errors.md](references/errors.md) |
| Configuring access logging, correlation, error capture, or body visibility | [application.md](references/application.md) |
| Testing an endpoint, dependency, lifespan, or generated OpenAPI contract | [testing.md](references/testing.md) |

SQLAlchemy queries and mappings, Alembic revision contents, Celery execution,
Sentry capture, and other integrations keep their repository mechanics. This
skill owns feature placement, model registration, FastAPI lifetime, transport,
and handoff seams.

## Apply the boundary

1. State the observable contract: method, canonical path, authentication,
   inputs, success status and body, and each promised error.
2. Trace one path from the router through one use case and repository to the
   session or remote client. Remove any second read or write lane in changed
   code.
3. Choose synchronous or asynchronous execution from the whole call path.
4. Assemble the use case in a typed dependency. Keep the handler at the HTTP
   boundary, give the use case the transaction decision, and return a declared
   response shape.
5. Map failures once. When the API contract permits deferred work, return an
   accepted response only after a durable handoff succeeds.
6. Test success, invalid input, authentication and authorization, domain
   failure, and the relevant persisted or queued effect through the ASGI app.
7. Inspect OpenAPI for a public contract change. Run the model-registry and
   import-boundary checks when affected, then the Python checks and API tests.
   Name every configured exclusion and unrun service.

## Finish

Finish when FastAPI dispatch and dependency scopes match the selected resource
APIs, every changed route uses the one request pipeline, feature imports enter
facades, registered metadata contains every model, OpenAPI matches the intended
contract, and isolated ASGI tests prove the changed behavior.
