# DTOs, Entities, and Failures

How data crosses a layer: DTOs, domain entities, unions, and failures.

## A DTO is not a domain entity

A DTO mirrors an external shape — a JSON body, a stored record — field for
field, including the parts you dislike. A domain entity says what the
application means, in the domain's words.

Keep them separate types from the first version. Flutter is deliberately
stricter here than the general rule of splitting once the shapes disagree: a
vendor owns the wire shape and can change it in a release you do not control.

A feature DTO lives in `features/<name>/infrastructure/dtos/`; the domain entity
travels through application and presentation code. Name the DTO file for the
external shape it represents when a feature has more than one source. Put
entities, failures, and value objects in their matching folders under
`features/<name>/domain/`.

Map between them in an infrastructure adapter or data source, never in
application or presentation code. That mapping is the only place that knows the
API sends `"created_ts"` as an epoch integer, and it is where a contract change
gets caught.

## Generate the JSON, write the meaning

Annotate DTOs with [`json_annotation`](https://pub.dev/packages/json_annotation)
and let [`json_serializable`](https://pub.dev/packages/json_serializable)
produce the mapping through the shared code-generation command in
[SKILL.md](../SKILL.md#shared-toolchain). Hand-written `fromJson` drifts
silently as fields are added.

Use `@JsonKey` to record the wire name when it differs from the Dart name. Do
not rename the Dart field to match a wire name you would not have chosen.

Domain entities carry no serialization annotations. When one needs persisting,
it gets a DTO.

## Value objects carry meaning without identity

Put an immutable domain value such as an email address, money amount, or date
range under `features/<name>/domain/value_objects/` when it owns validation or
behavior. Compare it by value. Keep it free of serialization annotations and map
it to and from a DTO inside infrastructure.

Do not create a value object merely to wrap one primitive. The wrapper earns its
place when it prevents an invalid value, names a domain concept, or owns a rule.

## Freezed for immutable data

Use [`freezed_annotation`](https://pub.dev/packages/freezed_annotation) with
[`freezed`](https://pub.dev/packages/freezed) for DTOs, domain entities, BLoC
events, and BLoC states. It supplies equality, `copyWith`, and exhaustive
unions, all of which are wrong when hand-written under time pressure.

Check the installed Freezed major version before copying the shape below — both
the class declaration and the matching API changed across majors. The example
follows the `abstract`/`sealed` form and Dart 3 pattern matching, which replaced
`when` and `map`.

[state-management.md](state-management.md#keep-one-bloc-library-in-three-authored-files)
owns the `part` and `part of` layout that combines a BLoC's event and state into
one generated `*.freezed.dart` file.

```dart
@freezed
sealed class OrdersState with _$OrdersState {
  const factory OrdersState.initial() = OrdersInitial;
  const factory OrdersState.loading() = OrdersLoading;
  const factory OrdersState.loaded(List<Order> orders) = OrdersLoaded;
  const factory OrdersState.failed(OrdersFailure failure) = OrdersFailed;
}
```

Write domain services, invariants, and validation by hand. Freezed owns the data
shape, not the rules about it.

## "Not loaded yet" is a state, not a null

Flutter tightens where absence may live. A screen that has no data yet says so
through a variant of the Freezed state union above, never through a nullable
field on a loaded state.

A widget forced to test `orders == null` before it can render is reading a state
machine through the wrong type, and it cannot tell "still loading" from "loaded,
and empty".

## Failures cross the boundary, exceptions do not

Inside infrastructure, code throws whatever its library throws: `DioException`,
a platform exception, or a parse error.

The infrastructure adapter catches those and returns a domain failure—a sealed
type the use case and BLoC can match on. Application and presentation code never
see a library exception type, catch `Exception`, or inspect a status code.

Name failures for what the user or the caller must do about them:
`OrdersFailure.offline()`, `OrdersFailure.unauthorized()`,
`OrdersFailure.rejected(reason)`. `OrdersFailure.error500()` names the wire, not
the decision.

Keep one failure type per feature in `features/<name>/domain/failures/`.
