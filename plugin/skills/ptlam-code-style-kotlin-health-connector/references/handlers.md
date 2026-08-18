# Record Handlers

One handler owns one Health Connect record type. The base interface supplies
shared state and failure translation; capability interfaces supply the
operations, each with a working default body.

## Implement the base interface through a capability

`HealthRecordHandler` declares four members every handler overrides and one
method no handler overrides.

| Member                               | Kind      | Meaning                                               |
| ------------------------------------ | --------- | ----------------------------------------------------- |
| `dataType: HealthDataTypeDto`        | override  | The one record type this handler serves               |
| `dispatcher: CoroutineDispatcher`    | override  | Constructor parameter, defaulting to `Dispatchers.IO` |
| `client: HealthConnectClient`        | override  | Constructor parameter, the SDK client                 |
| `tag: String`                        | override  | The handler's own class name, used for logging        |
| `process(operation, context, block)` | inherited | Runs `block` on `dispatcher` and translates failures  |

Pick capabilities from what the record type actually supports in Health Connect.
Every one of these extends `HealthRecordHandler`.

| Capability interface                           | Adds                                                  | Extra member you must supply                                |
| ---------------------------------------------- | ----------------------------------------------------- | ----------------------------------------------------------- |
| `ReadableHealthRecordHandler`                  | `readRecord`, `readRecords` with paging               | none                                                        |
| `WritableHealthRecordHandler`                  | `writeRecord`                                         | none                                                        |
| `UpdatableHealthRecordHandler`                 | `updateRecord`                                        | none                                                        |
| `DeletableHealthRecordHandler`                 | `deleteRecords`, `deleteRecordsByTimeRange`           | none                                                        |
| `HealthConnectAggregatableHealthRecordHandler` | `aggregate` using the SDK's own aggregation           | `aggregateMetricMappings`, `convertAggregatedValue`         |
| `CustomAggregatableHealthRecordHandler`        | `aggregate` by paging records and computing in Kotlin | `supportedAggregationMetrics`, `extractValueForAggregation` |

Choose `HealthConnectAggregatableHealthRecordHandler` whenever the SDK exposes
an `AggregateMetric` for the record. Use `CustomAggregatableHealthRecordHandler`
only when it does not; it reads every page, so it costs far more than native
aggregation. Both satisfy `AggregatableHealthRecordHandler`, which is what
`HealthConnectorClient` checks against.

A concrete handler carries no operation bodies of its own. It is an
`internal class` in `handlers/health_record_handlers/`, named
`<RecordType>Handler`, taking `dispatcher: CoroutineDispatcher = Dispatchers.IO`
and `client: HealthConnectClient`, listing its capability interfaces, and
overriding `dataType`, `tag`, and any member the capabilities require.

## Reach the handler through the registry

`HealthRecordHandlerRegistry` builds every handler once in a `by lazy`
`buildMap` block, keyed by `handler.dataType`, and hands each one
`dispatchers.io` and the shared `HealthConnectClient`. A handler that is not
registered is unreachable: `getRecordHandler` returns `null`, and
`HealthConnectorClient` turns that into
`HealthConnectorException.UnsupportedOperation`. The same exception reports a
handler that lacks the capability the call needs, because the client checks
capability with an `is` test before delegating.

## Add a new record handler

1. Add or confirm the record type in the Pigeon definition, run
   `melos run pigeon`, and confirm the new `HealthDataTypeDto` constant and
   record DTO appear in `pigeon/HealthConnectorHCAndroidApi.g.kt`.
2. Add the record mapper under `mappers/health_record_mappers/`, following
   [mappers.md](mappers.md). Compiling now fails on every exhaustive `when` that
   must learn the new type; that list is the rest of your mapper work.
3. Create `handlers/health_record_handlers/<RecordType>Handler.kt` with the
   capability interfaces the record supports, and override `dataType`, `tag`,
   and each capability's required member.
4. Register the handler in `HealthRecordHandlerRegistry` with the same
   `dispatcher = dispatchers.io, client = client` arguments as its neighbours.
   `HealthRecordHandlerRegistryTest` asserts that `registeredHandlersCount`
   equals `HealthDataTypeDto.entries.size`, so it fails until you do.
5. Add `handlers/<RecordType>HandlerTest.kt` under `unit_tests/handlers/`
   against `FakeHealthConnectClient`, covering `dataType` and every capability
   you declared, following [testing.md](testing.md).
6. Add the round-trip mapper test under
   `unit_tests/mappers/health_record_mappers/`.
7. Run `melos run format:kotlin`, `melos run analyze:kotlin`, and
   `melos run test:kotlin`, and report each result.

Finish when the new type resolves to a handler through the registry, every
exhaustive `when` compiles without a fallback branch, and all three commands in
step 7 pass.
