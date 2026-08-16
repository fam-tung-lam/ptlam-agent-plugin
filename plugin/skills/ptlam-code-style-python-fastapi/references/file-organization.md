# FastAPI File Organization

A feature-first fallback for a FastAPI service whose repository has no stronger
layout. Preserve a coherent existing structure and reorganize only files owned
by the requested change.

This adapts the feature grouping in
[Encore's NestJS structure guide](https://encore.dev/articles/nestjs-project-structure-best-practices)
to Python packages, `APIRouter` composition, FastAPI dependencies, and Pydantic
transport models.

## The project tree

The diagram requires Mermaid 11.14 or later.

```mermaid
treeView-beta
    project/
        pyproject.toml
        migrations/
        src/
            package_name/
                app/
                    __init__.py
                    main.py
                    lifespan.py
                    router.py
                core/
                    config.py
                    database.py
                    logging.py
                    security.py
                shared/
                    errors.py
                    types.py
                modules/
                    module_name/
                        __init__.py
                        dependencies.py
                        handlers/
                            http.py
                        dtos/
                            requests.py
                            responses.py
                        entities/
                            entity.py
                        usecases/
                            create_entity.py
                        repositories/
                            protocols.py
                            sqlalchemy.py
                        utils/
                        constants/
        tests/
            modules/
                module_name/
                    unit/
                    integration/
            api/
                test_module_name.py
```

## Give each top-level package one role

| Package | Owns |
| --- | --- |
| `app/` | The composition root: create FastAPI, install lifespan and middleware, include every module router once, and expose the ASGI app |
| `core/` | Process-wide infrastructure initialized or configured once, such as settings, pools, logging, and security primitives |
| `shared/` | Framework-neutral types or policies already used by at least two modules |
| `modules/<name>/` | One business capability and every adapter that changes for that capability |

`app/` imports each module's public surface. It contains no business policy.
`core/` is not a home for feature code, and `shared/` is not a home for code
that might become reusable later.

## Keep a module vertical

| Module path | Put here |
| --- | --- |
| `handlers/` | `APIRouter` and typed HTTP handlers; use `controllers/` only when the repository already owns that term |
| `dtos/` | Pydantic request and response models; do not maintain a parallel `schemas/` tree |
| `entities/` | Domain entities and the repository-approved persistence representation, never transport DTOs |
| `usecases/` | Application operations, orchestration, and transaction decisions; use this name instead of a generic `services/` layer |
| `repositories/` | Storage or external-system protocols and their module-owned adapters |
| `dependencies.py` | FastAPI providers that assemble request-scoped repositories and use cases |
| `utils/` and `constants/` | Module-local low-level reuse with no business policy |

Create a directory when its first owned file appears, not as empty scaffolding.
Keep a helper or constant beside its only consumer; move it only after a second
module-local consumer exists.

## Publish and compose one surface

`modules/<name>/__init__.py` exports the router and only the contracts another
module may call. The composition root imports that surface instead of reaching
into `handlers/`, `usecases/`, or `repositories/`.

Keep module dependencies directional. When two modules need the same
framework-neutral contract, move that contract to `shared/` after the second
consumer appears; do not move either module's business policy.

Mirror the capability under the existing test root. Keep use-case and adapter
tests under `tests/modules/<name>/` and assembled HTTP-contract tests under
`tests/api/`.

Finish when one module owns each changed capability, the app composes public
module surfaces only, shared code has proven consumers, and tests mirror the
same ownership boundaries.
