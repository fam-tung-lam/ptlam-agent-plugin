# Flutter Testing

The Flutter mechanics for each test level, test double, BLoC test, and widget
test.

Use the Flutter SDK's `flutter_test`,
[`bloc_test`](https://pub.dev/packages/bloc_test) for BLoC behavior, and
[`mockito`](https://pub.dev/packages/mockito) when the chosen double is a
generated mock.

`flutter_test` layers `testWidgets`, `WidgetTester`, and the Flutter finders and
matchers on top of the same `group`, `test`, `expect`, and matcher API that
`package:test` defines, and re-exports `Timeout`, `Skip`, `Tags`, and
`addTearDown`. Only the Flutter additions below belong here.

## Supported local levels

| Level             | Flutter mechanic                                                                                                                                                          |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Local unit        | `fvm flutter test` without a widget tree                                                                                                                                  |
| Local integration | `fvm flutter test` with real collaborators inside the chosen boundary and doubles only outside it; pump a widget tree only when UI collaboration is part of that boundary |
| UI golden         | `fvm flutter test` with a stable surface, deterministic fonts, locale, size, theme, and an approved image baseline                                                        |
| End-to-end        | `fvm flutter test integration_test` on the smallest real target that exposes the chosen journey risk                                                                      |

The chosen level decides the command. A folder name does not, and a local
integration test need not pump a widget tree.

## BLoC tests

Use `blocTest` for event-driven state. Assert the emitted state sequence, not
internal fields.

- `build` constructs the BLoC with its collaborators.
- `seed` supplies the starting state without replaying setup events.
- `act` sends the event or calls the operation under test.
- `expect` lists the states after the seed, in order.
- `verify` checks an outgoing interaction only when the behavior contract makes
  it observable.

Seed the state the behavior needs. Replaying several events just to reach the
starting condition gives the test unrelated failure paths.

## Generated Mockito mocks

Generate a nice mock from an annotation in the test source:

```dart
import 'package:mockito/annotations.dart';
import 'package:mockito/mockito.dart';

@GenerateNiceMocks([MockSpec<OrdersRepository>()])
import 'place_order_use_case_test.mocks.dart';
```

Run the shared `build_runner` command from
[SKILL.md](../SKILL.md#shared-toolchain). Mockito names the output after the
annotated file. Import that generated class and never edit it. Track it only
when the repository tracks generated test output.

An unstubbed nice mock returns a simple legal value instead of throwing. Stub
every value the test uses, and stub async methods with `thenAnswer`:

```dart
when(repository.place(any)).thenAnswer((_) async => confirmation);
verify(repository.place(order)).called(1);
```

## Widget tests

Pump through one shared helper that installs the theme, localization provider,
and required `BlocProvider`s. Prefer `pump()` with an explicit duration over
`pumpAndSettle()`.

When `pumpAndSettle` times out, look for a looping animation, an always-visible
progress indicator, or a stream that keeps emitting. Pump a fixed duration or
drive the state to a settled value. When a `blocTest` expectation never arrives,
check whether the emitting future was awaited and whether a `bloc_concurrency`
transformer dropped the event.

Find widgets through user-visible semantics or an agreed key, not widget type or
tree position.
