# NestJS Execution Pipeline

How cross-cutting request and message behavior enters the Nest execution path.

## Give each enhancer one job

| Component   | Owns                                                                          |
| ----------- | ----------------------------------------------------------------------------- |
| Middleware  | Adapter-level request setup, raw protocol needs, and early correlation        |
| Guard       | Authentication or authorization before a handler runs                         |
| Interceptor | Timings, tracing, response mapping, caching, and before-or-after handler work |
| Pipe        | Boundary validation and deliberate transformation of handler arguments        |
| Filter      | Translation of one uncaught exception family into one transport error         |

Use the narrowest scope that owns the concern. Pass enhancer classes rather than
constructing instances in decorators so the Nest container can inject and reuse
them.

Register dependency-aware application-wide enhancers with `APP_GUARD`,
`APP_INTERCEPTOR`, `APP_PIPE`, or `APP_FILTER` providers in the module that owns
their implementation. Registering through an application instance is suitable
only for dependency-free objects created by the composition root. Verify hybrid
and non-HTTP reach separately.

## Preserve execution order

The inbound path is middleware, guards, interceptor pre-handlers, pipes, then
the controller or handler. The response unwinds through interceptors. An
uncaught failure jumps to the nearest matching filter.

Global guards, interceptors, and pipes run before controller-level and then
route-level instances. Interceptors unwind in the reverse order on the response
path. Filters resolve route first, then controller, then global, and one filter
does not pass an exception to the next filter. Keep the number of stacked
enhancers small and cover material ordering with an application test.

## Fail closed and translate once

Authenticate a credential into a typed principal once. Authorize the principal
against the requested action and resource in a guard or application policy.
Protect by default when most operations require authentication, and mark each
public operation explicitly. Distinguish missing or invalid authentication from
an authenticated principal lacking permission.

Keep business failures independent of Nest transport exceptions. A precise
filter maps each stable failure to one status or protocol error. Let built-in
handling retain framework HTTP exceptions unless the public envelope requires
one central mapping. A catch-all filter logs an unexpected error once, preserves
its diagnostic cause, and returns no stack, internal class name, SQL, secret, or
raw upstream payload.

An interceptor that observes an RxJS result must preserve success, error, and
cancellation semantics. A cache interceptor needs a proven key, tenant and
authorization isolation, expiry, and invalidation policy; otherwise keep caching
at the owning application or data boundary.

Finish when each concern has one enhancer owner, dependency-aware globals come
from the container, the verified order matches intent, authorization fails
closed, and every failure becomes one stable transport outcome.
