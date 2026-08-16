# State Management

How Flutter chooses, structures, and connects state holders. Use
[`flutter_bloc`](https://pub.dev/packages/flutter_bloc) for BLoCs and Cubits,
and [`bloc_concurrency`](https://pub.dev/packages/bloc_concurrency) when an
event handler needs an explicit ordering policy.

## Choose the smallest state holder

| Situation | Use |
| --- | --- |
| Ephemeral state no other widget or rule observes | `setState`, `ValueNotifier`, or a controller |
| A small synchronous view model, such as one local form step | `Cubit` |
| Multiple external event sources, cancellation, or recovery | `Bloc` |

A simple one-shot action may stay a `Cubit`. Promote to `Bloc` when a second
event source appears, not in anticipation of one.

One page observes one primary state holder. When a page needs a second, ask
whether the second belongs to a child component or a separate feature.

## BLoC rules

- Expose domain or view state, never a response, persistence record, plugin
  exception, or provider claim.
- Never take `BuildContext`, a widget, or another BLoC as a dependency.
- Declare a `bloc_concurrency` transformer whenever handler ordering matters.
  Omitting one means concurrent handling.
- Close every subscription the BLoC opens in `close()`.

## Keep one BLoC library in three authored files

Keep the BLoC, event, and state in separate files. Make the event and state
files parts of the BLoC library so Freezed produces one generated file.
[models.md](models.md#freezed-for-immutable-data) owns the Freezed mechanics.

```dart
// orders_bloc.dart
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:freezed_annotation/freezed_annotation.dart';

part 'orders_event.dart';
part 'orders_state.dart';
part 'orders_bloc.freezed.dart';

final class OrdersBloc extends Bloc<OrdersEvent, OrdersState> {
  OrdersBloc() : super(const OrdersState.initial());
}
```

```dart
// orders_event.dart
part of 'orders_bloc.dart';

@freezed
sealed class OrdersEvent with _$OrdersEvent {
  const factory OrdersEvent.started() = OrdersStarted;
}
```

```dart
// orders_state.dart
part of 'orders_bloc.dart';

@freezed
sealed class OrdersState with _$OrdersState {
  const factory OrdersState.initial() = OrdersInitial;
}
```

The BLoC file owns the only `*.freezed.dart` directive. Never add a generated
part directive to the event or state file.

## Connect BLoCs in the widget layer

Do not inject one BLoC into another. Let a `BlocListener` observe the first and
dispatch an event to the second. This keeps the edge visible where the widget
lifecycle already owns both state holders.
