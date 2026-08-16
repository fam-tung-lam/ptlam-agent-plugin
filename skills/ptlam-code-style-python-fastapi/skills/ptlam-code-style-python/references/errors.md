# Python Errors

The Python mechanics for reporting a failure without losing its cause or leaking
an implementation boundary.

Raise a built-in exception when its meaning is exact: `TypeError` for an
unsupported kind, `ValueError` for an invalid value, and `RuntimeError` for an
invalid operation state. Use a domain exception when callers need to distinguish
and handle a stable failure from this package.

Catch the narrowest exception the current boundary can handle. Then recover,
translate it once, or re-raise it. Use `raise NewError(...) from exc` when a
translation adds domain context; use bare `raise` when the same exception
continues.

Do not catch `Exception` inside ordinary domain code. A process, task, or
request boundary may catch it to report an otherwise unhandled failure, but it
must keep the traceback, perform required cleanup, and return or raise an
explicit failure outcome.

Never use a bare `except`, swallow an error with `pass`, or return a sentinel
that the signature does not declare. Keep error messages actionable and free of
credentials, personal data, and raw external payloads.

Use context managers or `finally` for cleanup. Cleanup failure must not silently
replace the original cause; combine, chain, or report it according to the
project's established policy.

Finish when each failure has one owner, callers can distinguish every promised
outcome, and the original cause remains available for diagnosis.
