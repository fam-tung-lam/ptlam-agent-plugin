# PTLam Python Code Style

Rules for Python library and application code: the development toolchain,
package boundaries, imports, typing, async work, data models, docstrings,
logging, and tests. This skill owns Python mechanics only; the foundation owns
the standard.

<!-- PLUGIN-COMPILER:REQUIRED-SKILLS -->

## Before review or change

Choose review or change using the inherited mode policy. In review, use
installed tools without dependency sync, package builds, or installation. The
toolchain reference gives the check-mode commands.

1. Resolve the package root and read every applicable `AGENTS.md` from the
   repository root down to the files in scope.
2. Read `pyproject.toml`, the lock or constraints files, CI, and the nearest
   source and tests. Note the minimum Python version, package and build layout,
   formatter, linter, type checker, test runner, and their real commands.
3. Treat executable configuration and CI as the truth. An installed dependency
   does not prove the project runs it.
4. Apply the stricter rules to code you add or substantially change. Leave
   unrelated legacy inconsistencies alone.

For a new project, use uv for environments and the lock, Ruff for formatting and
linting, ty for type checking, and pytest with pytest-mock, pytest-cov, and
pytest-asyncio. In an existing project, keep its working toolchain until
replacing it is part of the task.

## Pick a reference

| Concern                                                          | Reference                                                   |
| ---------------------------------------------------------------- | ----------------------------------------------------------- |
| Creating or standardizing the environment, checks, or CI         | [dev-toolchain.md](references/dev-toolchain.md)             |
| Adding a module, publishing a name, or fixing an import cycle    | [modules-and-imports.md](references/modules-and-imports.md) |
| Writing or changing annotations, value types, or runtime checks  | [typing.md](references/typing.md)                           |
| Doing I/O, or managing concurrent work and resource lifetime     | [async.md](references/async.md)                             |
| Raising, translating, or keeping an exception                    | [errors.md](references/errors.md)                           |
| Defining or serializing a Pydantic model (Pydantic v2 installed) | [pydantic.md](references/pydantic.md)                       |
| Writing a docstring or generating API docs                       | [documentation.md](references/documentation.md)             |
| Emitting or configuring logs                                     | [logging.md](references/logging.md)                         |
| Writing, placing, or reshaping a pytest test                     | [testing.md](references/testing.md)                         |

## Do the work

1. Keep every changed public surface intentional and compatible with the
   supported Python versions.
2. Give changed production callables precise parameter and return types. Keep
   runtime validation separate from static typing.
3. Keep blocking work out of async paths, and close every resource on success,
   failure, and cancellation.
4. Add or update behavior tests in the existing test home for the normal,
   boundary, and failure cases the change touches.
5. Run checks narrow to broad: focused tests, configured checks on changed
   files, then project-wide gates. In change mode, run the package build and
   supported version matrix when distribution or compatibility is affected.
6. In change mode, install a changed distributed package's built artifact in a
   throwaway environment and smoke-test its changed public imports.

Inspect the diff after any write-mode formatter or hook. Report the exact
commands, their results, configured exclusions that affect confidence, and every
check you did not run.

## Finish

Finish when the changed code keeps its package and serialization contracts, adds
no new type or lint failure, blocks no event loop, leaks no resource, and passes
the affected behavior tests under the project's real toolchain.
