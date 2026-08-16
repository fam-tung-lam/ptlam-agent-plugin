# FastAPI File Organization

A feature-first fallback for a FastAPI service whose repository has no stronger
layout. Preserve a coherent existing structure and reorganize only files owned
by the requested change.

This adapts the feature grouping in
[Encore's NestJS structure guide](https://encore.dev/articles/nestjs-project-structure-best-practices)
to Python packages, `APIRouter` composition, FastAPI dependencies, Pydantic,
SQLAlchemy, and Alembic.

## The project tree

The diagram requires Mermaid 11.14 or later.

```mermaid
treeView-beta
    project/
        pyproject.toml
        alembic.ini
        migrations/
            env.py
            versions/
        src/
            main.py
            app/
                __init__.py
                application.py
            core/
                config.py
                database.py
                health.py
            integrations/
                redis/
                    client.py
                celery/
                    app.py
                s3/
                    client.py
            shared/
                exceptions.py
                logging.py
                dependencies.py
                constants/
                    headers.py
                utils/
                    identifiers.py
            users/
                users_module.py
                routes/
                    v1.py
                    v2.py
                usecases/
                    create_user.py
                    get_user.py
                dtos/
                    requests.py
                    responses.py
                entities/
                    user.py
                repositories/
                    protocols.py
                    sqlalchemy.py
                dependencies.py
                tasks.py
                constants/
                    cache.py
                utils/
                    identifiers.py
        tests/
            modules/
                users/
                    unit/
                        usecases/
                            test_create_user.py
                    integration/
                        repositories/
                            test_user_repository.py
                        routes/
                            test_users_v1.py
            api/
                test_health.py
```

## Give each top-level package one role

| Package | Owns |
| --- | --- |
| `app/` | The composition root: create FastAPI, install lifespan and middleware, and include each module's version routers once |
| `core/` | One-time application setup and operations, such as settings, the database engine, and unversioned health or readiness endpoints |
| `integrations/` | Application-wide clients and pools for external systems, with one facade per Redis, Celery, S3, email, payment, or similar system |
| `shared/` | Cross-cutting code already used by at least two modules |
| `<module_name>/` | One business capability and everything that changes with it |

`main.py` exposes the ASGI app and delegates composition to
`app/application.py`. The composition root imports module facades instead of
module internals and contains no business policy.

## Give expandable concerns a package

| Module path | Put here |
| --- | --- |
| `<name>_module.py` | The public facade: use cases, DTOs, and version routers another module or `app/` may import |
| `routes/vN.py` | One `APIRouter` for that API version and its typed HTTP handlers |
| `usecases/` | One application operation per file, including orchestration and transaction decisions |
| `dtos/` | Pydantic request and response models grouped by resource or operation; keep them separate from entities |
| `entities/` | Module-owned domain or SQLAlchemy entities, normally one primary entity per file |
| `repositories/` | Storage protocols and adapters, split by boundary or implementation |
| `dependencies.py` | FastAPI providers that assemble request-scoped repositories and use cases |
| `tasks.py` | Feature-owned durable jobs that call use cases |
| `constants/` and `utils/` | Module-local low-level reuse, split into narrowly named files with no business policy |

Create these packages when the first owned file appears and follow the
repository's `__init__.py` policy. Do not scaffold empty files or export every
internal symbol from a package initializer.

## Share infrastructure without moving feature behavior

Create reusable clients and connection pools once under `integrations/`.
Modules consume their facades through injected dependencies or use cases; they
do not construct another client for the same external system.

Keep a truly module-specific integration inside that module. Keep the Celery
app under `integrations/celery/`, but put a feature task in its module by
default and register or autodiscover it on the shared app.

Keep helpers and constants module-local first. Move a framework-neutral helper
or constant to `shared/` when a second module needs it. Expose feature policy
through the owning module facade instead of moving it to `shared/`.

## Keep one database history

For one database, keep one root `alembic.ini`, one `migrations/env.py`, and one
revision history. Let `env.py` import each module's `entities/` package through
its facade or a metadata registry so autogenerate sees every table.

Entities remain feature-owned; migrations describe the whole database. Follow
an established multi-database Alembic layout when the repository already has
one instead of forcing a single history.

## Mirror modules under the test root

Place feature tests under `tests/modules/<module_name>/`, then separate them by
the active test level, such as `unit/` or `integration/`. Mirror deeper source
paths when that helps a test's owner remain obvious. Keep tests for the composed
ASGI application or unversioned operational endpoints under `tests/api/`.

This layout decides placement only. Choose what each level proves from the
active testing contract, and preserve a repository's coherent established test
root instead of relocating unrelated tests.

Finish when feature-to-feature imports use module facades, integrations own
shared clients, Alembic sees every entity in one database history, shared code
has proven consumers, and tests mirror the same ownership.
