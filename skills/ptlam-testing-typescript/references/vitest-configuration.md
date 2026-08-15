# Vitest Configuration

Read this when creating or changing Vite, Vitest, or coverage configuration.
Adapt every path and option to repository evidence and the installed Vitest
version.

## Configure Vite and Vitest

1. Keep one owner for shared aliases and plugins. When the project already has
   `vite.config.ts`, either add a small `test` section there or merge that
   configuration into `vitest.config.ts`. Do not repeat shared settings in two
   files.
2. Prefer a separate `vitest.config.ts` when test-only settings are substantial,
   or when the production Vite configuration should stay focused. Use
   `defineConfig` from `vitest/config`, and `mergeConfig` when sharing an
   existing Vite configuration.
3. Use the `node` environment. Do not add Browser Mode, `jsdom`, `happy-dom`, or
   another DOM or browser environment through this skill.
4. Preserve isolation. Enable `clearMocks` and `restoreMocks` for a new suite.
   Do not enable blanket mock resetting when tests intentionally provide
   reusable implementations.
5. Scope discovery with precise include patterns or `test.dir`. Exclude build
   output and generated artifacts. Do not use broad exclusions to compensate for
   an unclear test root.
6. Keep retries disabled. Add a bounded retry only for a documented
   nondeterministic external boundary that the selected test level must cover.

A minimal new configuration looks like this:

```ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    globals: false,
    clearMocks: true,
    restoreMocks: true,
    retry: 0,
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      include: ["src/**/*.ts"],
    },
  },
});
```

## Configure coverage

1. Install the coverage package matching Vitest's version. Prefer
   `@vitest/coverage-v8`; use `@vitest/coverage-istanbul` only for an identified
   runtime or instrumentation requirement.
2. Define `coverage.include` for the production files in scope, so that
   completely unexecuted files still appear in the report. Exclude declarations,
   generated code, tests, and fixtures only when they are not production
   behavior.
3. Use terminal text output locally and HTML for inspection. Add `lcov`, JSON,
   or another reporter only when CI or another consumer requires it.
4. Apply numeric thresholds only when the user or the repository defines them.
   Preserve established thresholds. Never invent a percentage, and never lower
   one to make a run pass.
5. Treat uncovered code as a prompt to inspect behavior and risk, not as an
   instruction to test private branches or duplicate assertions.
6. Use provider-specific ignore comments only for code that cannot yield useful
   behavior coverage, and preserve required comment annotations through Vite's
   transformation pipeline.

For Vitest 4 and later, use `coverage.include` rather than removed settings such
as `coverage.all`. Verify every version-sensitive coverage option against the
installed major version.
