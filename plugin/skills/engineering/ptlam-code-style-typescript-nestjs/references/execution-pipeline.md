# NestJS Execution Pipeline

How cross-cutting request and message behavior enters the Nest execution path.

## Give each enhancer one job

| Component   | Owns                                                                          |
| ----------- | ----------------------------------------------------------------------------- |
| Middleware  | Adapter-level request setup, raw protocol needs, and early correlation        |
| Guard       | Authentication or authorization before a handler runs                         |
| Interceptor | Timings, tracing, response mapping, caching, and before-or-after handler work |
| Pipe        | Boundary validation and deliberate transformation of handler arguments        |
| Filter      | Turning one uncaught exception family into one transport error                |

Use the narrowest scope that owns the concern. Pass enhancer classes rather than
building instances in decorators, so the container can inject and reuse them.

Register dependency-aware application-wide enhancers with `APP_GUARD`,
`APP_INTERCEPTOR`, `APP_PIPE`, or `APP_FILTER` providers in the module that owns
their implementation. Registering through an application instance suits only
dependency-free objects the composition root creates. Check hybrid and non-HTTP
reach separately.

## Keep the order

The inbound path is middleware, guards, interceptor pre-handlers, pipes, then
the controller or handler. The response unwinds through the interceptors. An
uncaught failure jumps to the nearest matching filter.

Global guards, interceptors, and pipes run before controller-level and then
route-level instances. Interceptors unwind in reverse order on the response
path. Filters resolve route first, then controller, then global, and one filter
never passes an exception to the next. Keep the number of stacked enhancers
small, and cover any order that matters with an application test.

## Fail closed and translate once

Turn a credential into a typed principal once. Authorize that principal against
the requested action and resource in a guard or an application policy. Protect
by default when most operations need authentication, and mark each public
operation explicitly. Distinguish missing or invalid authentication from an
authenticated principal without permission.

Keep business failures independent of Nest transport exceptions. A precise
filter maps each stable failure to one status or protocol error. Let built-in
handling keep framework HTTP exceptions unless the public envelope needs one
central mapping. A catch-all filter logs an unexpected error once, keeps its
cause for diagnosis, and returns no stack, internal class name, SQL, secret, or
raw upstream payload.

An interceptor that observes an RxJS result must preserve success, error, and
cancellation behavior. A cache interceptor needs a proven key, tenant and
authorization isolation, expiry, and an invalidation policy; otherwise keep
caching at the owning application or data boundary.

Finish when each concern has one enhancer owner, dependency-aware globals come
from the container, the checked order matches intent, authorization fails
closed, and every failure becomes one stable transport outcome.
