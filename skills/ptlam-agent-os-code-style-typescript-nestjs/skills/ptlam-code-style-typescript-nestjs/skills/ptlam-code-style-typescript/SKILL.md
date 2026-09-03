---
name: ptlam-code-style-typescript
description:
  Write, review, and fix TypeScript library and application code against
  conventions for language mechanics, module boundaries, tooling, and tests. Use
  when starting or standardizing a TypeScript project, changing TypeScript code
  or its toolchain, reviewing TypeScript-specific design, or resolving
  type-check, lint, or Vitest failures. Use as the foundation for TypeScript
  framework specializations. Do not use for non-TypeScript code.
---

# PTLam TypeScript Code Style

Rules for TypeScript library and application code: the development toolchain,
module boundaries, imports, the type system, runtime validation, async work,
errors, doc comments, logging, and tests. This skill owns TypeScript mechanics
only; the foundation owns the standard.

## Required skills

### `ptlam-code-style`

**Reason:** Provides the language-neutral conventions and testing doctrine the TypeScript mechanics satisfy.

**Instructions:** Read and apply ptlam-code-style first.
Let it own precedence; complexity; source structure and boundaries;
naming and readability; data modeling; contracts; failures;
asynchronous lifetime; documentation; logging; the behavior contract;
test levels; test placement; and test doubles.
Use this skill only for TypeScript language, package, and tool
mechanics.
This specialization may be stricter than the foundation, never
looser.

Read [ptlam-code-style](skills/ptlam-code-style/SKILL.md).

## Before review or change

Choose review or change using the inherited mode policy. In review, use
installed tools without dependency installation or package builds. The toolchain
reference gives the check-mode commands.

1. Resolve the package root and read every applicable `AGENTS.md` from the
   repository root down to the files in scope.
2. Read `package.json`, the lockfile, every `tsconfig*.json` covering the files,
   the formatter, linter, and test configuration, CI, and the nearest source and
   tests. Note the Node floor, package manager, module system, build output,
   type-check command, formatter, linter, test runner, and their real commands.
3. Treat executable configuration and CI as the truth. An installed dependency
   does not prove the project runs it.
4. Apply the stricter rules to code you add or substantially change. Leave
   unrelated legacy inconsistencies alone.

For a new project, pin Node in `.nvmrc`, use npm with a committed lockfile,
publish ES modules, run TypeScript in strict mode as a no-emit checker, use
Biome for formatting, linting, and import order, and use Vitest with
`@vitest/coverage-v8`. In an existing project, keep its working toolchain until
replacing it is part of the task.

## Pick a reference

| Concern                                                               | Reference                                                   |
| --------------------------------------------------------------------- | ----------------------------------------------------------- |
| Creating or standardizing the environment, checks, or CI              | [dev-toolchain.md](references/dev-toolchain.md)             |
| Adding a module, publishing an entry point, or fixing an import cycle | [modules-and-imports.md](references/modules-and-imports.md) |
| Writing or changing types, generics, and compiler-visible contracts   | [typing.md](references/typing.md)                           |
| Accepting data from outside the program (payload, file, env var)      | [runtime-validation.md](references/runtime-validation.md)   |
| Doing I/O, or managing concurrent work and resource lifetime          | [async.md](references/async.md)                             |
| Throwing, catching, translating, or keeping an error                  | [errors.md](references/errors.md)                           |
| Writing a TSDoc comment or generating API docs                        | [documentation.md](references/documentation.md)             |
| Emitting or configuring logs                                          | [logging.md](references/logging.md)                         |
| Writing, placing, configuring, or reshaping a Vitest test             | [testing.md](references/testing.md)                         |

## Do the work

1. Keep every changed public surface intentional and compatible with the
   package's entry points, module system, and supported Node versions.
2. Give changed production values precise types. Keep runtime validation
   separate from static typing: types are erased before the program runs, so the
   compiler never checks data that arrives from outside.
3. Give every promise an owner that awaits it or handles its failure, and
   release every resource on success, failure, and cancellation.
4. Add or update behavior tests in the existing test home for the normal,
   boundary, and failure cases the change touches.
5. Run checks narrow to broad: focused tests, the type check, the formatter and
   linter on changed files, then project-wide gates. In change mode, run the
   build when the change affects distribution.
6. In change mode, install a changed published package's built artifact in a
   throwaway project and import its changed entry points under every module
   system the package declares.

Inspect the diff after any write-mode formatter, linter fix, or hook. Report the
exact commands, their results, configured exclusions that affect confidence, and
every check you did not run.

## Finish

Finish when the changed code keeps its entry-point and serialization contracts,
adds no new type or lint failure, leaves no promise unowned and no resource
unreleased, and passes the affected behavior tests under the project's real
toolchain.
