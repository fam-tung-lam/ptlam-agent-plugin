# House Doc-Comment Structure

This reference owns the section layout of a public API doc comment in this
repository and the dartdoc categories it feeds. The Dart skill owns dartdoc
syntax, and the language-neutral foundation owns what a doc comment is for.

The documentation lints in [analyzer-contract.md](analyzer-contract.md) make a
missing or dangling comment a build failure, so treat the structure below as
part of the code, not a courtesy.

## The section order

Open with one sentence naming what the thing is, then a paragraph of context.
Then use only the sections that apply, in this order:

| Section               | Include when                                                 |
| --------------------- | ------------------------------------------------------------ |
| `## Platform Mapping` | The symbol maps to a named Health Connect and HealthKit type |
| `## Capabilities`     | A data type: which of read, write, aggregate, delete it has  |
| `## Parameters`       | A constructor or method with named parameters                |
| `## Returns`          | The return value needs more than the signature says          |
| `## Throws`           | Any exception or error the caller can hit                    |
| `## Example`          | A caller would otherwise have to guess how to assemble it    |
| `## See also`         | A paired type, an alternative, or an enforcing annotation    |

`## Platform Mapping` names the native type on each platform as a link:

```dart
/// ## Platform Mapping
///
/// - **Android Health Connect**: [`StepsRecord`](https://developer.android.com/reference/kotlin/androidx/health/connect/client/records/StepsRecord)
/// - **iOS HealthKit**: [`HKQuantityTypeIdentifier.stepCount`](https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifier/stepcount)
```

`## Parameters` and `## Throws` are `- [name]: …` bullet lists. A `## Throws`
entry names the exact type — `ArgumentError` for constructor validation,
`UnsupportedOperationException` for a platform refusal — and the condition that
produces it.

Use the exact headings above. `## Example` and `## See also` are the two most
often written with the wrong case; the repository's dominant form is singular
`## Example` and lower-case `also`.

## Close with a category tag

The last line of the comment is a `{@category …}` tag. Only these six are wired
into `packages/health_connector/dartdoc_options.yaml`:

| Category         | Applies to                                              |
| ---------------- | ------------------------------------------------------- |
| `Core API`       | `HealthConnector` and its configuration                 |
| `Health Records` | Data types, records, measurement units, and their enums |
| `Permissions`    | Permission types and statuses                           |
| `Exceptions`     | `HealthConnectorException` and its subtypes and codes   |
| `Logging`        | Logger, log model, and processors                       |
| `Annotations`    | Every annotation in `lib/src/annotations/`              |

A tag naming a category that file does not declare produces no navigation entry,
because `showUndocumentedCategories` is false. Add the category to
`dartdoc_options.yaml` with a `doc/topics/*.md` file before you use a new one.

## Where the generated site draws its lines

`dartdoc_options.yaml` applies `nodoc: lib/src/**`, so only the exported library
surface appears. Add `/// @nodoc` to a comment on an exported-but-internal
symbol, such as the `validation_utils.dart` helpers, to keep it off the site
while satisfying the lint. It also promotes `unresolved-doc-reference` and
`broken-link` to errors, so `melos run doc:generate` fails on a dangling link
even when analysis passed.
