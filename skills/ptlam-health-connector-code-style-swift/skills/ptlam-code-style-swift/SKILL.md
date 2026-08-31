---
name: ptlam-code-style-swift
description:
  Write, review, and fix Swift library and application code against conventions
  for language mechanics, optionals, error handling, structured concurrency and
  actor isolation, the Swift Package Manager, SwiftFormat, and SwiftLint
  toolchain, documentation comments, and tests. Use when starting or
  standardizing a Swift package, changing Swift code or its lint and format
  configuration, reviewing Swift-specific design, or resolving a swift build,
  SwiftLint, or SwiftFormat failure. Use as the foundation for Swift platform
  and project specializations. Do not use for Objective-C.
---

# PTLam Swift Code Style

Rules for Swift library and application code: the package manifest, the
SwiftFormat and SwiftLint toolchain, naming and access control, optionals, type
choice, failure design, structured concurrency, documentation comments, and
tests. This skill owns Swift mechanics only; the foundation owns the standard.

## Required skills

### `ptlam-code-style`

**Reason:** Provides the language-neutral conventions and testing doctrine the Swift mechanics satisfy.

**Instructions:** Read and apply ptlam-code-style first.
Let it own precedence; complexity; source structure and boundaries;
naming and readability; data modeling; contracts; failures;
asynchronous lifetime; documentation; logging; the behavior contract;
test levels; test placement; and test doubles.
Use this skill only for Swift language, package, and tool mechanics.
This specialization may be stricter than the foundation, never
looser.

Read [ptlam-code-style](skills/ptlam-code-style/SKILL.md).

## Choose the mode and resolve the toolchain

1. Choose review or change mode under the inherited policy. Resolve the package
   root and read every applicable `AGENTS.md` down to the files in scope.
2. Read `Package.swift`, `.swift-version`, `.swiftformat`, `.swiftlint.yml`,
   `Package.resolved`, and the CI or workspace scripts. Note the tools version,
   language mode, platform floors, targets, and the real format, lint, build,
   and test commands.
3. Treat the checked-in configuration and the commands CI runs as the truth. An
   installed SwiftLint that no command invokes is not a gate.
4. Keep the requested surface fixed. In review, check the obligations below; in
   change mode, apply them to code you add or substantially change.

For a new package, use Swift Package Manager, the Swift 6 language mode,
SwiftFormat, SwiftLint, and Swift Testing. In an existing project, keep its
working toolchain until replacing it is part of the task.

## Pick a reference

| Concern                                                          | Reference                                               |
| ---------------------------------------------------------------- | ------------------------------------------------------- |
| Creating or changing the manifest, a target, or a dependency     | [package-manifest.md](references/package-manifest.md)   |
| Configuring SwiftFormat, or fixing a formatting failure          | [swiftformat.md](references/swiftformat.md)             |
| Configuring SwiftLint, reading its baseline, or silencing a rule | [swiftlint.md](references/swiftlint.md)                 |
| Naming symbols or files, splitting files, or choosing access     | [naming-and-access.md](references/naming-and-access.md) |
| Choosing struct, class, enum, or actor, or designing a protocol  | [types.md](references/types.md)                         |
| Reading, binding, or defaulting an optional                      | [optionals.md](references/optionals.md)                 |
| Throwing, catching, or converting an error                       | [errors.md](references/errors.md)                       |
| Writing async code, isolating state, or conforming to `Sendable` | [concurrency.md](references/concurrency.md)             |
| Writing a `///` documentation comment                            | [documentation.md](references/documentation.md)         |
| Writing a test, or declaring a test target                       | [testing.md](references/testing.md)                     |

## Do the work

1. Keep each changed declaration at the narrowest access level its real
   consumers allow. Preserve required or promised subclassing, including
   external consumers; otherwise mark the class `final`.
2. Replace forced value unwraps and casts with handled absence. Preserve a
   framework-managed `T!` only under the optionals reference's verified
   assignment-lifecycle exception.
3. Give each changed throwing function a named `Error` type whose cases a caller
   can act on.
4. Keep shared mutable state inside an `actor` or on `@MainActor`, and give
   every type that crosses an isolation boundary a real `Sendable` conformance.
5. Write a `///` comment on every declaration the package publishes.
6. In change mode, add or update behavior tests in the existing test target. In
   review, inspect existing coverage and report gaps.
7. Run permitted checks narrow to broad, stopping at the first failure:

```shell
swiftformat --lint --cache ignore Sources/Changed.swift
swiftlint lint --strict --quiet --no-cache Sources/Changed.swift
swift build
swift test --filter ChangedBehavior
swiftformat --lint --cache ignore .
swiftlint lint --strict --no-cache
swift test
```

Builds and tests can resolve dependencies and run plugins. In review, run them
only with dependencies already available and scripts, plugins, and temporary
outputs checked against the permitted effects; otherwise report the gap.

In change mode, `swiftformat Sources/Changed.swift` may fix formatting before
these checks. `swiftlint --fix` also rewrites files. Inspect the diff after
either: reflow can move the line a `// swiftlint:disable:next` applies to.

## Finish

For a change, finish when the package builds under its declared language mode,
SwiftFormat and strict SwiftLint pass, justified suppressions remain scoped, and
affected tests pass under the project's commands. For a review, report failures
and missing evidence without repairing them or implying an unrun gate passed.
