# PTLam Python Code Style

Conventions for Python library and application code: the development toolchain,
package boundaries, imports, typing, async work, data models, docstrings,
logging, and tests. This skill owns Python mechanics only; the foundation owns
the standard they satisfy.

<!-- PLUGIN-COMPILER:REQUIRED-SKILLS -->

## Before the first edit

1. Resolve the package root and read every applicable `AGENTS.md` from the
   repository root down to the files in scope.
2. Read `pyproject.toml`, the active lock or constraints files, CI, and the
   nearest source and tests. Record the minimum Python version, package and
   build layout, formatter, linter, type checker, test runner, and their real
   commands.
3. Treat executable configuration and CI as the mechanic. A dependency being
   installed does not prove that the project runs it.
4. Apply stronger new-code rules to code you add or substantively change. Leave
   unrelated legacy inconsistencies alone.

For a new Python project, use uv for the environment and dependency lock, Ruff
for formatting and linting, ty for static type checking, and pytest with
pytest-mock, pytest-cov, and pytest-asyncio for tests. In an existing project,
keep its explicit working toolchain until replacing it is part of the task.

## Pick a reference

| Concern                                                                  | Reference                                                   |
| ------------------------------------------------------------------------ | ----------------------------------------------------------- |
| Creating or standardizing the development environment, checks, or CI     | [dev-toolchain.md](references/dev-toolchain.md)             |
| Adding a module, publishing a package name, or resolving an import cycle | [modules-and-imports.md](references/modules-and-imports.md) |
| Writing or changing annotations and runtime preconditions                | [typing.md](references/typing.md)                           |
| Performing I/O or managing concurrent work and resource lifetime         | [async.md](references/async.md)                             |
| Raising, translating, or preserving an exception                         | [errors.md](references/errors.md)                           |
| Defining or serializing a Pydantic model when Pydantic v2 is installed   | [pydantic.md](references/pydantic.md)                       |
| Writing a Python docstring or integrating API documentation              | [documentation.md](references/documentation.md)             |
| Emitting or configuring Python logs                                      | [logging.md](references/logging.md)                         |
| Writing, placing, or restructuring a pytest test                         | [testing.md](references/testing.md)                         |

## Apply the mechanics

1. Keep every changed public surface intentional and compatible with the
   project's supported Python versions.
2. Give changed production callables precise parameter and return types. Keep
   runtime validation separate from static typing.
3. Keep blocking work out of async paths and close every resource on success,
   failure, and cancellation.
4. Add or update behavioral tests in the existing test home. Cover the normal,
   boundary, and failure cases changed by the work.
5. Run checks from narrow to broad: focused tests, configured checks on changed
   files, then project-wide gates. Run the configured package build and
   supported-version matrix when the change affects distribution or
   compatibility.
6. For a distributed-package change, install the built artifact in a disposable
   environment and smoke-test the changed public imports.

Inspect the diff after any write-mode formatter or hook. Report exact commands,
their results, configured exclusions that affect confidence, and every check you
did not run.

## Finish

Finish when the changed code preserves its package and serialization contracts,
adds no new type or lint failure, blocks no event loop, leaks no resource, and
passes the affected behavioral tests under the project's actual toolchain.
