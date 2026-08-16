# FastAPI Application Composition

How the application owns lifespan, settings, router assembly, middleware, and
framework-wide handlers.

Keep one composition root: an application factory or the established entry
module. It creates `FastAPI`, installs middleware and exception handlers,
includes top-level routers, and exposes the ASGI application. Domain modules do
not mutate the app during import.

## Own process lifetime

Use `FastAPI(lifespan=...)` with an async context manager for application-wide
resources supported by the installed version. Acquire before `yield` and close
after it. Do not mix lifespan with deprecated startup and shutdown event
handlers; FastAPI runs one model or the other.

Acquire only required application-wide, concurrency-safe clients and pools in
lifespan, not at module import. Acquire request-specific sessions and
connections in dependencies, and leave request-specific remote work in the
request path. Let optional or lazy resources follow their established owner.
Expose a started resource through a typed dependency rather than a mutable
global that tests must patch before importing the app.

The official [lifespan guide](https://fastapi.tiangolo.com/advanced/events/)
owns current framework behavior. Recheck it when the installed FastAPI or
Starlette version changes.

## Compose once

- Read settings through the project's settings owner. Do not scatter direct
  environment reads across routers and services.
- Give each shared path prefix, version prefix, tag, and dependency one router
  inclusion site.
- Order middleware deliberately. A middleware that records a response must see
  the exception and response transformations it is meant to observe.
- Configure access logging, error capture, and correlation once. Record the
  method, canonical path, status, duration, and correlation identifier needed
  by operators.
- Make query, header, request-body, and error-body capture opt-in, bounded, and
  redacted. Let one outer boundary capture an unexpected error after middleware
  records and re-raises it.
- Mount static files and optional subsystems only when their configured
  resources exist; make missing required resources fail startup clearly.

Importing a module for a unit test must not start a connection, dispatch a job,
or perform remote registration.

Finish when app construction is repeatable in tests, startup and shutdown own
the same resources, and each router, handler, and middleware is installed once.
