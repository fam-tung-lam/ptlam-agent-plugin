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

When the configured system logger is constructed by Nest, create the application
with buffered logs, retrieve the logger from the container, and attach it with
`useLogger` before accepting traffic. Preserve Nest's logger context when the
bridge converts framework records, and verify that bootstrap, application,
microservice, and shutdown logs all use the bridge.

Register request and message metrics through a Nest interceptor or the selected
Nest integration. Derive the canonical route template, message pattern, status,
and duration from the `ExecutionContext` and adapter instead of raw request
values. Connect the selected correlation carrier to the Nest logger and metric
bridge at the same boundary.

Expose liveness, readiness, and build information through one operations module.
Liveness must not depend on a remote system. Readiness checks only dependencies
required to accept traffic, uses bounded calls, and becomes unready while the
application drains. Keep detailed dependency failures out of public health
responses when they reveal infrastructure.

Finish when each operation owns one transaction, durable effects cannot be
silently lost, the Nest logger and metric bridges cover every configured
transport, and the operations module reports startup, readiness, and shutdown.
