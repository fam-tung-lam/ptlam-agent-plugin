# Reviewing Dependency Changes

This file covers the extra evidence needed when a changeset alters a package
manifest, a dependency constraint, or a lockfile. Its findings go back through
the severity and verdict rules in `SKILL.md`.

## Establish what changed

1. Name every direct dependency added, removed, or updated, and the stated
   reason.
2. Read the whole lockfile diff. Separate direct changes from transitive
   additions, removals, version shifts, source changes, and platform-specific
   packages.
3. Find every production and build-time call site that uses the changed package.
   Read the upstream release, migration, and security notes for the exact old
   and new versions.

Done when the manifest intent, the resolved graph, the affected call sites, and
the compatibility evidence agree on what changed.

## Assess the risk

| Concern             | Evidence to require                                                                                   |
| ------------------- | ----------------------------------------------------------------------------------------------------- |
| Necessity           | Existing platform, standard-library, or repository code cannot meet the stated need                   |
| Compatibility       | Changed, removed, or deprecated APIs are absent or migrated at every affected call site               |
| Runtime and tooling | Engine, compiler, OS, peer, and build-tool requirements match the supported targets                   |
| Supply chain        | Package identity, source, maintenance state, license, integrity data, and known vulnerabilities       |
| Transitive graph    | New packages, source changes, duplicate versions, optional binaries, and install hooks are understood |
| Verification        | Focused behavior checks and the repository suite exercise the integration at the exact lockfile       |
| Reversibility       | Unrelated upgrades do not hide the failing package or make a safe revert impractical                  |

Use current authoritative sources for facts that go stale. Keep facts,
inferences, and unavailable evidence apart. A version number or a successful
install is not proof of compatibility.

Treat several dependency changes at once as a reviewability risk, not an
automatic defect. Admit a finding only when the combined change hides a material
cause, prevents adequate checks, or makes rollback unsafe.

## Check the lockfile and report

Confirm the repository's package manager produced the lockfile and that its
format, integrity fields, sources, and manifest constraints agree. Never repair
or regenerate it during a review.

Return only findings that pass the parent skill's gate. Record missing
changelog, vulnerability, license, install, or test evidence as verification
limits, and let the parent skill decide whether the gap makes the change not
ready.
