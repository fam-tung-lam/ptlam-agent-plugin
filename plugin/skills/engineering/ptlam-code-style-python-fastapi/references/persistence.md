# FastAPI Persistence Registration

Feature-owned SQLAlchemy models and one explicit Alembic metadata module make
autogeneration complete while domain entities remain persistence-independent.

## Keep persistence models in infrastructure

Put one primary mapped table per file under
`<feature>/infrastructure/persistence/models/`, together with its association
tables and persistence-owned enums. Re-export every mapped table from that
package's `__init__.py` so importing it registers the complete feature.

```python
# users/infrastructure/persistence/models/__init__.py
from myapp.users.infrastructure.persistence.models.profile_table import (
    ProfileTable,
)
from myapp.users.infrastructure.persistence.models.user_table import UserTable

__all__ = ["ProfileTable", "UserTable"]
```

These mapped classes are infrastructure records, not domain entities. An
`infrastructure/adapters/` repository maps them to and from types under
`domain/entities/` before returning through an application port.

Keep a closed string vocabulary that belongs to a domain concept under
`domain/`, using `enum.StrEnum` when its mechanics fit. Keep a database-only
enum beside its mapped table and translate it at the adapter boundary.

## Keep one Alembic metadata module

For one database, keep one root `alembic.ini`, one `migrations/env.py`, and one
revision history. `alembic_metadata.py` is the explicit exception to the facade
rule: it imports every feature's persistence-model package solely to populate
the shared declarative base. The concrete name says why the imports exist;
`registry.py` does not.

```python
# myapp/alembic_metadata.py
"""Import every feature's persistence models so Base.metadata is complete."""
from myapp.db import Base
from myapp.billing.infrastructure.persistence import (
    models as _billing,  # noqa: F401
)
from myapp.users.infrastructure.persistence import models as _users  # noqa: F401

metadata = Base.metadata
```

```python
# migrations/env.py
from myapp.alembic_metadata import metadata as target_metadata
```

Tables remain feature-owned; migrations describe the whole database. Preserve an
established multi-database layout instead of forcing it into one history.

## Detect missing imports

Guard the metadata module because Alembic silently omits a table whose module
was never imported. Scan the filesystem rather than discovering packages through
the same imports under test:

```python
import sys
from pathlib import Path

import myapp


def test_alembic_metadata_covers_every_model_module() -> None:
    import myapp.alembic_metadata  # noqa: F401

    root = Path(myapp.__file__).parent
    expected = {
        "myapp." + path.relative_to(root).with_suffix("").as_posix().replace("/", ".")
        for path in root.glob("*/infrastructure/persistence/models/*.py")
        if path.stem != "__init__"
    }
    assert expected <= set(sys.modules)
```

This test catches a feature omitted from `alembic_metadata.py` and a mapped
table file omitted from its own `models/__init__.py`.

Finish when domain entities import no SQLAlchemy mechanic, every mapped table is
owned by feature infrastructure, the metadata test passes, and
`alembic revision --autogenerate` against the expected clean schema produces no
unintended migration operations.
