# Unit Tests

Tests live in
`android/src/test/kotlin/com/phamtunglam/health_connector_hc_android/` and run
only through the example app's Gradle build. Two directories divide them.

| Directory     | Holds                                                                    |
| ------------- | ------------------------------------------------------------------------ |
| `unit_tests/` | One test file per production type, in a tree mirroring `src/main/kotlin` |
| `utils/`      | Shared test helpers: `MainDispatcherExtension`, `TestDispatcherProvider` |

A test file is named `<TypeUnderTest>Test.kt` and sits at the mirrored path, so
`mappers/health_record_mappers/StepsRecordMapper.kt` is tested by
`unit_tests/mappers/health_record_mappers/StepsRecordMapperTest.kt`.

## Name the test twice

Every test class carries `@DisplayName` naming the type under test. Every test
method carries a second `@DisplayName` in one fixed sentence form:
`"GIVEN <state> → WHEN <action> → THEN <outcome>"`, split across lines with
string concatenation when it is long. The Kotlin function name is
`when<Condition>_then<Outcome>`; the handler tests use backticked sentences
instead, so match the file you are editing.

Group related cases in a `@Nested inner class` with its own `@DisplayName`, and
use `@ParameterizedTest` for one behavior over many values. Hold the object
under test in `private lateinit var systemUnderTest: <Type>`.

## Set up and tear down the same way every time

```kotlin
@BeforeEach
fun setUp() {
    MockKAnnotations.init(this)          // only when the class declares MockK fields
    HealthConnectorLogger.isEnabled = false
    fakeHealthConnectClient = FakeHealthConnectClient(
        packageName = FAKE_PACKAGE_NAME,
        permissionController = FakePermissionController(grantAll = true),
    )
    systemUnderTest = StepsHandler(dispatcher = Dispatchers.Main.immediate, client = fakeHealthConnectClient)
}

@AfterEach
fun tearDown() {
    unmockkAll()
}
```

`HealthConnectorLogger` is a process-wide object, so disabling it in `setUp` is
what keeps one test from logging through another's scope. Every class that uses
MockK calls `unmockkAll()` in `tearDown`.

## Prefer the SDK's fakes to mocks

`androidx.health.connect:connect-testing` supplies `FakeHealthConnectClient`,
`FakePermissionController`, and `stub` helpers. Use them for anything that
reaches Health Connect: they record inserts and return them from reads, so a
write-then-read assertion proves real behavior. Reserve MockK, usually
`@RelaxedMockK`, for this project's own collaborators, as
`HealthConnectorClientTest` does for the four services.

Robolectric and `androidx.test:core` are on the test classpath but no test uses
them today. Reach for the fakes first and add a Robolectric test only when a
real Android framework class has no other seam.

## Control coroutines through the injected dispatchers

Annotate the class with `@ExtendWith(MainDispatcherExtension::class)`. It
installs a `StandardTestDispatcher` as `Dispatchers.Main` before each test and
resets it after, which is why passing `Dispatchers.Main.immediate` as a
handler's `dispatcher` is a test dispatcher rather than the real main thread.
For a type that takes a `DispatcherProvider`, pass
`TestDispatcherProvider(StandardTestDispatcher())` instead. Run every suspend
assertion inside `runTest`.

Assert with Kotest: `shouldBe`, `shouldNotBe`, `shouldThrow`,
`shouldBeInstanceOf`, `shouldNotBeEmpty`. Assert the exact
`HealthConnectorException` variant, not just that something was thrown.

Finish when the test fails for the behavior it names, holds its subject in
`systemUnderTest`, uses fakes wherever the SDK provides one, and leaves no mock,
dispatcher, or logger state behind.
