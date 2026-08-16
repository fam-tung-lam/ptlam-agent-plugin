# FastAPI Persistence Registration

Feature-owned SQLAlchemy models and one explicit application registry make
Alembic autogeneration complete without moving persistence into a shared
business layer.

## Register every feature model

Put one primary table per file under `<feature>/models/`, together with its
association tables and model-owned enums. Re-export every table from
`models/__init__.py` so importing the package registers the complete feature.

```python
# users/models/__init__.py
from myapp.users.models.profile import Profile
from myapp.users.models.user import User

__all__ = ["Profile", "User"]
```

Use `enum.StrEnum` for a closed string vocabulary that belongs to one model.
Move an enum to the feature's `constants/` only after another model consumes it.

## Keep one metadata registry

For one database, keep one root `alembic.ini`, one `migrations/env.py`, and one
revision history. The application registry is the explicit exception to the
facade rule: it imports every feature's model package solely to populate the
shared declarative base.

```python
# myapp/registry.py
"""Import every feature's models so Base.metadata is complete."""
from myapp.db import Base
from myapp.billing import models as _billing  # noqa: F401
from myapp.users import models as _users  # noqa: F401

metadata = Base.metadata
```

```python
# migrations/env.py
from myapp.registry import metadata as target_metadata
```

Tables remain feature-owned; migrations describe the whole database. Preserve an
established multi-database layout instead of forcing it into one history.

## Detect missing imports

Guard the registry because Alembic silently omits a table whose module was never
imported. Scan the filesystem rather than discovering packages through the same
imports under test:

```python
import sys
from pathlib import Path

import myapp


def test_registry_covers_every_model_module() -> None:
    import myapp.registry  # noqa: F401

    root = Path(myapp.__file__).parent
    expected = {
        "myapp." + path.relative_to(root).with_suffix("").as_posix().replace("/", ".")
        for path in root.glob("*/models/*.py")
        if path.stem != "__init__"
    }
    assert expected <= set(sys.modules)
```

This test catches a feature omitted from `registry.py` and a table file omitted
from its own `models/__init__.py`.

Finish when the registry test passes and `alembic revision --autogenerate`
against the expected clean schema produces no unintended migration operations.
