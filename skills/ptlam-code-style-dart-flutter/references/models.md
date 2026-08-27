# DTOs, Entities, and Failures

How data crosses a layer: DTOs, domain entities, unions, and failures.

## A DTO is not a domain entity

A DTO mirrors an external shape, such as a JSON body or a stored record, field
for field, including the parts you dislike. A domain entity says what the
application means, in the domain's words.

Keep them separate from the first version. Flutter is stricter here than the
general rule of splitting once the shapes disagree: a vendor owns the wire shape
and can change it in a release you do not control.

A feature DTO lives in `features/<name>/infrastructure/dtos/`; the entity
travels through application and presentation code. Put entities, failures, and
value objects in their folders under `features/<name>/domain/`. Map between them
in an infrastructure adapter or data source, never in application or
presentation code. That mapping is the only place that knows the API sends
`"created_ts"` as an epoch integer.

## Generate the JSON, write the meaning

Annotate DTOs with [`json_annotation`](https://pub.dev/packages/json_annotation)
and let [`json_serializable`](https://pub.dev/packages/json_serializable)
produce the mapping through the shared command in
[SKILL.md](../SKILL.md#shared-toolchain). Use `@JsonKey` to record a wire name
that differs from the Dart name; do not rename the Dart field to match. Domain
entities carry no serialization annotations.

## Value objects carry meaning without identity

Put an immutable domain value such as an email address, a money amount, or a
date range under `features/<name>/domain/value_objects/` when it owns validation
or behavior. Compare it by value. Do not create one merely to wrap a primitive;
it earns its place when it prevents an invalid value, names a concept, or owns a
rule.

## Freezed for immutable data

Use [`freezed_annotation`](https://pub.dev/packages/freezed_annotation) with
[`freezed`](https://pub.dev/packages/freezed) for DTOs, entities, BLoC events,
and BLoC states. It supplies equality, `copyWith`, and exhaustive unions.

Check the installed Freezed major before copying the shape below; the class
declaration and API changed across majors. This example uses the
`abstract`/`sealed` form and Dart 3 pattern matching.
[state-management.md](state-management.md#keep-one-bloc-library-in-three-authored-files)
owns the `part` layout that combines a BLoC's event and state into one generated
`*.freezed.dart` file.

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

A screen with no data yet says so through a variant of the state union, never
through a nullable field on a loaded state. A widget forced to test
`orders == null` cannot tell "still loading" from "loaded, and empty".

## Failures cross the boundary, exceptions do not

Inside infrastructure, code throws whatever its library throws. The adapter
catches those and returns a domain failure: a sealed type the use case and BLoC
can match on. Application and presentation code never see a library exception,
catch `Exception`, or inspect a status code.

Name failures for what the user or caller must do about them:
`OrdersFailure.offline()`, `OrdersFailure.unauthorized()`,
`OrdersFailure.rejected(reason)`. `OrdersFailure.error500()` names the wire, not
the decision. Keep one failure type per feature in
`features/<name>/domain/failures/`.
