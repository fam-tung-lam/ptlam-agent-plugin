# FastAPI Project Structure

A feature-first default for a FastAPI service that has no stronger layout.
Preserve a coherent existing structure and reorganize only files owned by the
requested change. Reorganization is not a deliverable.

## Grow into this structure

Use the full layout around three business capabilities, two developers, or the
point where one `main.py` stops fitting on a screen. Below that, a flat `app/`
with `main.py`, `models.py`, `schemas.py`, `routers.py`, and `db.py` is the
correct answer.

Create a package when its first owned file appears. Every empty package added
today is another directory every future maintainer must search.

## The project tree

```text
project/
├── pyproject.toml
├── alembic.ini
├── migrations/
│   ├── env.py
│   └── versions/
├── src/
│   └── myapp/                     # one importable package named for the service
│       ├── __init__.py
│       ├── main.py                # ASGI entrypoint: app = create_app()
│       ├── app.py                 # composition root
│       ├── settings.py            # Settings plus one cached accessor
│       ├── db.py                  # Base, engine, session factory, dependency
│       ├── registry.py            # imports every feature's models for Alembic
│       ├── ops.py                 # /health, /ready, /version; unversioned
│       ├── integrations/
│       │   ├── redis.py
│       │   ├── celery_app.py
│       │   └── s3.py
│       ├── shared/
│       │   ├── errors.py
│       │   ├── logging_config.py
│       │   ├── constants/         # optional
│       │   └── utils/             # optional
│       │       ├── pagination.py
│       │       └── clock.py
│       └── users/                 # one business capability
│           ├── __init__.py        # facade; the only cross-feature import path
│           ├── router.py          # APIRouter plus handlers
│           ├── schemas.py         # Pydantic request and response models
│           ├── models/
│           │   ├── __init__.py    # re-exports every feature table
│           │   ├── user.py
│           │   └── profile.py
│           ├── usecases/
│           │   ├── __init__.py
│           │   ├── create_user.py
│           │   ├── get_user.py
│           │   └── deactivate_user.py
│           ├── repository.py
│           ├── dependencies.py
│           ├── exceptions.py
│           ├── constants/         # optional
│           │   └── user_status.py
│           ├── utils/             # optional
│           │   └── email_normalization.py
│           └── tasks.py
└── tests/
    ├── conftest.py
    ├── app/
    │   └── integration/
    │       └── test_ops.py
    └── users/                     # mirrors src/myapp/users/
        ├── conftest.py
        ├── test_doubles/
        │   └── fake_user_repository.py
        ├── unit/
        │   └── usecases/
        │       ├── test_create_user.py
        │       └── test_get_user.py
        └── integration/
            ├── test_repository.py
            └── test_router.py
```

Keep this tree as plain text so it renders in every editor, terminal, diff, and
code review without a renderer-version requirement.

## Give each package one role

| Path | Owns |
| --- | --- |
| `main.py` | Nothing except `app = create_app()` |
| `app.py` | `FastAPI`, lifespan, middleware, feature routers, and exception handlers; no business policy |
| `settings.py`, `db.py` | One-time configuration, engine, and session setup |
| `ops.py` | Unversioned liveness, readiness, and build information |
| `integrations/` | One client or pool facade per external system; not the feature behavior that consumes it |
| `shared/` | Framework-neutral code with at least two proven feature consumers |
| `<feature>/` | One business capability and everything that changes with it |

## Give each feature one public surface

| Path | Put here |
| --- | --- |
| `__init__.py` | The facade: only use cases, schemas, and exceptions another feature needs |
| `router.py` | Typed handlers; split to `routers/v1.py` and `routers/v2.py` only after another API version exists |
| `schemas.py` | Pydantic request and response models, separate from persistence models |
| `models/` | SQLAlchemy tables, normally one primary table per file, all registered by its initializer |
| `usecases/` | One application operation per verb-first file |
| `repository.py` | The storage protocol and adapter; split by backend only when another backend exists |
| `dependencies.py` | `Depends` providers that assemble use cases from sessions and integration facades |
| `exceptions.py` | Domain failures raised by this feature |
| `constants/`, `utils/` | Optional module-local, low-level reuse with no business policy |
| `tasks.py` | Thin durable-job entry points registered on the shared queue app |

Use `__init__.py` as the facade instead of a stuttering `<feature>_module.py`.
Use `schemas.py`, FastAPI's established term, instead of a parallel `dtos/`
package. Add separate domain entities only when they genuinely differ from the
persistence models and justify the mapping cost.

## Keep optional folders narrow

| Decision | Rule |
| --- | --- |
| Create | Start a helper private; create `utils/` or `constants/` only when a second file in the feature consumes it |
| Promote | Move a framework-neutral item to `shared/` only when a second feature consumes it |
| Name | Use one concept per file; never `helpers.py`, `misc.py`, `common.py`, or `general.py` |
| Configure | Put timeouts, page sizes, retries, flags, and URLs in `settings.py`, not `constants/` |
| Bound | Keep model, repository, and use-case imports out of `utils/`; domain behavior stays in its feature owner |
| Reuse | Prefer the standard library or an installed dependency before adding another helper |
| Avoid shadowing | Do not add `types.py`, `logging.py`, `email.py`, `secrets.py`, `queue.py`, `json.py`, or `datetime.py` |

Finish when the service has one importable package, each feature publishes one
facade, shared code has proven consumers, optional packages contain real files,
and the source and test trees expose the same capability ownership.
