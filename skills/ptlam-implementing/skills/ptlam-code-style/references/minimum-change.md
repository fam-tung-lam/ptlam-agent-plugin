# Choosing the Minimum Change

Choose the smallest behavior-preserving change after understanding the requested
behavior and the code path that owns it. A short diff is useful only when it
fixes the right responsibility.

## Understand before minimizing

1. Resolve the required behavior and the higher-precedence source that requires
   it. Leave speculative behavior unbuilt and name that decision in the handoff.
2. Trace the affected flow through its callers, shared implementations,
   boundaries, tests, and generated owners. For a defect, locate the shared root
   cause before editing the reported symptom.
3. Record the behavior and safeguards the solution must preserve. Include trust
   boundaries, data-loss prevention, security, accessibility, compatibility, and
   physical calibration when they apply.

Finish this stage when the required behavior, owning location, callers, and
non-negotiable safeguards are known.

## Stop at the first sufficient option

| Order | Prefer                                  | Sufficient when                                                             |
| ----- | --------------------------------------- | --------------------------------------------------------------------------- |
| 1     | No implementation                       | The confirmed contract does not require the proposed behavior               |
| 2     | Delete or reuse repository code         | Existing owned behavior already satisfies the same contract                 |
| 3     | Standard library                        | The supported runtime supplies the required semantics                       |
| 4     | Native platform capability              | A declared target supplies the behavior without custom code                 |
| 5     | Already-installed dependency            | Its existing contract and lifecycle cover the need without a new dependency |
| 6     | Minimum new code at the owning boundary | Earlier options fail and the new logic satisfies the complete behavior      |

When two options are equally small, choose the one that handles the confirmed
edge cases and leaves the clearest ownership. Add a new dependency only when its
maintained contract removes more repository ownership than its installation,
update, security, licensing, and removal costs add.

## Keep the reduction honest

- Fix a shared cause once when every affected caller already routes through it.
- Keep one coherent responsibility together even when splitting it would make an
  individual file or diff look shorter.
- Add an abstraction only for a demonstrated variation. Apply the evolution
  rules when repeated cases may justify one.
- Prefer direct, established code over clever compression.
- Preserve the verification required by the behavior and its risk.

Finish when no earlier sufficient option remains, the change sits at the owning
boundary, and every removed moving part preserves the confirmed behavior and
safeguards.
