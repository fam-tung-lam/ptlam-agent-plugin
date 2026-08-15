# Run or Diagnose Mode

Read this when the user wants existing tests executed, or a failure explained.
Project files stay read-only. This mode skips the universal behavior contract
and the placement rules, because it changes no tests.

## Run the smallest useful scope

Resolve the exact command the repository establishes. Use the active
specialization's bundled fallback only when the repository defines none.

Run the smallest requested or failing scope first. Expand to a containing suite
only when that distinguishes the cause or establishes the requested result.

## Isolate the cause

Decide which one the current evidence points to: the test, the production
behavior, the expectation, the configuration, a dependency, or the execution
environment.

Report the cause and the smallest useful correction. Do not apply that
correction. Applying it needs write-or-fix mode, which the user selects
separately.

## Finish

Finish when the requested test result is recorded, or the failure cause is
isolated as far as the available evidence permits and the remaining uncertainty
is named.
