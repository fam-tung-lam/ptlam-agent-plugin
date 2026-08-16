# Python Modules and Imports

Python import, publication, and file-placement mechanics.

## Publish one intentional API

Use the repository's package layout. When a new packaged project has no
established layout, put importable code under `src/<package>/` and mirror its
capability structure under `tests/`.

Python spells an internal module or name with a leading underscore. Publish a
supported package name deliberately through its package entry point and
`__all__` when the repository uses it. Do not expose an implementation merely to
make a test import it.

A public re-export is a compatibility promise. Preserve it, deprecate it through
the project's established mechanism, or treat its removal as a breaking change.
Keep `__init__.py` focused on package composition; importing the package must
not start services, read remote state, or perform expensive work.

## Keep imports directional

- Let the formatter or import sorter own grouping and order.
- Match the package's established choice of absolute or explicit relative
  imports. Do not mix styles within one changed module without a boundary
  reason.
- A consumer outside the package imports its published surface. Internal code
  may import the owning module directly when re-exporting through `__init__.py`
  would eagerly load unrelated code or create a cycle.
- Put annotation-only imports behind `TYPE_CHECKING` when runtime evaluation is
  unnecessary and the active annotation policy permits it.
- Avoid wildcard imports. Name every dependency the module uses.

Keep imports at module scope by default. A local import needs a verified runtime
reason, such as an optional dependency or a cycle that cannot yet be removed.
Fix the dependency direction instead when moving the import only hides the
cycle.

## Keep files owned

Name a module after its one responsibility. Use the project's existing package
and test names; do not introduce `helpers.py`, `utils.py`, or a new directory as
a speculative home.

Place a new test beside the existing tests for its unit. When no pattern exists,
mirror the source path and name the file `test_<module>.py`. Split one unit
across several test files only by stable behavior, never by bug or change ID.

Finish when every import follows the declared dependency direction, the package
exports only supported names, and each new file has one concrete owner.
