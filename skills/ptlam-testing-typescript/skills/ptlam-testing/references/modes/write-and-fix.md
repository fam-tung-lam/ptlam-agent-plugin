# Write or Fix Mode

Read this when the user wants tests created or repaired. Apply the universal
behavior contract and the placement rules before this file.

## What you may change

Create or change tests freely inside the resolved scope.

In a testing-only task, make only small behavior-preserving production refactors
needed to expose a clean seam. Change observable production behavior only when
the request includes feature or bug-fix implementation, or the user confirms
that expansion.

## Before you change an assertion

Establish which one is actually wrong: the test, the implementation, the
expectation, or the environment.

Never weaken a valid assertion to make a failure pass. A green suite that no
longer states the behavior is worse than a red one.

## Finish

Finish when every created or changed test states one observable risk, satisfies
the universal contract, sits in its resolved location, and passes for the
expected reason.
