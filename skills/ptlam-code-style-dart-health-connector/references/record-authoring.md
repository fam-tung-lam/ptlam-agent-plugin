# Authoring a Health Record

This reference owns the shape of a concrete `HealthRecord` in
`health_connector_core`: validation, bounds, the unvalidated factory,
`copyWith`, equality, and the measurement units a record's fields use.

## The member order of a record

Read `lib/src/models/health_records/steps_record.dart` as the reference
implementation. A concrete record declares, in this order:

1. `part of 'health_record.dart';`
2. The doc comment, then `@sinceVx_y_z` and `@immutable`.
3. `final class <Name>Record extends InstantHealthRecord`,
   `IntervalHealthRecord`, or `SeriesHealthRecord<T>`.
4. The `static const` bounds.
5. The public validating constructor.
6. The `@internalUse` unvalidated factory.
7. The private unvalidated constructor.
8. The `final` fields.
9. `copyWith`.
10. `operator ==` and `hashCode`.

## Validate in the constructor body

The public constructor validates every argument in its body and throws
`ArgumentError`, never a `HealthConnectorException`. Use the two helpers in
`lib/src/utils/validation_utils.dart`:

```dart
StepsRecord({
  required super.startTime,
  required super.endTime,
  required super.metadata,
  required this.count,
  super.id,
  super.startZoneOffsetSeconds,
  super.endZoneOffsetSeconds,
}) {
  requireEndTimeAfterStartTime(startTime: startTime, endTime: endTime);
  require(
    condition: count >= minSteps && count <= maxSteps,
    value: count,
    name: 'count',
    message:
        'Steps must be between ${minSteps.value.toInt()}-'
        '${maxSteps.value.toInt()}. '
        'Got ${count.value.toInt()} steps.',
  );
}
```

`require` throws `ArgumentError.value(value, name, message)`. Every interval
record calls `requireEndTimeAfterStartTime`. The message states the accepted
range and the value received, so name the bounds in it rather than repeating
literals.

## Bounds are named constants

Declare each limit as a `static const` typed in the field's own measurement
unit, named `min<Field>` and `max<Field>` — `minSteps`/`maxSteps`,
`minMass`/`maxMass`, `minPercentage`/`maxPercentage`. Document what the maximum
represents in physical terms; the maximum exists to reject nonsense, not to
express a platform limit.

## The unvalidated factory is for mappers only

A mapper turning a platform DTO into a domain record must not re-run validation
against data the platform already stored, so each record exposes:

```dart
@internalUse
factory StepsRecord.internal({ ... }) => StepsRecord._( ... );
```

`.internal` forwards to the private constructor, which skips the validation
body. It is the only constructor a mapper calls, and it takes `id` as required
because a record read back from a platform always has one. Application code
calls the public constructor.

## `copyWith` and value equality

`copyWith` names every field as a nullable optional parameter and delegates to
the public constructor, so a `copyWith` that would break an invariant throws.

Equality is written by hand, not generated: `identical(this, other) ||` then
`other is <Type> && runtimeType == other.runtimeType &&` then every field,
including `id` and `metadata`. `hashCode` XORs the same fields in the same
order, with `?.hashCode ?? 0` for a nullable one. Use `ListEquality` from
`package:collection` for a list field, as the series records do. Adding a field
means touching the constructor, `copyWith`, `==`, and `hashCode` together.

## Measurement units and value objects

A record never stores a bare `double`. Every quantity is a `MeasurementUnit`
subclass — `Mass`, `Energy`, `Length`, `Number`, `Percentage`, `Power`,
`Pressure`, `Temperature`, `TimeDuration`, `Velocity`, `Volume`, `Frequency`,
`BloodGlucose`. Each stores one canonical base value in a private field, offers
`const` named constructors per unit (`Mass.kilograms`, `Mass.pounds`) and
`in<Unit>` getters, declares a `zero` constant, implements `Comparable`, and
compares with a documented `_tolerance` where floating-point equality would be
wrong.

`HealthRecordId` is the other value object: a factory that rejects the empty
string, a `none` sentinel for records not yet written, and a `toString` that
masks all but the first three characters so an identifier never lands in a log
in full.
