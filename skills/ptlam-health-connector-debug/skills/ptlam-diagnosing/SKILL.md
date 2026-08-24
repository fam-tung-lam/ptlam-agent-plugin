---
name: ptlam-diagnosing
description:
  Diagnose one failing software behavior and return a cause whose mechanism at
  the first failing boundary is demonstrated by named observations or a
  discriminating check with every remaining evidence-supported alternative
  excluded, or an exact evidence blocker and one discriminating next check. Use
  when software throws, returns the wrong result, hangs, crashes, regresses, or
  differs across environments and the requested result is a diagnosis. Compose
  this skill when a stack or project specialization adds diagnosis mechanics, or
  when an authorized fix workflow first needs the cause.
---

# PTLam Diagnosing

Diagnose one failing software behavior and return an evidence-backed report that
identifies a cause whose mechanism at the first failing boundary is demonstrated
by named observations or a discriminating check and excludes every remaining
evidence-supported alternative, or the exact evidence blocker and one
discriminating next check.

Keep the diagnosis read-only. A diagnosis request authorizes inspection and
scoped diagnostic checks; it does not authorize a fix or another intentional
change to source, configuration, dependencies, data, or external state.

## Establish the failure

1. Name one observable failure. Record the expected behavior, actual behavior,
   environment, smallest available reproduction, and applicable repository
   sources. Done when the diagnosis has one bounded symptom and evidence
   surface.
2. Preserve the original failure before enabling existing diagnostics or
   narrowing inputs. Use the narrowest safe reproduction or existing evidence
   when reproduction is unavailable. Done when the symptom is repeatable or the
   missing evidence is explicit.
3. Label every material claim by evidence status:

| Status      | Meaning                                                         |
| ----------- | --------------------------------------------------------------- |
| Observation | Directly seen in runtime output, logs, tests, source, or state. |
| Inference   | A conclusion supported by named observations.                   |
| Assumption  | An unverified condition the diagnosis currently relies on.      |

Done when a reader can distinguish what was observed from what was concluded or
assumed.

## Locate the failing boundary

Trace the observable path from the caller toward the symptom. At each boundary,
compare the input, output, side effect, completion, and failure mapping that
matter to the expected behavior. Record the last boundary that remains correct
and the first boundary that becomes wrong or loses evidence.

Complete this step when the failure is localized to the smallest supported
boundary, or when one missing observation prevents further localization.

## Rank and test hypotheses

1. List plausible causes at the unresolved boundary. Rank them by supporting
   evidence, then by how cheaply and decisively a safe check can falsify them.
2. Run the highest-value check within the available authority. Update the
   evidence status and ranking before exploring another hypothesis.
3. Admit a cause only when named observations or a discriminating check
   demonstrate its causal mechanism at the first wrong boundary and exclude
   every remaining evidence-supported alternative.

Stop exploring and report a cause only when it meets that threshold. Otherwise,
when the next discriminating check is unavailable or needs new authority, stop
with the exact evidence blocker and that next check. Do not turn a plausible
correction into a verified fix.

## Report and stop

| Field        | Required content                                                                                                                                                                              |
| ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Scope        | Expected behavior, actual behavior, environment, and reproduction status.                                                                                                                     |
| Observations | Relevant runtime and source evidence with commands or locations.                                                                                                                              |
| Boundary     | Last correct boundary and first wrong or unobserved boundary.                                                                                                                                 |
| Diagnosis    | Cause, named observations or discriminating check demonstrating its mechanism at the first wrong boundary, and excluded evidence-supported alternatives; or exact blocker and one next check. |
| Inferences   | Conclusions drawn from the observations.                                                                                                                                                      |
| Assumptions  | Unverified conditions that could change the diagnosis.                                                                                                                                        |
| Limits       | Checks not run, inaccessible evidence, and remaining uncertainty.                                                                                                                             |

Finish after this report. Never present an unrun check or guessed fix as
observed. Never call a cause demonstrated unless it meets the diagnosis
threshold above.
