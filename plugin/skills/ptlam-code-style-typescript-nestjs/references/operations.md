# NestJS Operations

How application providers hand work to persistence and remote systems while
exposing useful operational state.

## Keep transactions at the operation boundary

Inject a repository contract or unit-of-work token into the application
provider. Register its adapter in the feature or infrastructure module. A
controller never injects an ORM repository, entity manager, database client, or
remote SDK directly.

Give one application operation the transaction decision. A repository method
does not hide an unconditional commit. Start the transaction after input and
authorization checks that need no lock, pass its scoped handle explicitly, and
commit only after all atomic writes succeed. Roll back and release it on every
failure.

Keep a database connection or pool singleton-scoped when its library supports
concurrent use. Create transaction-scoped sessions or managers inside the
operation or through the persistence integration's verified context mechanism;
do not make the whole feature request-scoped merely to carry one session.

Return domain or application values from the operation. Map persistence
entities, lazy relations, decimals, dates, and transport field names at their
owning boundary. Do not let a serializer trigger hidden database reads after the
transaction closes.

Commit before a non-transactional remote effect only when its failure and retry
contract is safe. Use an outbox or another durable handoff when a database
change and published event or job must not drift apart. Return an accepted
transport result only after the durable handoff succeeds.

## Make the application operable

Route Nest's logger through the project's structured logging owner. Configure
the application logger once, buffer startup logs until it is attached, and
preserve framework context as a structured field. A provider does not configure
destinations, global levels, or redaction.

Create correlation at the first inbound boundary and carry it through the
selected context mechanism. Record transport pattern or canonical route, status,
duration, and stable operation identifiers. Keep raw identifiers, unbounded
exception messages, query strings, payloads, and tenant-controlled values out of
metric labels.

Capture an unexpected failure once at the outer boundary. Preserve its error
object and correlation context for diagnostics. Expected transport or domain
failures may be counted without duplicate error logs at each layer.

Expose liveness, readiness, and build information through one operations module.
Liveness must not depend on a remote system. Readiness checks only dependencies
required to accept traffic, uses bounded calls, and becomes unready while the
application drains. Keep detailed dependency failures out of public health
responses when they reveal infrastructure.

Finish when each operation owns one transaction, durable effects cannot be
silently lost, logs and metrics retain correlation without sensitive data, and
health state reflects startup, readiness, and shutdown.
