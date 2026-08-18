# Mappers

A mapper is an `internal` extension function or property that converts one value
and does nothing else. It never calls the SDK client and never logs. When a
value cannot be converted, throw `IllegalArgumentException` and declare it with
`@Throws`; the calling handler's `process` turns that into
`HealthConnectorException.InvalidArgument`. No mapper builds a
`HealthConnectorException` itself.

## Name the direction

| Direction                         | Name                                              | Receiver     |
| --------------------------------- | ------------------------------------------------- | ------------ |
| Health Connect type to Pigeon DTO | `toDto()`, or `to<Name>Dto()` when narrower       | The SDK type |
| Pigeon DTO to Health Connect type | `toHealthConnect()`, or `toHealthConnect<Name>()` | The DTO      |

The Dart layer uses `toDto()` and `toDomain()` for its own conversions. On the
Kotlin side the second direction is always named for Health Connect, never
`toDomain`.

## Put it in the directory for its subject

| Directory                        | Holds                                                                                   |
| -------------------------------- | --------------------------------------------------------------------------------------- |
| `mappers/health_record_mappers/` | One file per record type, plus the dispatching mappers below                            |
| `mappers/metadata_mappers/`      | `Metadata`, device type, and recording method                                           |
| `mappers/permission_mappers/`    | Permission strings, permission requests, and platform features                          |
| `mappers/`                       | Cross-cutting conversions: data type, platform status, sort order, log level, exception |

Name the file after its subject and the layer it maps to: a record mapper is
`<RecordType>RecordMapper.kt`, everything else is `<Subject>Mapper.kt`.

## Update every dispatching mapper together

Five `when` expressions dispatch over the whole set of record types. Adding a
record type means adding a branch to each; the compiler names them for you
because each `when` is exhaustive with no `else`.

| Dispatching mapper                                       | File                         |
| -------------------------------------------------------- | ---------------------------- |
| `HealthDataTypeDto.toHealthConnectRecordClass()`         | `HealthDataTypeMapper.kt`    |
| `HealthRecordDto.toHealthConnect()` and `Record.toDto()` | `HealthRecordMapper.kt`      |
| `HealthRecordDto.dataType`                               | `HealthRecordMapper.kt`      |
| `HealthRecordDto.id`                                     | `HealthRecordIdMapper.kt`    |
| The permission string mappings                           | `PermissionRequestMapper.kt` |

Keep each of these as one exhaustive `when`. Splitting a long dispatching `when`
into helpers loses the compile-time exhaustiveness that makes a missing record
type impossible to ship, so the project suppresses the size rules on them
instead; see [analysis-config.md](analysis-config.md) for the suppression form.

Finish when the conversion is total for the values it accepts, both directions
round-trip in a unit test, and no dispatching `when` carries an `else`.
