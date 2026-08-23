# NestJS Application Lifecycle

How bootstrap, configuration, application-wide registration, and resource
lifetime compose one Nest process.

## Keep one composition path

Keep each runnable entry file as a thin bootstrap around one root module. An
HTTP or hybrid application shares one typed `configureApp` function with its
tests and selects its adapter explicitly when it does not use the default. A
worker or CLI creates an application context, resolves one entry shell, runs or
starts it, and closes the context according to that host's lifetime. Keep module
imports free of connections, listeners, jobs, and remote registration.

Load environment and file configuration once through the application's
configuration module, but validate them at their distinct Nest seams.
`ConfigModule.forRoot({ validate })` receives resolved environment input; parse
it there and return the typed environment configuration. A factory registered
through `load` owns custom, namespaced, JSON, or YAML configuration. Nest does
not pass that factory's result through `validate`, so the factory must parse and
transform its own input before returning it. Fail bootstrap before opening
listeners when either contract is invalid. Feature providers consume typed
configuration; they do not read `process.env` directly.

Keep adapter initialization in this composition path. Adapter plugins,
middleware syntax, raw-body access, trust-proxy behavior, and response APIs are
not portable between Express and Fastify.

## Harden a production HTTP adapter

Install security headers through the selected adapter's maintained integration
before routes. Make middleware and plugin order explicit when headers, raw-body
capture, compression, or response observation depend on it.

Configure CORS with explicit trusted origins, methods, headers, and credential
behavior. Add CSRF protection when ambient credentials such as cookies or
sessions authorize state changes. Bound request and upload sizes at the adapter
and tighten them per operation when needed.

Apply rate limits and abuse controls at the edge and, when operation metadata or
an authenticated principal matters, through a Nest-owned guard. Keep
authentication and authorization in guards. Trust forwarded client address and
protocol headers only from known proxy hops; rate limits and secure-cookie
decisions are wrong when arbitrary clients can supply them.

## Own startup and shutdown

Use Nest lifecycle interfaces on singleton providers that acquire or release
application resources. Choose the hook whose guarantee matches the work:

| Hook                        | Use                                                                   |
| --------------------------- | --------------------------------------------------------------------- |
| `OnModuleInit`              | Initialize after the provider's module dependencies resolve           |
| `OnApplicationBootstrap`    | Complete cross-module startup before the application starts listening |
| `OnModuleDestroy`           | Begin provider-owned cleanup after shutdown starts                    |
| `BeforeApplicationShutdown` | Finish draining work before application connections close             |
| `OnApplicationShutdown`     | Perform final cleanup after application connections close             |

Do not depend on incidental hook ordering between sibling modules. Express a
real dependency through injection and make each cleanup idempotent. Request-
scoped providers do not receive application lifecycle hooks.

Call `enableShutdownHooks()` for a long-running host that receives supported
termination signals. Bound drain and close operations so one dependency cannot
hold termination forever. Keep signal listeners disabled in serverless
invocations and ordinary tests; those hosts close or freeze the application by
their own contract. Verify platform signal support rather than assuming every
operating system or process manager delivers the same signals.

## Keep bootstrap verifiable

Await `app.listen()` or the selected microservice or worker start operation. A
hybrid application starts all connected microservices before or alongside its
HTTP listener according to one explicit startup policy. Make inheritance of the
main application's global configuration deliberate for each connected
microservice. When draining begins, notify the operations module before
application connections close.

A finite standalone command resolves providers with strict module selection when
ambiguity is possible, reports its result through the command boundary, and
calls `app.close()` in `finally`. A long-running standalone worker owns one
start, drain, and close path. Do not assume HTTP guards, pipes, interceptors, or
filters run when code is resolved directly from an application context.

Finish when configuration fails closed, construction is repeatable in tests,
startup opens each listener or worker once, finite commands close their context,
shutdown drains every long-running host, and each owned resource closes once.
