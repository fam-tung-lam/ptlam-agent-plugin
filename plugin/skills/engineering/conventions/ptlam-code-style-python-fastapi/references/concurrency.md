# FastAPI Concurrency and Background Work

How FastAPI picks a thread-pool path, an event-loop path, a stream, or a durable
handoff.

Choose from the whole call graph:

| The path calls                                          | Handler or dependency                           |
| ------------------------------------------------------- | ----------------------------------------------- |
| Awaitable non-blocking I/O                              | `async def`, with every operation awaited       |
| A synchronous database, SDK, filesystem, or network API | `def`, so FastAPI may run it in its thread pool |
| CPU-heavy or durable work                               | A process or job system the repository owns     |

FastAPI runs ordinary `def` handlers and dependencies in a thread pool. It does
not move a synchronous helper called from your `async def`; that call blocks the
event loop. The [FastAPI async guide](https://fastapi.tiangolo.com/async/)
identifies the feature; it is not required reading. When dispatch behaves
differently, read the locked packages and prove the path with a focused local
test.

Never call a blocking synchronous API directly on the event loop. Prefer a plain
`def` handler for a synchronous call path. An approved thread offload is safe
only when the worker creates, uses, and closes its own thread-bound resource;
never pass a database session or another thread-bound client across threads or
tasks.

Use `BackgroundTasks` only for small in-process work whose loss on process exit
is acceptable. Hand durable, retryable, slow, or CPU-heavy work to the
repository's queue, and return the accepted-job response only after the handoff
succeeds.

Never let a background callback close over a yielded session, client, ORM
object, or request context. Pass stable data such as an identifier, then acquire
and close fresh resources inside the task.

A streaming response owns its iterator until disconnect or completion. Pass
cancellation on, close upstream streams, and keep yielded dependencies alive for
the response scope the installed FastAPI version requires.

Finish when every blocking call runs off the event loop, every job has a
durability owner, and cancellation closes the stream and its resources.
