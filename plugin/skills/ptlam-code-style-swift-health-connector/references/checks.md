# Swift Checks in This Repository

Which command proves the Swift side is clean, where it must run, and what this
project's SwiftLint and SwiftFormat configuration actually enforces. This file
owns the values this repository commits, not how the two tools work in general.

## Run every command from the monorepo root

Melos resolves script paths from the workspace root, so a command run inside the
package silently lints the wrong tree or nothing at all.

| Command                        | What it does                                                   |
| ------------------------------ | -------------------------------------------------------------- |
| `melos run analyze:swift`      | SwiftLint in `--strict` mode against `swiftlint-baseline.json` |
| `melos run format:swift`       | SwiftFormat, rewriting files in place                          |
| `melos run format:swift:check` | SwiftFormat in `--lint` mode, changing nothing                 |
| `melos run baseline:swift`     | Rewrites `swiftlint-baseline.json` from the current violations |
| `melos run analyze`            | Dart, then Swift, then Kotlin analysis                         |
| `melos run format`             | Dart, then Swift, then Kotlin formatting                       |

`analyze:swift` changes directory into `packages/health_connector_hk_ios/ios`
before running, so SwiftLint picks up `.swiftlint.yml` and the baseline from
there. `format:swift` passes that same directory as an argument instead.

## What SwiftLint enforces here

The configuration excludes `**/*.g.swift`, `**/.build/**`, and
`**/DerivedSources/**`. It sets `indentation: 4` to agree with SwiftFormat, and
reports through the `xcode` reporter.

| Metric rule                | Warning | Error |
| -------------------------- | ------- | ----- |
| `cyclomatic_complexity`    | 10      | 15    |
| `function_body_length`     | 100     | 200   |
| `type_body_length`         | 300     | 500   |
| `file_length`              | 500     | 1200  |
| `closure_body_length`      | 30      | 50    |
| `function_parameter_count` | 5       | 8     |
| `nesting` (`type_level`)   | 2       | none  |
| `identifier_name` length   | 2 to 50 | none  |

`cyclomatic_complexity` sets `ignores_case_statements: true`. That is what lets
the wide DTO dispatch switches in `mappers/` pass; do not treat it as licence
for branching logic outside a mapping switch. `identifier_name` also excludes
`id` and `db` by name.

`force_cast`, `force_try`, `force_unwrapping`, and
`implicitly_unwrapped_optional` are all set to `warning` rather than error.
Under `--strict` a warning still fails the build, so the practical rule is
unchanged: do not force-unwrap.

Three rules are disabled on purpose. Keep them disabled.

| Disabled rule    | Reason recorded in the config                |
| ---------------- | -------------------------------------------- |
| `todo`           | TODO comments are allowed                    |
| `line_length`    | SwiftFormat's `--maxwidth` owns width        |
| `trailing_comma` | Conflicts with SwiftFormat `--commas always` |

The opt-in set covers performance (`first_where`, `contains_over_filter_count`,
and peers), safety (`force_unwrapping`, `implicitly_unwrapped_optional`,
`identical_operands`, `discarded_notification_center_observer`), quality
(`closure_body_length`, `array_init`, `toggle_bool`, `yoda_condition`,
`function_default_parameter_at_end`), and documentation (`missing_docs`,
`fatal_error_message`, `expiring_todo`).

`capture_variable`, `unused_declaration`, and `unused_import` are declared under
`analyzer_rules`. Those need `swiftlint analyze` with a compiler log, and no
melos script runs it, so nothing enforces them today.

## What SwiftFormat enforces here

`--exclude **/pigeon` keeps the generated Pigeon file out of formatting.
`--swiftversion 5.9` is set in the config, which is why SwiftFormat reports that
it ignores the `.swift-version` file.

| Option                                                                       | Effect                                   |
| ---------------------------------------------------------------------------- | ---------------------------------------- |
| `--indent 4`, `--maxwidth 120`                                               | Layout                                   |
| `--commas always`                                                            | Trailing commas in multiline lists       |
| `--self remove`                                                              | No redundant `self.`                     |
| `--wraparguments`, `--wrapparameters`, `--wrapcollections` at `before-first` | One argument per line when wrapping      |
| `--closingparen balanced`, `--emptybraces linebreak`                         | Wrapped-call shape                       |
| `--semicolons never`, `--allman false`                                       | Statement and brace style                |
| `--header ignore`                                                            | Leaves the Pigeon copyright header alone |

## Treat the baseline as debt, not as a mute button

`swiftlint-baseline.json` records violations that already existed, such as the
`type_body_length` and `file_length` errors on `HealthConnectorClient.swift`.
`--strict` passes only because those entries are listed.

Fix a new violation. Do not run `melos run baseline:swift` to clear it:
regenerating the baseline records every violation present at that moment,
including the one you just introduced, and it disappears from review. Regenerate
only when the team deliberately accepts a new debt line, and say so in the
commit message.

## Know what CI actually gates

`.github/workflows/_reusable-swift-quality.yaml` runs SwiftLint with the same
flags from the package's `ios` directory. Its SwiftFormat lint step is commented
out, with a note that the job failed in CI while succeeding locally. Formatting
is therefore unenforced on the server; run `melos run format:swift:check`
yourself before you push.
