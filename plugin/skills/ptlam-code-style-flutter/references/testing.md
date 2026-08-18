# Flutter Testing

The Flutter mechanics for each test level, test double, BLoC test, and widget
test.

Use the Flutter SDK's `flutter_test`,
[`bloc_test`](https://pub.dev/packages/bloc_test) for BLoC behavior, and
[`mockito`](https://pub.dev/packages/mockito) when the selected double is a
generated mock.

`flutter_test` layers `testWidgets`, `WidgetTester`, and the Flutter finders and
matchers on top of the same `group`, `test`, `expect`, and matcher API that
`package:test` defines, and re-exports `Timeout`, `Skip`, `Tags`, and
`addTearDown` from it. Only the Flutter additions below belong to this file.

## Supported local levels

| Selected level    | Flutter mechanic                                                                                                                                                                  |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Local unit        | `fvm flutter test` without a widget tree                                                                                                                                          |
| Local integration | `fvm flutter test` with real collaborators inside the selected local boundary and doubles only outside it; pump a widget tree only when UI collaboration is part of that boundary |
| UI golden         | `fvm flutter test` with a stable surface, deterministic fonts, locale, size, theme, and approved image baseline                                                                   |
| End-to-end        | `fvm flutter test integration_test` on the smallest real target that exposes the selected journey risk                                                                            |

The selected level determines the Flutter command. A directory name does not
select the level, and a local integration test need not pump a widget tree.

## BLoC tests

Use `blocTest` for event-driven state. Assert the emitted state sequence rather
than internal fields.

- `build` constructs the BLoC with its resolved collaborators.
- `seed` supplies the starting state without replaying setup events.
- `act` sends the event or invokes the operation under test.
- `expect` lists the states after the seed in order.
- `verify` checks an outgoing interaction only when the behavior contract makes
  that interaction observable.

Seed the state needed by the behavior. Replaying several events merely to reach
the starting condition gives the test unrelated failure paths.

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
annotation-holding file. Import that generated class and never edit it by hand.
Track it only when the repository tracks generated test outputs.

An unstubbed nice mock returns a simple legal value instead of throwing. Stub
every value the test uses, and stub asynchronous methods with `thenAnswer`:

```dart
when(repository.place(any)).thenAnswer((_) async => confirmation);
verify(repository.place(order)).called(1);
```

## Widget tests

Pump through one shared helper that installs the theme, localization provider,
and required `BlocProvider`s. Prefer `pump()` with an explicit duration over
`pumpAndSettle()`.

When `pumpAndSettle` times out, check for a looping animation, an always-visible
progress indicator, or a stream that keeps emitting. Pump a fixed duration or
drive the state to a settled value.

When a `blocTest` expectation never arrives, check whether the emitting future
was awaited and whether a `bloc_concurrency` transformer dropped the event.

Find widgets through user-visible semantics or an agreed key, not widget type or
tree position.
