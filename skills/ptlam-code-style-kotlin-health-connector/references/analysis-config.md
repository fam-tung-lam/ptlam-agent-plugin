# ktlint and detekt in This Module

Two tools split the work. ktlint owns formatting and is configured entirely in
`android/.editorconfig`; detekt owns structural analysis and is configured in
`android/detekt.yml` with `buildUponDefaultConfig = true`. Neither tool sees a
`*.g.kt` file: `android/build.gradle` excludes `**/*.g.kt` and `**/generated/**`
from both, and `.editorconfig` disables ktlint for `[**/*.g.kt]` as well.

`./gradlew detekt`, which `melos run analyze:kotlin` runs, analyses
`src/main/kotlin` only, because `build.gradle` sets
`source.setFrom("src/main/kotlin")`. `./gradlew lintAll` in `android/` is the
wider check: it runs `ktlintCheck` plus `detektAll`, which covers the main and
test source sets.

## Where this project deviates from the defaults

| Setting                                                    | Value here                                                                                    | Why                                                                   |
| ---------------------------------------------------------- | --------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| `ktlint_code_style`                                        | `android_studio`                                                                              | Android module conventions                                            |
| `ktlint_standard_package-name`                             | disabled                                                                                      | The package is snake_case, as Flutter plugin naming requires          |
| detekt `naming > PackageNaming`                            | inactive                                                                                      | The same snake_case package                                           |
| `ktlint_standard_binary-expression-wrapping`               | disabled                                                                                      | It fights the IntelliJ formatter                                      |
| detekt `BracesOnIfStatements` and `BracesOnWhenStatements` | inactive                                                                                      | ktlint enforces both, so detekt would duplicate the finding           |
| Trailing commas                                            | required on call and declaration sites                                                        | Smaller diffs                                                         |
| Wildcard imports                                           | forbidden; star-import threshold set to 999                                                   | Explicit imports only                                                 |
| Import order                                               | `android.`, `androidx.`, `*`, `java.`/`javax.`, `kotlin.`, aliases, blank line between groups | Google Android style                                                  |
| Line length                                                | 100, in `.editorconfig` and in detekt's `MaxLineLength`                                       | One limit, enforced by both tools; detekt excludes comment statements |

## Real detekt thresholds

| Rule                      | Threshold                                                                         |
| ------------------------- | --------------------------------------------------------------------------------- |
| `LongMethod`              | 60 lines                                                                          |
| `LargeClass`              | 600 lines                                                                         |
| `CyclomaticComplexMethod` | 15                                                                                |
| `CognitiveComplexMethod`  | 25                                                                                |
| `NestedBlockDepth`        | 3                                                                                 |
| `ComplexCondition`        | 4                                                                                 |
| `LongParameterList`       | 6 for functions, 7 for constructors                                               |
| `TooManyFunctions`        | 10, in classes, interfaces, objects, and enums                                    |
| `ReturnCount`             | 3, `equals` excluded                                                              |
| `MagicNumber`             | `-1`, `0`, `1`, `2` allowed; property declarations, enums, and annotations exempt |
| `build > maxIssues`       | 0, so any unbaselined finding fails the task                                      |

## Suppress with a written reason, and leave the baseline alone

`android/detekt-baseline.xml` holds 25 findings that predate the current rules.
Treat it as frozen. Fix a new finding, or suppress it in code with a reason;
regenerating the baseline with `melos run baseline:kotlin` hides your finding
among the existing ones and is a deliberate, separately reviewed act.

The in-code form is a `//` comment directly above `@Suppress`, naming the rule
and why it does not apply here:

```kotlin
// Suppress "TooManyFunctions" as `HealthConnectorClient` is a facade for multiple services.
@Suppress("TooManyFunctions", "LongParameterList")
internal class HealthConnectorClient ...
```

The dispatching mappers in `mappers/health_record_mappers/` already share one
such comment. Reuse its wording when you add another one instead of writing a
new phrasing for the same decision.

Finish when `melos run format:kotlin:check` and `melos run analyze:kotlin` both
pass, the baseline file is unchanged, and every new `@Suppress` states its
reason above the annotation.
