# Python Async and Resource Lifetime

How Python code chooses synchronous or asynchronous execution and keeps
resources correct under concurrency.

Use `async def` when the call path awaits non-blocking I/O. Keep a path
synchronous when its libraries are synchronous. An `async def` label does not
make a blocking database, network, filesystem, or subprocess call non-blocking.

Prefer the dependency's own async API. When none exists and the work is safe to
move to a thread, isolate it with `asyncio.to_thread` or the repository's
approved equivalent. Move CPU-bound work to the project's process or job
boundary rather than occupying the event loop or its thread pool.

## Keep concurrency structured

- Await work before leaving its owner. Use the project's task-group mechanism
  when sibling operations must share cancellation and failure.
- Never create an untracked background task inside a request or a library call.
  Give long-lived work a supervisor with an explicit shutdown path.
- Put timeouts at external boundaries, and tell a timeout apart from a caller's
  cancellation.
- Let cancellation travel on after cleanup. Never turn cancellation into an
  ordinary success or a retry.
- Do not share mutable clients, sessions, or buffers across concurrent tasks
  unless their contract says that is safe.

Acquire files, locks, sessions, streams, and clients with a context manager when
one exists; otherwise close them in `finally`. The error and cancellation paths
must release the same resources as the success path.

Test concurrency with observable readiness and controlled collaborators. Fixed
sleeps hide races and make the suite depend on machine speed.

Finish when no blocking call runs on an event loop, every spawned operation has
an owner, and every acquired resource closes on all exits.
