# Testing

The Flutter testing mechanics. The `ptlam-code-style` foundation owns what a
test must prove, how to choose a level, and how to place a double.

## Two levels, and what each covers

| Level | Directory | Covers |
| --- | --- | --- |
| Unit | `test/features/<name>/unit/` | Use cases, repositories, BLoCs, models, mappers — no widget tree |
| Integration | `test/features/<name>/integration/` | A pumped widget tree with real BLoCs and use cases, and fakes only at the outermost boundary |

Both run locally through `fvm flutter test`. On-device journeys with the
`integration_test` package are out of scope for now; add them only when a risk
genuinely needs a real device.

[file-organization.md](file-organization.md) owns the path. Mirror `lib/` into
`test/`, add the level, and suffix the file `_test.dart`.

## Name the test after the behavior

Use `group` for the unit under test and a `test` name that reads as a sentence
about what the caller observes:

```dart
group('PlaceOrderUseCase', () {
  test('returns rejected failure when the server declines the order', () {});
});
```

`calls repository once` names the mechanism, and it breaks on a refactor that
changed nothing a user can see.

Dart's `test` package has no Given-When-Then API, so mark the three phases with
`// Given`, `// When`, `// Then` comments. The foundation requires them.

## BLoC tests

Use `blocTest` for anything with events. Assert the emitted state sequence,
never the BLoC's internal fields.

- `build` constructs the BLoC with its fakes. Nothing else creates it.
- `seed` sets a starting state instead of dispatching events to get there.
- `expect` lists the states after the seed, in order.
- `verify` checks an outgoing interaction only when it is part of the contract.

Seed the state you need rather than replaying the events that produce it. A test
that dispatches four events to reach the case it is testing fails for four
unrelated reasons.

## Fakes first, Mocktail second

Write a hand-rolled fake for a boundary you use across several tests: a fake
repository holding a list in memory reads better and survives refactors.

Reach for Mocktail when you must assert an interaction or force an error path
that a fake cannot reach cleanly:

```dart
class MockOrdersRepository extends Mock implements OrdersRepository {}
```

- Call `registerFallbackValue` in `setUpAll` for every custom type used with
  `any()`. Without it the matcher throws at run time, not at compile time.
- Mocktail takes closures: `when(() => repo.place(any()))`, `verify(() => …)`.
- Stub only what the test reads. An over-stubbed mock passes after the real
  method is deleted.

The foundation owns where a double lives. In this layout that means: keep it in
the test that uses it, and promote it to `test/features/<name>/test_doubles/`
only once a second file needs it.

## Widget tests

Pump through one shared helper that installs the theme, the localization
provider, and the `BlocProvider`s the widget requires. A test that builds that
wrapper by hand breaks whenever the app shell changes.

Prefer `pump()` with an explicit duration over `pumpAndSettle()`.

**`pumpAndSettle` timed out** means the tree never stopped animating. The usual
causes are a looping animation, a progress indicator that is always visible, or
a stream that keeps emitting. Pump a fixed duration instead, or drive the state
to a settled value first.

**A `blocTest` expectation never arrives** usually means the emitting future was
never awaited, or a `bloc_concurrency` transformer dropped the event. Check the
transformer on the handler before suspecting the test.

Find widgets by their user-visible semantics or an agreed key, not by widget
type or tree position.

## Determinism

Inject the clock and the random source; never read `DateTime.now()` inside code
under test. Close every BLoC and dispose every controller a test creates.
