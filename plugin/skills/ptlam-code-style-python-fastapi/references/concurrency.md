# FastAPI Concurrency and Background Work

How FastAPI selects a thread-pool path, an event-loop path, a stream, or a
durable handoff.

Choose from the whole call graph:

| Calls                                                   | Handler or dependency                           |
| ------------------------------------------------------- | ----------------------------------------------- |
| Awaitable non-blocking I/O                              | `async def`, with every operation awaited       |
| A synchronous database, SDK, filesystem, or network API | `def`, so FastAPI may run it in its thread pool |
| CPU-heavy or durable work                               | A process or job system owned by the repository |

FastAPI runs ordinary `def` handlers and dependencies in a thread pool. It does
not move a synchronous utility called from your `async def`; that call blocks
the event loop. The official [async guide](https://fastapi.tiangolo.com/async/)
owns the current dispatch behavior.

Do not call a blocking synchronous API directly on the event loop. Prefer a
plain `def` handler for a synchronous call path. An approved thread offload is
safe only when the worker operation creates, uses, and closes its thread-bound
resource; never pass a database session or another thread-bound client across
threads or tasks.

Use `BackgroundTasks` only for small in-process work whose loss on process exit
is acceptable. Hand durable, retryable, slow, or CPU-heavy work to the
repository's queue and return the API's accepted-job contract only after the
handoff succeeds.

Do not close a background callback over a yielded session, client, ORM object,
or request context. Pass stable data such as an identifier, then acquire and
close fresh resources inside the task.

A streaming response owns its iterator until disconnect or completion. Propagate
cancellation, close upstream streams, and keep yielded dependencies alive for
the response scope required by the installed FastAPI version.

Finish when every blocking call runs outside the event loop, every job has a
durability owner, and cancellation closes the stream and its resources.
