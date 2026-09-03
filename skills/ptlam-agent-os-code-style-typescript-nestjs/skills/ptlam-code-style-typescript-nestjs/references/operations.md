# NestJS Operations

How use cases hand work to persistence and remote systems while exposing useful
operational state.

## Keep transactions at the operation boundary

Inject a repository contract or unit-of-work into the use case through its
feature-module factory. Register the adapter in the feature module and get
shared pools or clients from an integration module. A presentation adapter never
injects an ORM repository, entity manager, database client, or remote SDK
directly.

Give one use case the transaction decision. A repository method never hides an
unconditional commit. Start the transaction after the input and authorization
checks that need no lock, pass its scoped handle explicitly, and commit only
after every atomic write succeeds. Roll back and release it on any failure.

Keep a database connection or pool singleton-scoped when its library supports
concurrent use. Create transaction-scoped sessions or managers inside the
operation, or through the persistence integration's verified context mechanism;
do not make the whole feature request-scoped just to carry one session.

Return domain or application values from the operation. Map persistence
entities, lazy relations, decimals, dates, and transport field names at their
owning boundary. Never let a serializer trigger a hidden database read after the
transaction closes.

Commit before a non-transactional remote effect only when its failure and retry
behavior is safe. Use an outbox or another durable handoff when a database
change and a published event or job must not drift apart. Return an accepted
transport result only after the handoff succeeds.

## Make the application operable

When Nest builds the configured system logger, create the application with
buffered logs, get the logger from the container, and attach it with `useLogger`
before accepting work. Keep Nest's logger context when the bridge converts
framework records, and check that bootstrap, application, worker, command, and
shutdown logs all use the bridge.

Register request and message metrics through a Nest interceptor or the chosen
integration. Wrap a queue, schedule, or command adapter at its owning
integration when no execution pipeline runs. Derive a low-cardinality route
template, message pattern, job name, or command name from the real Nest seam.
Connect the chosen correlation carrier to the logger and metric bridge at the
same boundary.

Expose liveness, readiness, and build information through one operations module.
Liveness must not depend on a remote system. Readiness checks only the
dependencies needed to accept traffic, uses bounded calls, and reports unready
while the application drains. Keep detailed dependency failures out of public
health responses when they reveal infrastructure.

Finish when each operation owns one transaction, durable effects cannot be
silently lost, the logger and metric bridges cover every configured entry point,
and the operations module reports startup, readiness, and shutdown.
