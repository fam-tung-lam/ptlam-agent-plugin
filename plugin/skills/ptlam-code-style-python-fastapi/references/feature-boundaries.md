# FastAPI Feature Boundaries

Each feature publishes one surface through its package `__init__.py`. Another
feature may import an exported use case, DTO, or domain failure; it never
reaches into the target's controller, repositories, model internals, DI, or
tasks.

```python
# billing/usecases/charge_customer.py
from myapp.users import GetUser, UserNotFound  # public facade
```

An export is a compatibility promise. Export only a symbol with a real external
consumer, and keep importing the package free of connection, registration, and
other runtime side effects.

## Enforce the dependency graph

Use the repository's existing architecture checker. For a new service, add
[Import Linter](https://import-linter.readthedocs.io/en/stable/) and adapt this
verified TOML template to the real package and features:

```toml
[tool.importlinter]
root_package = "myapp"
include_external_packages = true

[[tool.importlinter.contracts]]
name = "Application and independent features depend inward"
type = "layers"
layers = [
    "myapp.app",
    "myapp.users | myapp.billing | myapp.orders",
    "myapp.shared | myapp.integrations",
]

[[tool.importlinter.contracts]]
name = "Controllers enter through use cases"
type = "forbidden"
source_modules = [
    "myapp.users.controller",
    "myapp.billing.controller",
    "myapp.orders.controller",
]
forbidden_modules = [
    "myapp.db",
    "myapp.users.repositories",
    "myapp.billing.repositories",
    "myapp.orders.repositories",
    "myapp.integrations",
    "sqlalchemy",
]
allow_indirect_imports = true

[[tool.importlinter.contracts]]
name = "Use cases are transport agnostic"
type = "forbidden"
source_modules = [
    "myapp.users.usecases",
    "myapp.billing.usecases",
    "myapp.orders.usecases",
]
forbidden_modules = ["fastapi", "starlette"]
```

Run `lint-imports` in CI. The external-package flag is required when a contract
names SQLAlchemy, FastAPI, or Starlette. Allow indirect imports in the
controller contract so the valid controller-to-use-case-to-repository path does
not fail.

Independent features coordinate in `app.py` or through events. When one caller
must invoke another feature's facade, ignore only that exact facade import in
the independent-sibling layer and add a forbidden contract that still blocks the
target's controller, model internals, repositories, DI, and tasks. Record the
exception as owned design debt.

## Break cycles at the boundary

Use string targets for SQLAlchemy relationships across features and one shared
declarative base. Put annotation-only imports behind `TYPE_CHECKING` under the
active annotation policy.

If a cycle survives both repairs, move a genuinely cross-cutting concept into
`shared/` or merge the features. The boundary is wrong; an import trick does not
repair it.

Finish when every cross-feature import enters a facade, the configured graph
passes, and no cycle or ignored edge hides an unowned dependency.
