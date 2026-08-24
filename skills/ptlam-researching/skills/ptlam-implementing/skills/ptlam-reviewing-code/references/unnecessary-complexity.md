# Reviewing Unnecessary Complexity

This reference owns the additional evidence needed when a changeset review
explicitly emphasizes over-engineering, deletion, or simplification. It returns
its findings to the complete review's finding gate, severity, and readiness
verdict.

## Establish each candidate

Apply the loaded minimum-change hierarchy to each responsibility added or
expanded by the changeset. Treat a shorter alternative as a candidate until the
review proves all of the following:

1. Existing repository behavior, the standard library, the declared platform, or
   an installed dependency supplies the same required behavior.
2. The proposed deletion or replacement preserves callers, edge cases, failure
   handling, trust boundaries, accessibility, compatibility, and required
   verification.
3. The reduction removes a concrete present maintenance cost instead of moving
   the same complexity behind another name or boundary.

Inspect call sites, configuration, runtime targets, dependency manifests, and
tests before calling an abstraction unused or a path redundant. Account for
reflection, registration, code generation, external consumers, and staged
migrations when they can hide a real use.

Finish this stage when every candidate has a traced replacement and a concrete
present cost, or has been rejected as an unsupported smell.

## Report through the complete review

For a surviving candidate, state what can be removed, what supplies the same
behavior, and which evidence proves the substitution. Quantify lines or
dependencies only when the exact reduction is countable from the pinned diff.

Return only findings that pass the parent skill's finding gate. Complete every
other review concern, record unavailable proof as a verification limit, and let
the parent skill set severity and readiness. A successful simplification pass
does not by itself make the changeset ready.
