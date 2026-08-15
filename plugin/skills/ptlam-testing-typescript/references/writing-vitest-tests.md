# Writing Vitest Tests

Read this when authoring or changing Vitest test code. The `ptlam-testing`
foundation owns what a test must prove; this file owns how to express it in
Vitest.

## Structure

Use `describe` for the public subject or capability, and `it` for behavior
cases. Keep the foundation's Given-When-Then structure inside every `it` block.

Vitest has no native Given-When-Then API, so mark the three parts with explicit
comments.

## API use

- Import only the APIs you use — `describe`, `it`, `expect`, hooks, `vi` — from
  `vitest`.
- Author cases with `describe` and `it`. The bundled upstream references may
  show the equivalent `test` alias to preserve API context; translate case
  declarations and modifiers to `it` in project code.
- Keep assertions at a framework-free, browser-free public TypeScript seam. Do
  not introduce DOM helpers, browser automation, component harnesses, or
  framework test utilities through this skill.
- Await asynchronous assertions and promises. Use `resolves` and `rejects` when
  they make the expected outcome clearer.
- Use `it.each`, or the installed version's supported equivalent, when several
  inputs prove the same behavior. Keep the case data readable as a
  specification.
- Use `expectTypeOf` or `assertType` for deliberate type-contract tests. Keep a
  separate repository type-check command, because runtime tests and isolated
  type assertions do not replace whole-project TypeScript analysis.
- Prefer explicit expected values and focused matchers.
- Never commit `it.only`. Treat `skip`, `todo`, and expected-failure tests as
  visible debt with a stated reason, where applicable `AGENTS.md` permits them.

## Doubles and mutable runtime state

Follow the foundation's test-double rules before choosing a Vitest mechanism.
Once a justified boundary remains:

- use `vi.spyOn` when the real object should stay in use and only one observable
  boundary needs control or verification;
- use `vi.fn` for an explicit function-shaped fake or stub;
- use `vi.mock` for a module boundary only when dependency injection or a real
  collaborator is not the better seam;
- remember that `vi.mock` is hoisted, and use the installed version's supported
  dynamic-mocking API only when import timing requires it; and
- restore fake timers, system time, globals, environment variables, spies, and
  dynamically mocked modules in the narrowest reliable lifecycle.

Use async timer controls for code that schedules promise work.

Avoid concurrent tests when they share mutable globals, fake time, ports, files,
databases, or any other resource that cannot be isolated.
