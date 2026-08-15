# Stack Defaults and File Placement

Read this to learn which tools this specialization prefers and where test files
go. The `ptlam-testing` foundation still owns scope, level, behavior, doubles,
TDD, auditing, and verification depth.

## Scope boundary

Apply these preferences to framework-free, browser-free TypeScript libraries,
Node.js code, CLIs, and tooling.

They do not own DOM simulation, browser execution, component mounting,
rendering, routing, or test utilities for web application frameworks. When code
needs a browser or a web framework, return to the foundation and use a
scope-specific specialization.

The bundled Vitest API references come from upstream documentation; their
provenance is in [Acknowledgements](../ACKNOWLEDGEMENTS.md). Treat that snapshot
as this skill's API contract. When installed types or command output contradict
it, follow applicable `AGENTS.md` guidance or report the mismatch. Do not add a
separate environment-selection workflow.

## Defaults

| Concern | Preferred choice | Selection rule |
| --- | --- | --- |
| Transformation | Vite | Reuse the project's aliases, plugins, and module resolution. |
| Test runner | Vitest | Use the installed project version and repository scripts. |
| Coverage | `@vitest/coverage-v8` | Prefer V8; choose Istanbul only for a demonstrated compatibility need. |
| Runtime tests | `foo.ts` → `foo.test.ts` | Use beside-source placement when the repository has no established layout. |
| Type-contract tests | `foo.ts` → `foo.test-d.ts` | Use beside-source placement when the repository has no established layout. |
| Definition API | `describe` and `it` | Import explicitly; do not author cases with `test`. |
| Complex output | `toMatchSnapshot` | Use when the complete stable structure is the behavior. |
| Language-specific output | `toMatchFileSnapshot` | Await it and pass an explicit relative golden-file path. |
| Test environment | `node` | Browser and DOM environments are outside this skill. |
| API access | Explicit imports from `vitest` | Preserve established globals only when migration is outside scope. |
| Verification mode | `vitest run` | Use watch mode only for interactive development. |

## Where test files go

Follow the repository's established layout first. When the repository and the
user both leave placement open, put tests beside their source:

```text
src/domain/foo.ts
src/domain/foo.test.ts
src/domain/foo.test-d.ts
```

## Snapshots

Use `toMatchSnapshot` for a complex but stable result:

```ts
expect(result).toMatchSnapshot();
```

For output that varies by language, use a separate explicitly named golden file
and await the assertion:

```ts
await expect(germanOutput).toMatchFileSnapshot(
  "./snapshots/de/format-message.txt",
);
```

Treat every new or updated snapshot as expected test data: compare it against
the specification before accepting it.
