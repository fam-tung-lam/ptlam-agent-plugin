# PTLam Dart Code Style

Rules for Dart library and application code: SDK and package resolution,
analyzer and formatter settings, naming, library layout, data types, failures,
async work, dartdoc, and `package:test`. This skill owns Dart mechanics only;
the foundation owns the standard they satisfy.

<!-- PLUGIN-COMPILER:REQUIRED-SKILLS -->

## Before review or change

Choose review or change using the inherited mode policy. In review, use the
formatter check below and inspect installed dependency state without running pub
resolution.

1. Resolve the package root, then read every applicable `AGENTS.md` from the
   repository root down to the files in scope.
2. Read `pubspec.yaml`, `pubspec.lock`, `analysis_options.yaml`, CI, and the
   nearest source and tests. Note the SDK constraint, resolved dependency
   versions, the included lint set, formatter settings, and the commands CI
   really runs.
3. Treat `analysis_options.yaml` and `pubspec.lock` as the project's truth. A
   rule described here that the checked-in configuration does not enable is not
   enforced; report the gap instead of assuming it.
4. Check which SDK answers `dart`. A version manager rebinds it per project, so
   run `dart --version` from the package folder.
5. Apply the stricter rules to code you add or substantially change. Leave
   unrelated legacy inconsistencies alone.

## Pick a reference

| Concern                                                          | Reference                                                       |
| ---------------------------------------------------------------- | --------------------------------------------------------------- |
| Resolving the SDK, adding a dependency, or reproducing a build   | [toolchain.md](references/toolchain.md)                         |
| Configuring the analyzer or formatter, or silencing a diagnostic | [analysis-options.md](references/analysis-options.md)           |
| Naming a file or symbol, or settling a formatting question       | [naming-and-formatting.md](references/naming-and-formatting.md) |
| Publishing a library surface, importing, or splitting a `part`   | [libraries-and-imports.md](references/libraries-and-imports.md) |
| Declaring a type, a constant, or a domain data type              | [types-and-data.md](references/types-and-data.md)               |
| Throwing, catching, or translating a failure                     | [errors.md](references/errors.md)                               |
| Awaiting a `Future`, consuming a `Stream`, or cancelling work    | [async.md](references/async.md)                                 |
| Writing a dartdoc comment or generating API docs                 | [documentation.md](references/documentation.md)                 |
| Writing or running a `package:test` test                         | [testing.md](references/testing.md)                             |

## Do the work

1. Keep every changed public declaration inside the SDK constraint in
   `pubspec.yaml` and inside what `pubspec.lock` supplies.
2. Give each changed public declaration an explicit type and a doc comment, with
   no `dynamic` in its signature.
3. Await or explicitly hand off every `Future`; cancel every stream subscription
   its owner opened.
4. Add or update behavior tests under `test/` in files ending `_test.dart`. The
   runner finds no other filename.
5. Run checks from narrow to broad and read each result before widening:

   ```bash
   dart test test/orders_test.dart
   dart analyze lib/orders.dart
   dart format --output=none --set-exit-if-changed .
   dart analyze
   dart test
   ```

6. In change mode, format the scoped files with `dart format` before checking.
   When you touched `pubspec.yaml`, rerun `dart pub get` and commit the pubspec
   with its lockfile wherever the package tracks one.

Inspect the diff after `dart format` or `dart fix --apply`; both rewrite files.
Report the exact commands, their results, the analyzer exclusions that limit
your confidence, and every check you did not run.

## Finish

Finish when `dart analyze` reports no new diagnostic in changed code,
`dart format --output=none --set-exit-if-changed .` reports no difference, the
affected tests pass under the project's SDK, every remaining suppression has a
reason, and the handoff names each check you could not run.
