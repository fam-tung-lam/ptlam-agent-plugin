# Universal Behavior Contract

Read this before writing, changing, or judging any test. It applies in
write-or-fix, TDD, and audit mode. Run-or-diagnose mode skips it, because that
mode changes no tests.

No repository convention, specialization, or tool document may remove these
rules. They may only refine the mechanics underneath them.

## Every test must

- verify behavior through a public interface, not through private methods,
  internal calls, or incidental structure;
- use Given-When-Then, through the tool's native API where one exists and
  otherwise through explicit `Given`, `When`, and `Then` comments;
- read as a behavior specification in the repository's domain language;
- derive its expected values from a specification, a worked example, or a known
  literal, never from the production algorithm;
- cover one coherent behavior, using several assertions only when they jointly
  describe that one outcome;
- prefer real collaborators inside the selected seam, and replace only a
  justified boundary;
- stay deterministic and isolated by controlling time, randomness, external
  services, and mutable global state at their boundaries; and
- clean up every resource it creates.

## Choosing between levels

Use a higher level only for a risk the lower one cannot establish.

Never repeat the same assertion across levels. Never let a coverage percentage
stand in for behavior-based design.

## Finish

Finish when every planned test states one observable risk and satisfies this
contract, before any stack-specific mechanic is chosen.
