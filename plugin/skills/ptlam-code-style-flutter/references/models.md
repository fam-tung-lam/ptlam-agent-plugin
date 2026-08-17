# Models, DTOs, and Failures

How data crosses a layer: DTOs, domain models, unions, and failures.

## A DTO is not a domain model

A DTO mirrors an external shape — a JSON body, a stored record — field for
field, including the parts you dislike. A domain model says what the application
means, in the domain's words.

Keep them separate types from the first version. Flutter is deliberately
stricter here than the general rule of splitting once the shapes disagree: a
vendor owns the wire shape and can change it in a release you do not control.

A feature DTO lives beside the external boundary that owns its shape, under
`features/<name>/data/<source>/dtos/`; the domain model travels everywhere above
the repository.

Map between them in the repository or the data source, never above it. That
mapping is the only place that knows the API sends `"created_ts"` as an epoch
integer, and it is where a contract change gets caught.

## Generate the JSON, write the meaning

Annotate DTOs with [`json_annotation`](https://pub.dev/packages/json_annotation)
and let [`json_serializable`](https://pub.dev/packages/json_serializable)
produce the mapping through the shared code-generation command in
[SKILL.md](../SKILL.md#shared-toolchain). Hand-written `fromJson` drifts
silently as fields are added.

Use `@JsonKey` to record the wire name when it differs from the Dart name. Do
not rename the Dart field to match a wire name you would not have chosen.

Domain models carry no serialization annotations. When one needs persisting, it
gets a DTO.

## Freezed for immutable data

Use [`freezed_annotation`](https://pub.dev/packages/freezed_annotation) with
[`freezed`](https://pub.dev/packages/freezed) for DTOs, domain models, BLoC
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

Match on a union with a `switch` expression and no default branch. The analyzer
then tells you every place to update when a variant is added; a default branch
silently swallows the new one.

Write domain services, invariants, and validation by hand. Freezed owns the data
shape, not the rules about it.

## Put absence in the Dart type

A nullable Dart field means the value can genuinely be absent, and every reader
handles that. "Not loaded yet" is a state: put it in the Freezed state union
above, not in a nullable field.

Prefer an empty list to a nullable list.

## Failures cross the boundary, exceptions do not

Below the repository, code throws whatever its library throws: `DioException`, a
platform exception, a parse error.

The repository catches those and returns a domain failure — a sealed type the
use case and the BLoC can match on. Nothing above the repository ever sees a
library exception type, catches `Exception`, or inspects a status code.

Name failures for what the user or the caller must do about them:
`OrdersFailure.offline()`, `OrdersFailure.unauthorized()`,
`OrdersFailure.rejected(reason)`. `OrdersFailure.error500()` names the wire, not
the decision.

Keep one failure type per feature, in `features/<name>/models/`.
