# FastAPI Use Cases

One application operation per verb-first file under `<feature>/usecases/`.
Use cases are the only path from an HTTP handler or durable task to a repository.

## Keep the operation transport-neutral

- Import no `fastapi`, `starlette`, `Request`, `Depends`, or `HTTPException`.
- Receive collaborators in `__init__` and operation input in `__call__`.
- Use a command dataclass when an operation has several input fields; pass one
  scalar directly when it has one.
- Return a domain or persistence model. Let the router map it to a response
  schema.
- Raise domain exceptions and let the application map them once.

```python
# users/usecases/create_user.py
@dataclass(frozen=True)
class CreateUserCommand:
    email: str
    display_name: str


class CreateUser:
    def __init__(self, users: UserRepository) -> None:
        self._users = users

    async def __call__(self, command: CreateUserCommand) -> User:
        if await self._users.exists(email=command.email):
            raise EmailAlreadyRegistered(command.email)
        user = await self._users.add(
            User(email=command.email, display_name=command.display_name)
        )
        await self._users.commit()
        return user
```

## Own one transaction boundary

A write use case commits once after its transactional work succeeds. A read use
case makes the no-commit decision explicit. Routers and repositories never
commit on behalf of the operation.

Keep a non-transactional remote effect after commit only when failure and retry
semantics are safe. Use an outbox or durable handoff when the database change
and effect must not drift apart.

Do not call a sibling use case. Extract shared rules into a narrowly named
feature policy so transaction boundaries remain visible. Prefer events or
composition-root coordination between features; when direct orchestration is
required, import only the other feature's facade.

## Assemble at the FastAPI boundary

```python
# users/dependencies.py
def get_create_user(
    session: Annotated[AsyncSession, Depends(get_session)],
) -> CreateUser:
    return CreateUser(SqlUserRepository(session))
```

```python
# users/router.py
@router.post("", response_model=UserRead, status_code=status.HTTP_201_CREATED)
async def create_user(
    body: UserCreate,
    create: Annotated[CreateUser, Depends(get_create_user)],
) -> User:
    return await create(CreateUserCommand(**body.model_dump()))
```

Use cases are the local-unit test surface: construct one with controlled
repository and integration fakes, call it directly, and assert its observable
result or failure.

Finish when each operation has one file, one transaction decision, ordinary
typed inputs, no framework import, and one boundary provider that assembles it.
