---
schema_version: 1
skill: ptlam-testing
canonical_path: skills/engineering/ptlam-testing
updated_at: 2026-08-11
---

# Project Testing Context

## Project profile

- Scope: TypeScript skill tooling under `../../../../plugin`, GitHub Release
  validation under `../../../../.github/scripts`, and repository tests.
- Runtime: Node.js 22.6 or newer in an ESM package. Use npm with the committed
  root lockfile. TypeScript entry points executed directly by Node use erasable
  syntax supported by the strip-only runtime.
- The [development guide](../../../../docs/DEVELOPMENT.md) owns authored and
  generated boundaries, test placement, commands, and local quality gates.
- [`../../../../package.json`](../../../../package.json),
  [`../../../../tsconfig.json`](../../../../tsconfig.json),
  [`../../../../vitest.config.ts`](../../../../vitest.config.ts), and
  [`../../../../biome.json`](../../../../biome.json) own the active runtime,
  toolchain, test, coverage, type-checking, lint, and formatting configuration.
- Revalidate this context when any governing file, CI workflow, supported Node
  version, test root, or quality command changes.

## Project testing contexts

### Repository TypeScript

- Applies to canonical TypeScript under `../../../../plugin` and
  `../../../../.github/scripts`, with tests under `../../../../tests`.
  Compiler-generated `../../../../skills`, `../../../../.claude-plugin`, and
  `../../../../.codex-plugin` outputs plus the root Copilot, Gemini, and Kimi
  manifests are validated through the installed compiler package's drift
  checks rather than counted as a second tested implementation. The root
  `../../../../README.md` is human-owned and outside compiler access.
- Use strict `tsc --noEmit` for static analysis, Vitest for tests, lifecycle,
  spies, and mocks, V8 for product-code coverage, and Biome for TypeScript
  linting and formatting. The root package manifest and lockfile own exact
  versions.
- Put the production or capability scope before the test level. Use the
  repository names `unit-tests/`, `integration-tests/`, and
  `conformance-tests/`, then mirror deeper capability folders when useful.
  GitHub Release validation tests mirror `.github/scripts` under
  `../../../../tests/.github/scripts/unit-tests`. This documented repository
  layout is an explicit project-local override of the TypeScript
  specialization's general source-adjacent placement preference.
- Treat `../../../../plugin/skills` as authored test input. The compiler creates
  one provider-neutral `../../../../skills` tree, including
  `../../../../skills/README.md`, while plugin drift checks cover each provider's
  exact manifest paths.
- Use explicit `GIVEN`, `WHEN`, and `THEN` comments in every test.
- Keep reusable semantic fakes beside their nearest common test scope. Use
  `vi.fn` or `vi.spyOn` for one-off observable interactions.
- `npm test` runs `tests/**/*.test.ts`; `npm run test:coverage` measures the
  canonical `plugin/**/*.ts` product roots with global minimums of 90% for
  statements, lines, and functions and 80% for branches. GitHub Release
  automation has focused unit tests but stays outside the product coverage
  denominator. Release metadata has focused unit and Git-backed integration
  tests under `../../../../tests/.github/scripts`.
- Run the full gate sequence in repository order: `npm run release:check`,
  `npm run plugin:verify`, `npm run code:typecheck`, `npm run code:check`,
  `npm run markdown:check`, `npm run test:coverage`, and `git diff --check`.
- CI runs release metadata validation, plugin verification, project analysis,
  tests, and coverage in one required job on pull requests and pushes to
  `main`.

## Testing preferences

For TypeScript production code and tests across the repository:

- Group every test in an explicit `describe` suite, including a suite with one
  test.
- Declare cases and modifiers with `it`, such as `it.each`; do not use the
  equivalent `test` alias.
- Prefer Vitest parameterized APIs when multiple cases exercise the same
  behavior contract and data shape.
- Use Vitest hooks for lifecycle setup and cleanup. Prefer `onTestFinished` for
  a resource created during one test or by a reusable fixture helper.
- Review generated tests for meaningful observable assertions, edge and failure
  cases, excessive mocking, correct Vitest APIs, mock cleanup, concise behavior
  names, and non-watch execution.
