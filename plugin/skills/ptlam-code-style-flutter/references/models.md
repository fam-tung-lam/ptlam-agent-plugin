# Models, DTOs, and Failures

How data crosses a layer: DTOs, domain models, unions, and failures.

## A DTO is not a domain model

A DTO mirrors an external shape — a JSON body, a stored record — field for
field, including the parts you dislike. A domain model says what the application
means, in the domain's words.

Keep them separate types. The DTO lives at the boundary that owns the external
system; the domain model travels everywhere above it.

Map between them in the repository or the data source, never above it. That
mapping is the only place that knows the API sends `"created_ts"` as an epoch
integer, and it is where a contract change gets caught.

Merging the two saves a file today and couples every screen to the vendor's
field names tomorrow.

## Generate the JSON, write the meaning

Annotate DTOs with `json_serializable` and let `build_runner` produce the
mapping. Hand-written `fromJson` drifts silently as fields are added.

Use `@JsonKey` to record the wire name when it differs from the Dart name. Do
not rename the Dart field to match a wire name you would not have chosen.

Domain models carry no serialization annotations. When one needs persisting, it
gets a DTO.

## Freezed for immutable data

Use Freezed for DTOs, domain models, BLoC events, and BLoC states. It supplies
equality, `copyWith`, and exhaustive unions, all of which are wrong when
hand-written under time pressure.

Check the installed Freezed major version before copying the shape below — both
the class declaration and the matching API changed across majors. The example
follows the `abstract`/`sealed` form and Dart 3 pattern matching, which replaced
`when` and `map`.

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

## Model absence honestly

A nullable field means the value can genuinely be absent, and the code that
reads it handles that. Do not use `null`, `-1`, or `''` as a marker for "not
loaded yet" — that is a state, and it belongs in the state union.

Prefer an empty list to a nullable list.

## Failures cross the boundary, exceptions do not

Below the repository, code throws whatever its library throws: `DioException`,
a platform exception, a parse error.

The repository catches those and returns a domain failure — a sealed type the
use case and the BLoC can match on. Nothing above the repository ever sees a
library exception type, catches `Exception`, or inspects a status code.

Name failures for what the user or the caller must do about them:
`OrdersFailure.offline()`, `OrdersFailure.unauthorized()`,
`OrdersFailure.rejected(reason)`. `OrdersFailure.error500()` names the wire, not
the decision.

Keep one failure type per feature, in `features/<name>/models/`.
