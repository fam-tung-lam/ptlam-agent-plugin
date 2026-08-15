# Running Vitest

Read this when running tests, choosing package scripts, or reporting proof.

## Scripts

For a new package, prefer these script meanings while respecting existing
names:

```json
{
  "scripts": {
    "test": "vitest",
    "test:run": "vitest run",
    "test:coverage": "vitest run --coverage",
    "test:watch": "vitest"
  }
}
```

Use the repository's own package manager and scripts. Do not assume `npm`, and
do not invoke an unpinned global binary.

## Running

Use file, line, name, project, or changed-file filters for fast focused runs.

Use `vitest run`, or the equivalent repository script, for reproducible proof
and for CI. Watch mode is an interactive feedback loop, never final
verification.

Run the repository's TypeScript command — commonly `tsc --noEmit` through a
script — alongside Vitest.

Run coverage after the focused and containing tests, when coverage is requested
or required.

## Reporting

Report coverage's actual provider, its reporters, the included production
scope, and the threshold result. Never imply that an unrun check passed.
