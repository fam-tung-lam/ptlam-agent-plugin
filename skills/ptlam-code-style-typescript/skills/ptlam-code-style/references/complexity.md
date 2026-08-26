# Controlling Code Complexity

Keep code no more complex than the confirmed behavior and its safeguards
require. A shorter implementation is better only when it preserves the right
responsibility and leaves ownership clear.

## Prefer the first sufficient source

| Order | Prefer                                  | Sufficient when                                                             |
| ----- | --------------------------------------- | --------------------------------------------------------------------------- |
| 1     | No implementation                       | The confirmed contract does not require the proposed behavior               |
| 2     | Delete or reuse repository code         | Existing owned behavior already satisfies the same contract                 |
| 3     | Standard library                        | The supported runtime supplies the required semantics                       |
| 4     | Native platform capability              | Every declared target supplies the behavior or an accounted fallback        |
| 5     | Already-installed dependency            | Its existing contract and lifecycle cover the need without a new dependency |
| 6     | Minimum new code at the owning boundary | Earlier sources fail and new logic satisfies the complete behavior          |

When two sources are equally small, prefer the one that handles confirmed edge
cases and makes ownership easiest to trace. A new dependency is justified only
when its maintained contract removes more repository ownership than its
installation, update, security, licensing, and removal costs add.

## Keep complexity with its owner

- Put new behavior at the boundary already responsible for it.
- Fix a shared cause once when every affected caller already reaches that owner.
- Keep one coherent responsibility together even when splitting it would make an
  individual file or diff shorter.
- Defer speculative behavior until a confirmed contract requires it.
- Prefer direct established code over clever compression or indirection.
- Add an abstraction only for a demonstrated variation. Apply the evolution
  rules when repeated cases may justify one.

A confirmed contract is the signal to add code. `ptlam-architecturing` owns the
signal to add system structure such as a runtime, a store, or a second platform.

## Require preservation evidence

A deletion, reuse, substitution, or abstraction change is acceptable only when
the evidence appropriate to that decision supports it.

| Decision                  | Required evidence                                                                                          |
| ------------------------- | ---------------------------------------------------------------------------------------------------------- |
| Delete code               | No reachable caller, registration, external contract, migration role, or required side effect              |
| Reuse repository behavior | The same inputs, outputs, failures, lifecycle, and ownership                                               |
| Use library or platform   | Supported runtimes and targets provide the required semantics, edge cases, and fallback                    |
| Remove a dependency       | All call sites, targets, license duties, supply-chain needs, and lifecycle responsibilities are covered    |
| Add or remove abstraction | Present independent behavior, a required boundary, or demonstrated variation justifies the resulting shape |

Trace callers, shared implementations, boundaries, tests, configuration, and
generated owners before changing the responsibility. Account for reflection,
dependency injection, dynamic loading, code generation, external consumers, and
staged migrations when they can hide a use.

Preserve required behavior and verification together with trust boundaries,
data-loss prevention, security, accessibility, compatibility, operability, and
physical calibration when they apply. Similarity, line count, a
single-implementation interface, or a delegating wrapper is a lead to inspect,
not evidence that removal is safe.
