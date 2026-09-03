# Testing

The project's test-level order, and where each level lives and runs in the
monorepo. The loaded skills own `blocTest`, Mockito, widget-test, and
`package:test` mechanics.

## Prove at the highest level first

The loaded rules add a higher level only for a risk a lower level cannot
establish. This project replaces that order: a passing journey through the
composed app tells the agent the whole path works, and a unit suite alone
cannot. Choose levels in this order and stop when the remaining risk is covered:

| Order | Level             | Mechanic                                                                                                                                                          | Lives in                                            |
| ----- | ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------- |
| 1     | End-to-end        | `fvm flutter test integration_test` through `main()` on macOS or web; one journey per user-visible outcome you changed                                            | `apps/ptlam_agent_os/integration_test/` only        |
| 2     | Local integration | `fvm flutter test` pumping the feature's page with its real BLoC, use cases, and adapters; replace only the API client or platform plugin at the package boundary | `<package>/test/integration/`, mirroring `lib/src/` |
| 3     | UI golden         | `fvm flutter test` with deterministic fonts, locale, size, theme, and an approved image baseline                                                                  | `<package>/test/golden/`                            |
| 4     | Local unit        | `fvm flutter test` without a widget tree, for input combinations, failure mapping, and domain rules the levels above cannot reach economically                    | `<package>/test/unit/`, mirroring `lib/src/`        |

Every change to user-visible behavior adds or extends one end-to-end journey and
one local integration test in the owning feature. Add unit tests for the edge
cases those two leave uncovered; do not repeat their assertions. When the
end-to-end target cannot run on your machine (no macOS runner, no ChromeDriver),
run the local integration level and name the skipped journey in the handoff.

## Where tests run

Every test runs inside the package that owns the code under test. Run one
package with `fvm flutter test` from its directory; run every package with
`melos run test` from `src/app`; run end-to-end journeys with the
`test:e2e:macos` and `test:e2e:web` Melos scripts. The selected level determines
the command; a directory name does not.

Doubles shared across levels go in `<package>/test/test_doubles/`; a double one
level uses stays in that level's `test_doubles/`. Find widgets through an agreed
`ValueKey`, as the existing smoke test does, and follow its Given, When, Then
comment shape.
