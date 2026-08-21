# Reviewing Dependency Changes

This reference owns the additional evidence needed when a reviewed changeset
alters a package manifest, dependency constraint, or lockfile. It returns its
findings to the severity and verdict standard in `SKILL.md`.

## Establish the dependency delta

1. Name every direct dependency added, removed, or updated and the requested
   reason for the change.
2. Inspect the complete lockfile delta. Separate direct changes from transitive
   additions, removals, version shifts, source changes, and platform-specific
   packages.
3. Find every production and build-time call site that relies on the changed
   package. Read applicable upstream release, migration, and security evidence
   for the exact old and new versions.

Finish this step when the manifest intent, resolved graph, affected call sites,
and authoritative compatibility evidence agree on what changed.

## Assess the introduced risk

| Concern             | Evidence to require                                                                                   |
| ------------------- | ----------------------------------------------------------------------------------------------------- |
| Necessity           | Existing platform, standard-library, or repository utilities cannot meet the stated need              |
| Compatibility       | Changed, removed, or deprecated APIs are absent or migrated at every affected call site               |
| Runtime and tooling | Engine, compiler, operating-system, peer, and build-tool requirements match supported targets         |
| Supply chain        | Package identity, source, maintenance state, license, integrity data, and known vulnerabilities       |
| Transitive graph    | New packages, source changes, duplicate versions, optional binaries, and install hooks are understood |
| Verification        | Focused behavior checks and the repository suite exercise the integration at the exact lockfile       |
| Reversibility       | Unrelated upgrades do not obscure the failing package or make a safe revert impractical               |

Use current authoritative sources for facts that can become stale. Keep facts,
inferences, and unavailable evidence distinct. A version number or successful
installation is not compatibility proof.

Treat multiple dependency changes as a reviewability risk, not an automatic
defect. Admit a finding only when the combined change hides a material cause,
prevents adequate verification, or makes rollback unsafe.

## Verify the lockfile and report

Confirm the repository's package manager produced the lockfile and that its
format, integrity fields, sources, and manifest constraints agree. Never repair
or regenerate it during review.

Return only findings that pass the parent skill's finding gate. Record missing
changelog, vulnerability, license, install, or test evidence as verification
limits, and let the parent skill decide whether the gap makes the change not
ready.
