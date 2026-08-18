# Adding a Health Data Type on the Dart Side

This reference owns the ordered procedure for introducing one new health data
type. The native handler and the native mapper are out of scope; see
`ptlam-code-style-kotlin-health-connector` and
`ptlam-code-style-swift-health-connector` for those.

Decide three things first: which platforms support it, which `MeasurementUnit`
its values use, and which capabilities it has. Everything below follows.

## Core: the domain model

1. Create `lib/src/models/health_records/<family>/<name>_record.dart` following
   [record-authoring.md](record-authoring.md), and add its `part` directive to
   `health_records/health_record.dart`. Done when `fvm dart analyze` in
   `health_connector_core` reports only the missing data type.
2. Create `lib/src/models/health_data_types/<family>/<name>_data_type.dart`
   extending `HealthDataType<<Name>Record, <Unit>>` with the capability
   interfaces from [domain-hierarchies.md](domain-hierarchies.md), and add its
   `part` directive to `health_data_types/health_data_type.dart`. Done when the
   class implements every member the analyzer demands.
3. Add the documented `static const <name> = <Name>DataType();` field to
   `HealthDataType`, with its `@sinceVx_y_z` and platform annotations, and add
   the same field to the `static const values` list. Done when
   `HealthDataType.values` contains it.
4. Add a case to `HealthRecordDataTypeExtension.dataType` in
   `utils/health_record_data_type_extension.dart`, and — if the type is
   aggregatable — a case to `DoubleToMeasurementUnit.toMeasurementUnit` in
   `utils/double_to_measurement_unit_extension.dart`. Done when neither switch
   falls through for the new type.
5. Add the record and the data type to the `show` clauses in
   `lib/health_connector_core.dart`. Done when a file importing only
   `package:health_connector_core/health_connector_core.dart` can name both.

## Platform: the channel and the mappers

Repeat these in each platform package that supports the type.

1. In `pigeon/<platform>_api.dart`, add a `<Name>RecordDto` class extending
   `HealthRecordDto` with plain fields — epoch milliseconds for times, `double`
   for quantities, `String?` for the id — add a `HealthDataTypeDto` enum value,
   and add a `…Dto` enum for each new domain enum. Done when the contract file
   names the new DTO and enum value.
2. Run `melos run pigeon` from the repository root. Done when both
   `lib/src/pigeon/*_api.g.dart` files contain the new DTO and `git status`
   shows only the generated files you expected.
3. Add
   `lib/src/mappers/health_record_mappers/<family>/<name>_record_mapper.dart`
   with the `<Name>RecordToDto` and `<Name>RecordDtoToDomain` extension pair per
   [pigeon-boundary.md](pigeon-boundary.md), plus a mapper file per new enum.
   Done when both directions compile and `toDomain()` builds the record through
   its `.internal` factory.
4. Add a `case` to `HealthRecordToDto` and `HealthRecordDtoToDomain` in
   `mappers/health_record_mappers/health_record_mapper.dart` using explicit
   extension invocation, import the new mapper file there, and add a `case` to
   `HealthDataTypeToDto` and `HealthDataTypeDtoToDomain` in
   `mappers/health_data_type_mapper.dart`. Done when no switch in either file
   has a missing case.
5. If only one platform supports the type, annotate it per
   [platform-support.md](platform-support.md) and return the correct
   `supportedHealthPlatforms`. The facade's generic read, write, aggregate, and
   delete methods need no change; a capability with no generic form needs an
   explicit `UnsupportedOperationException` branch in `HealthConnectorImpl`.
   Done when calling it on the unsupported platform throws with a message naming
   the supported platform.

## Prove it

Add the record test, the mapper tests, and any enum mapper tests required by
[testing.md](testing.md). Then run, from the repository root:

```bash
melos run format:dart
melos run analyze:dart:strict
melos run test:dart
melos run doc:generate
```

Done when all four succeed and a second `melos run pigeon` produces no diff.
