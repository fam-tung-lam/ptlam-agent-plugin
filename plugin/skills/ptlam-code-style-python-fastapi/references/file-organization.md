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
                constants.py
                utils.py
            users/
                users_module.py
                routes/
                    v1.py
                    v2.py
                usecases.py
                dtos.py
                entities.py
                repositories.py
                dependencies.py
                tasks.py
                constants.py
                utils.py
                tests/
            orders/
                orders_module.py
                routes/
                    v1.py
                usecases.py
                dtos.py
                entities.py
                repositories.py
                tests/
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

## Start each module compact

| Module path | Put here |
| --- | --- |
| `<name>_module.py` | The public facade: use cases, DTOs, and version routers another module or `app/` may import |
| `routes/vN.py` | One `APIRouter` for that API version and its typed HTTP handlers |
| `usecases.py` | Application operations, orchestration, and transaction decisions |
| `dtos.py` | Pydantic request and response models; keep them separate from entities |
| `entities.py` | Module-owned domain or SQLAlchemy entities |
| `repositories.py` | Storage protocols and adapters owned by the module |
| `dependencies.py` | FastAPI providers that assemble request-scoped repositories and use cases |
| `tasks.py` | Feature-owned durable jobs that call use cases |
| `constants.py` and `utils.py` | Module-local low-level reuse with no business policy |

Start with one file per responsibility. Split a file into a same-named package
only when it gains several independently maintained implementations or becomes
hard to navigate; do not scaffold empty subpackages.

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
revision history. Let `env.py` import each module's `entities.py` through its
facade or a metadata registry so autogenerate sees every table.

Entities remain feature-owned; migrations describe the whole database. Follow
an established multi-database Alembic layout when the repository already has
one instead of forcing a single history.

Co-locate feature tests under `<module_name>/tests/` when the configured runner
collects them. Otherwise mirror the module under the repository's existing test
root.

Finish when feature-to-feature imports use module facades, integrations own
shared clients, Alembic sees every entity in one database history, shared code
has proven consumers, and tests mirror the same ownership.
