# Health Record Handlers

One handler owns one `HealthDataTypeDto`. It declares which operations it
supports by conforming to capability protocols, and it becomes reachable only by
being registered. This file owns the handler shape and the ordered procedure for
adding one.

## The base protocol supplies everything shared

`HealthRecordHandler` refines `AnyObject` and `Sendable`. It declares two
associated types, `RecordDto: HealthRecordDto` and `SampleType: HKSample`. It
also declares the stored `healthStore`, the static `dataType`, a
`process(operation:context:block:)` wrapper, and `healthKitType()`.

Its extension supplies the default `process` (logging plus error translation,
see [errors.md](errors.md)) and a default `healthKitType()` that calls
`Self.dataType.toHKSampleType()`. Override `healthKitType()` only for a type the
mapper cannot express, such as an exercise session.

## Conform to the capabilities you actually support

| Protocol                                  | Adds                                                                       | Handler must supply                                               |
| ----------------------------------------- | -------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| `ReadableHealthRecordHandler`             | `readRecord(id:)` and paginated `readRecords(...)` using `PaginationToken` | Nothing; defaults cover standard sample types                     |
| `WritableHealthRecordHandler`             | `writeRecord(_:)`                                                          | Nothing, unless the type needs custom save behavior               |
| `DeletableHealthRecordHandler`            | `deleteRecords(ids:)` and `deleteRecords(startTime:endTime:)`              | Nothing                                                           |
| `DeletableCorrelationHealthRecordHandler` | Deletion that also removes a correlation's contained samples               | Use instead of the plain deletable protocol for correlation types |
| `AggregatableHealthRecordHandler`         | `aggregate(metric:startTime:endTime:)` and metric validation               | `supportedAggregationMetrics` and its own `aggregate`             |
| `AggregatableQuantityHealthRecordHandler` | A statistics-query `aggregate` for `SampleType == HKQuantitySample`        | `supportedAggregationMetrics` and `convertQuantity(_:)`           |

`writeRecord(_:)` is declared as a protocol requirement rather than living only
in the extension. That is deliberate: it gives dynamic dispatch, so an override
such as `ExerciseSessionHandler`'s route-aware write still runs when the client
holds the value as a `WritableHealthRecordHandler`. Keep new capability methods
declared in the protocol for the same reason.

## What a concrete handler declares

```swift
final class StepsHandler: @unchecked Sendable,
    ReadableHealthRecordHandler,
    WritableHealthRecordHandler,
    DeletableHealthRecordHandler,
    AggregatableQuantityHealthRecordHandler
{
    typealias RecordDto = StepsRecordDto
    typealias SampleType = HKQuantitySample
    let healthStore: HKHealthStore

    init(healthStore: HKHealthStore) {
        self.healthStore = healthStore
    }

    static let dataType: HealthDataTypeDto = .steps

    static let supportedAggregationMetrics: Set<AggregationMetricDto> = [.sum]

    func convertQuantity(_ quantity: HKQuantity) throws -> Double {
        quantity.doubleValue(for: .count())
    }
}
```

The class is `final`, `@unchecked Sendable` comes first in the conformance list,
and the store arrives by initializer injection. A handler holds no other mutable
state; [concurrency.md](concurrency.md) explains why that is what makes the
`@unchecked` claim honest.

A handler that needs custom behavior puts it in a `// MARK:`-separated extension
on itself, the way `ExerciseSessionHandler` overrides `writeRecord(_:)` to
attach a workout route.

## Registration is the only way in

`HealthRecordHandlerRegistry.registerAllHandlers()` holds one `register(...)`
line per handler, and `register` keys the dictionary by
`type(of: handler).dataType`. Lookup goes through
`handler(for:withCapability:)`, which throws
`HealthConnectorError.unsupportedOperation` when the type is unregistered and
again when the registered handler does not conform to the requested capability.

An unregistered handler compiles and ships. It fails at runtime, on a user's
device, as an unsupported-operation error. Registering is not optional cleanup.

## Add a new health record type

1. Add the record DTO and its `HealthDataTypeDto` case to the Pigeon contract,
   then regenerate as [pigeon-boundary.md](pigeon-boundary.md) describes. The
   new DTO and enum case now exist in the generated Swift.
2. Add the case to `HealthDataTypeDto.toHKSampleType()` in
   `mappers/HealthDataTypeMapper.swift`, gated with `if #available` when the
   HealthKit identifier is newer than iOS 15. The type now resolves, or throws
   `unsupportedOperation` on older systems.
3. Add the reverse case to `HKSample.healthDataType` in
   `utils/HealthKitExtensions.swift`. A sample read back from HealthKit now
   reports the right data type.
4. Add the DTO's cases to `HealthRecordDto.id` and `HealthRecordDto.dataType` in
   `utils/HealthConnectorDtoExtensions.swift`. Batch writes and sync can now
   identify the record.
5. Create `mappers/health_record_mappers/<Type>RecordMapper.swift` with both
   directions. A round trip through the two extensions now preserves the record.
6. Add a case to each dispatch switch in `HealthRecordMapper.swift`. Generic
   `toHKSample()` and `toDto()` now reach the new mapper.
7. Create `handlers/health_record_handlers/<Type>Handler.swift` in the shape
   above, conforming only to the capabilities HealthKit really supports for the
   type.
8. Add one `register(...)` line to `registerAllHandlers()`. The registry now
   resolves the type.
9. Run `melos run analyze:swift` and `melos run format:swift:check` from the
   monorepo root. Both report clean before you open the pull request.
