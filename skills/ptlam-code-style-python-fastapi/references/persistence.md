# FastAPI Persistence Registration

Feature-owned SQLAlchemy entities and one explicit Alembic metadata module make
Alembic autogeneration complete without moving persistence into a shared
business layer.

## Register every feature entity

Put one primary table per file under `<feature>/entities/`, together with its
association tables and entity-owned enums. Re-export every table from
`entities/__init__.py` so importing the package registers the complete feature.

```python
# users/entities/__init__.py
from myapp.users.entities.profile import Profile
from myapp.users.entities.user import User

__all__ = ["Profile", "User"]
```

Use `enum.StrEnum` for a closed string vocabulary that belongs to one entity.
Move an enum to the feature's `constants/` only after another entity consumes
it.

## Keep one Alembic metadata module

For one database, keep one root `alembic.ini`, one `migrations/env.py`, and one
revision history. `alembic_metadata.py` is the explicit exception to the facade
rule: it imports every feature's entity package solely to populate the shared
declarative base. The concrete name says why the imports exist; `registry.py`
does not.

```python
# myapp/alembic_metadata.py
"""Import every feature's entities so Base.metadata is complete."""
from myapp.db import Base
from myapp.billing import entities as _billing  # noqa: F401
from myapp.users import entities as _users  # noqa: F401

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


def test_alembic_metadata_covers_every_entity_module() -> None:
    import myapp.alembic_metadata  # noqa: F401

    root = Path(myapp.__file__).parent
    expected = {
        "myapp." + path.relative_to(root).with_suffix("").as_posix().replace("/", ".")
        for path in root.glob("*/entities/*.py")
        if path.stem != "__init__"
    }
    assert expected <= set(sys.modules)
```

This test catches a feature omitted from `alembic_metadata.py` and a table file
omitted from its own `entities/__init__.py`.

Finish when the metadata test passes and `alembic revision --autogenerate`
against the expected clean schema produces no unintended migration operations.
