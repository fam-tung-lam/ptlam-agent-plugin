# PTLam FastAPI Code Style

Rules for the FastAPI boundary of a Python service: four-layer feature packages,
application composition and lifespan, HTTP contracts, dependencies, use cases,
persistence registration, concurrency, errors, observability, and API tests.
This skill owns FastAPI mechanics only; Python and the foundation own everything
underneath.

<!-- PLUGIN-COMPILER:REQUIRED-SKILLS -->

## Before the first edit

1. Resolve the service root and read every applicable `AGENTS.md`.
2. Read `pyproject.toml`, the lockfile, and the application entry point. Note
   the installed FastAPI, Starlette, and Pydantic versions and whether each
   database, HTTP, storage, and queue client is sync or async.
3. Map the source and test tree. Trace one request through router inclusion,
   dependency injection, the handler, the application DTO, the use case, the
   port, the infrastructure adapter, the session or client, exception handlers,
   middleware, and tests. Give every prefix, resource, transaction, and error
   translation one owner.
4. Treat working configuration and verified code as evidence. Do not turn a
   stray legacy pattern into a rule or weaken the Python skill to match it.

## Pick a reference

| Concern                                                                             | Reference                                                 |
| ----------------------------------------------------------------------------------- | --------------------------------------------------------- |
| Starting or reorganizing the service package, feature layers, shared code, or tests | [file-organization.md](references/file-organization.md)   |
| Building the app, startup and shutdown, settings, routers, middleware, or logging   | [application.md](references/application.md)               |
| Declaring a path, request input, response output, paging, status, or OpenAPI        | [routes.md](references/routes.md)                         |
| Injecting authentication, a session, request context, or another capability         | [dependencies.md](references/dependencies.md)             |
| Choosing `def`, `async def`, streaming, or a background handoff                     | [concurrency.md](references/concurrency.md)               |
| Tracing or enforcing the route-to-use-case-to-repository pipeline                   | [architecture.md](references/architecture.md)             |
| Designing a use case or its transaction boundary                                    | [use-cases.md](references/use-cases.md)                   |
| Publishing a feature facade, enforcing imports, or breaking a feature cycle         | [feature-boundaries.md](references/feature-boundaries.md) |
| Registering SQLAlchemy models or wiring Alembic metadata                            | [persistence.md](references/persistence.md)               |
| Mapping validation, domain, authentication, or unexpected failures                  | [errors.md](references/errors.md)                         |
| Testing an endpoint, dependency, lifespan, or the OpenAPI contract                  | [testing.md](references/testing.md)                       |

SQLAlchemy queries and mappings, Alembic revisions, Celery execution, Sentry
capture, and other integrations keep their own repository mechanics. This skill
owns feature placement, model registration, FastAPI lifetime, transport, and
handoff seams.

## Do the work

1. State the observable contract: method, canonical path, authentication,
   inputs, success status and body, and each promised error.
2. Trace one path from a presentation adapter through one application DTO, use
   case, port, and infrastructure adapter to the session or client. Remove any
   second read or write lane in changed code.
3. Choose sync or async execution from the whole call path.
4. Assemble the use case in a typed dependency. Keep the handler at the HTTP
   boundary, give the use case the transaction decision, and return a declared
   response shape.
5. Map failures once. When the API allows deferred work, return an accepted
   response only after a durable handoff succeeds.
6. Test success, invalid input, authentication and authorization, domain
   failure, and the stored or queued effect through the ASGI app.
7. Inspect OpenAPI for a public contract change. Run the Alembic-metadata and
   import-boundary checks when affected, then the Python checks and API tests.
   Name every configured exclusion and unrun service.

## Finish

Finish when every feature file sits under `application/`, `domain/`,
`infrastructure/`, or `presentation/` with only `__init__.py` and `di.py` at the
feature root; dispatch and dependency scopes match the resource APIs; every
changed route uses the one request pipeline; feature imports enter facades;
registered metadata holds every mapped table; OpenAPI matches the intended
contract; and isolated ASGI tests prove the changed behavior.
