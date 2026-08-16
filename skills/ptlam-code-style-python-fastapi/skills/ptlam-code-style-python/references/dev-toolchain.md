# Python Development Toolchain

Use this workflow to establish, migrate, or run the standard Python development
toolchain:

- uv owns Python environments, dependencies, the lockfile, and command execution.
- Ruff owns formatting, linting, and import sorting.
- ty owns static type checking.
- pytest owns test execution; pytest-mock, pytest-cov, and pytest-asyncio provide
  mocks, coverage, and asyncio support.

Apply the complete stack to new projects. When support includes older Python,
pin compatible tool releases instead of raising the product's support floor.
An existing repository's executable toolchain remains authoritative until its
migration is in scope. Never introduce a competing capability owner.

## Establish the stack

Declare the supported Python range in `pyproject.toml`. Put development tools in
the default dependency group so a normal sync installs every local and CI gate:

```shell
uv add --dev pytest pytest-mock pytest-cov pytest-asyncio ruff ty
```

Use `uv add <package>` and `uv remove <package>` for dependency changes. Commit
`pyproject.toml` and `uv.lock` together. Never edit `uv.lock` by hand. Pin the uv
version in CI or the project bootstrap mechanism and update that pin
intentionally.

Keep configuration in `pyproject.toml` unless the repository owns a dedicated
file. Use `[tool.ruff]`, `[tool.ruff.lint]`, `[tool.ruff.format]`, and
`[tool.ty]`. Use `[tool.pytest.ini_options]` when supporting pytest 8 or earlier;
a pytest 9-only project may choose `[tool.pytest]`. Configure pytest in one file.

Configure `pytest-asyncio` deliberately. Use `asyncio_mode = "auto"` when
asyncio is the project's only async test library. Use strict mode when multiple
async libraries or plugins must coexist. Set
`asyncio_default_fixture_loop_scope = "function"` and
`asyncio_default_test_loop_scope = "function"`; widen either only for a proven
lifetime contract.

ty remains pre-1.0. Lock and upgrade it deliberately. Promote warnings in
configuration or use `--error-on-warning` when they must fail CI.

## Run the local loop

Run the smallest affected paths first, then the whole project:

```shell
uv run pytest tests/path/to/test_feature.py -q
uv run ruff check --fix path/to/changed
uv run ruff format path/to/changed
uv run ty check path/to/changed
uv run ruff check .
uv run ruff format --check .
uv run ty check
uv run pytest --cov=<import-package> --cov-report=term-missing --cov-fail-under=<threshold>
```

Inspect every write-mode Ruff diff. Do not enable unsafe fixes without an
explicit reason. Ruff's formatter does not sort imports; enable its `I` rule
group, run lint fixes before formatting, and disable formatter-conflicting
rules. Derive lint rules, the coverage threshold, measured packages, and
exclusions from the project's contract. The threshold may instead live in the
checked-in coverage configuration.

Use pytest-mock's `mocker` fixture at external boundaries and patch the name the
code under test resolves. Use `AsyncMock` only for an awaited contract. Coverage
is evidence about exercised lines, not a replacement for behavioral assertions.

## Gate CI without mutation

Run the same checked-in configuration in CI and reject stale dependency state:

```shell
uv lock --check
uv sync --locked
uv run --locked ruff check .
uv run --locked ruff format --check .
uv run --locked ty check
uv run --locked pytest --cov=<import-package> --cov-report=term-missing --cov-fail-under=<threshold>
```

If tools live outside the default `dev` group, pass the required groups to
`uv sync` explicitly. Preserve the same selection in every CI job that runs a
tool. Do not use a command that silently rewrites source, configuration, or the
lockfile in a verification job.

## Migrate an existing project

Capture the old gates and a clean baseline. Migrate one capability at a time,
translate intentional settings and exclusions, then remove the superseded
dependency, configuration, hook, and CI command. Name the end of any temporary
overlap; do not leave Black, isort, Flake8, mypy, or Pyright indefinitely.

Finish when one tool owns each capability, the project metadata and lock agree,
all local and CI commands select the intended files, and every configured gate
passes with material exclusions reported.
