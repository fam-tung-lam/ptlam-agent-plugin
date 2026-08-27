# Python Errors

The Python mechanics for reporting a failure without losing its cause or leaking
an implementation boundary.

Raise a built-in exception when its meaning is exact: `TypeError` for an
unsupported kind, `ValueError` for an invalid value, `RuntimeError` for an
invalid operation state. Use a domain exception when callers need to tell one
stable failure from another.

Catch the narrowest exception the current boundary can handle, then recover,
translate it once, or re-raise it. Use `raise NewError(...) from exc` when a
translation adds domain context; use a bare `raise` when the same exception
continues.

Do not catch `Exception` inside ordinary domain code. A process, task, or
request boundary may catch it to report an otherwise unhandled failure, but it
must keep the traceback, run the required cleanup, and return or raise an
explicit outcome.

Never use a bare `except`, swallow an error with `pass`, or return a sentinel
the signature does not declare. Keep error messages actionable and free of
credentials, personal data, and raw external payloads.

Use context managers or `finally` for cleanup. A cleanup failure must not
quietly replace the original cause; combine, chain, or report it as the
project's policy says.

Finish when each failure has one owner, callers can tell every promised outcome
apart, and the original cause stays available for diagnosis.
