# NestJS Application Lifecycle

How bootstrap, configuration, application-wide registration, and resource
lifetime compose one Nest process.

## Keep one composition path

Keep `main.ts` as a thin bootstrap around one root module and, when tests need
the same application configuration, one typed `configureApp` function. Select
the HTTP adapter explicitly when the project does not use the default. Keep
module imports free of connections, listeners, jobs, and remote registration.

Load environment and file configuration once through the application's
configuration module. Attach the validator already selected for external input
to the configuration module's synchronous validation hook. Return a parsed,
typed configuration object and fail bootstrap before opening listeners when a
required setting is invalid. Feature providers consume typed configuration; they
do not read `process.env` directly.

Keep adapter initialization in this composition path. Adapter plugins,
middleware syntax, raw-body access, trust-proxy behavior, and response APIs are
not portable between Express and Fastify.

## Harden the production adapter

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

Await `app.listen()` or the selected microservice start operation. A hybrid
application starts all connected microservices before or alongside its HTTP
listener according to one explicit readiness policy. Make inheritance of the
main application's global configuration deliberate for each connected
microservice.

After an application starts, liveness proves that its process can answer.
Readiness proves only the critical dependencies required to accept traffic. Keep
version and build information separate from either health decision.

Finish when configuration fails closed, application construction is repeatable
in tests, startup opens each listener once, shutdown drains and closes every
owned resource, and health state follows the real lifecycle.
