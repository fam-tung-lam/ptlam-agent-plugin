# Sealed Hierarchies and Part Files

This reference owns how `health_connector_core` organizes its sealed
hierarchies, why capabilities are interfaces, and the pairing between a data
type and its record. The Dart skill owns sealed-class and `part` mechanics
themselves.

## Four roots, each a single library split by `part`

| Root file (under `lib/src/models/`)          | Root declaration                                                                 | `part` files |
| -------------------------------------------- | -------------------------------------------------------------------------------- | ------------ |
| `health_data_types/health_data_type.dart`    | `sealed class HealthDataType<R extends HealthRecord, U extends MeasurementUnit>` | 149          |
| `health_records/health_record.dart`          | `sealed class HealthRecord`                                                      | 174          |
| `measurement_units/measurement_unit.dart`    | `sealed class MeasurementUnit`                                                   | 13           |
| `exceptions/health_connector_exception.dart` | `sealed class HealthConnectorException implements Exception`                     | 0 (one file) |

The root file carries every `import` for the whole library; a `part` file opens
with `part of '<root>.dart';` and declares no imports of its own. Adding an
import for one new type means adding it to the root file, where it is shared by
150 other declarations — check first whether the symbol is already imported.

Keep each `part` directive path relative to the root and grouped by the
subdirectory it names, such as `part 'heart_rate/heart_rate_record.dart';`.
Subdirectories group a family (`distance/`, `nutrition/`, `menstruation/`,
`events/`); a type with no family sits directly under the root's directory.

`HealthRecord` has three abstract intermediates, all in the same library:
`InstantHealthRecord` (one `time` plus `zoneOffsetSeconds`),
`IntervalHealthRecord` (`startTime`, `endTime`, and both offsets), and
`SeriesHealthRecord<T>` (an interval plus a sample list). Every concrete record
extends exactly one of them.

## Capabilities are interfaces, not mixins

A concrete data type declares what it can do by implementing capability
interfaces from
`lib/src/models/health_data_types/health_data_type_capabilities/`:

| Interface                                            | Adds                                                           |
| ---------------------------------------------------- | -------------------------------------------------------------- |
| `ReadableHealthDataType<R>`                          | `readPermission`                                               |
| `ReadableByIdHealthDataType<R>`                      | `readById(HealthRecordId)`                                     |
| `ReadableInTimeRangeHealthDataType<R>`               | `readInTimeRange(...)` with paging and data-origin filters     |
| `WriteableHealthDataType<R>`                         | `writePermission`                                              |
| `DeletableByIdsHealthDataType<R>`                    | `deleteByIds(List<HealthRecordId>)`                            |
| `DeletableInTimeRangeHealthDataType<R>`              | `deleteInTimeRange(...)`                                       |
| `Sum`/`Avg`/`Min`/`MaxAggregatableHealthDataType<U>` | `aggregateSum`, `aggregateAvg`, `aggregateMin`, `aggregateMax` |

The class doc comment on `HealthDataType` records why: a `base mixin` joins the
sealed hierarchy, so the analyzer then demands a case for each mixin in every
`switch` over `HealthDataType`, even when the concrete types already cover it.
An `abstract interface class` takes no part in exhaustiveness checking, so a
`switch` handles only concrete types. The accepted cost is that every concrete
type reimplements the interface members. Do not convert these back to mixins.

## Pair a data type with its record and unit

`HealthDataType<R, U>` binds a data type to its record type `R` and the
measurement unit `U` its aggregations return —
`StepsDataType extends HealthDataType<StepsRecord, Number>`. Three places must
agree, and the analyzer only catches the first:

1. The generic arguments on the `HealthDataType` subclass.
2. `HealthRecordDataTypeExtension.dataType` in
   `lib/src/utils/health_record_data_type_extension.dart`, a `switch` from each
   record type back to its `HealthDataType` singleton.
3. `DoubleToMeasurementUnit.toMeasurementUnit` in
   `lib/src/utils/double_to_measurement_unit_extension.dart`, a `switch` from
   each aggregatable data type to the unit constructor for its raw `double`.

## Register the singleton

Each data type is a `const` singleton exposed as a `static const` field on
`HealthDataType`, documented and annotated in place. The field must also appear
in the `static const values` list at the bottom of the root file; `dataTypeMap`,
`healthConnectDataTypes`, `appleHealthDataTypes`, and the per-category lists all
derive from `values`. A type missing from `values` has no id lookup and never
appears in a category query.

`String get id` is the stable identifier used for sync-token serialization. It
is `snake_case` and mirrors the field name, such as `'steps'` and
`'body_mass_index'`. Never change an existing `id`: persisted sync tokens
contain it.
