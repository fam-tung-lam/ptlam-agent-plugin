# NestJS Application Lifecycle

How bootstrap, configuration, application-wide registration, and resource
lifetime compose one Nest process.

## Keep one composition path

Keep each runnable entry file a thin bootstrap around one root module. Match
bootstrap, dispatch, and closing to the chosen host:

| Host form                           | Who owns the lifecycle                                                                         |
| ----------------------------------- | ---------------------------------------------------------------------------------------------- |
| HTTP or hybrid application          | The bootstrap creates the application, applies one typed `configureApp`, starts, and closes it |
| Custom standalone command or worker | The bootstrap creates a context, resolves its shell, and owns run, drain, and close            |
| Queue, schedule, or event runner    | The host supplies a Nest context; the integration finds and dispatches registered providers    |
| Runner-managed CLI                  | The runner owns context creation, dispatch, and closing when its API promises them             |

Never manually invoke a processor, schedule, listener, or runner-managed command
its integration discovers. Keep module imports free of connections, listeners,
jobs, and remote registration.

Load environment and file configuration once through the configuration module,
but validate each at its own Nest seam. `ConfigModule.forRoot({ validate })`
receives resolved environment input; parse it there and return the typed
configuration. A factory registered through `load` owns custom, namespaced,
JSON, or YAML configuration. Nest does not pass that factory's result through
`validate`, so the factory parses its own input. Fail bootstrap before opening
listeners when either is invalid. Feature providers consume typed configuration;
they never read `process.env`.

Keep adapter setup in this composition path. Adapter plugins, middleware syntax,
raw-body access, trust-proxy behavior, and response APIs do not carry over
between Express and Fastify.

## Harden a production HTTP adapter

Install security headers through the adapter's maintained integration before
routes. Make middleware and plugin order explicit when headers, raw-body
capture, compression, or response observation depend on it.

Configure CORS with explicit trusted origins, methods, headers, and credential
behavior. Add CSRF protection when cookies or sessions authorize state changes.
Bound request and upload sizes at the adapter, and tighten them per operation
when needed.

Apply rate limits and abuse controls at the edge and, when operation metadata or
an authenticated principal matters, through a Nest guard. Keep authentication
and authorization in guards. Trust forwarded client address and protocol headers
only from known proxy hops; rate limits and secure-cookie decisions are wrong
when any client can supply them.

## Own startup and shutdown

Use Nest lifecycle interfaces on singleton providers that acquire or release
application resources. Choose the hook whose guarantee matches the work:

| Hook                        | Use                                                                 |
| --------------------------- | ------------------------------------------------------------------- |
| `OnModuleInit`              | Initialize after the provider's module dependencies resolve         |
| `OnApplicationBootstrap`    | Finish cross-module startup before the application starts listening |
| `OnModuleDestroy`           | Begin provider cleanup after shutdown starts                        |
| `BeforeApplicationShutdown` | Finish draining work before application connections close           |
| `OnApplicationShutdown`     | Do final cleanup after application connections close                |

Never depend on accidental hook order between sibling modules. Express a real
dependency through injection, and make each cleanup safe to run twice.
Request-scoped providers receive no application lifecycle hooks.

Call `enableShutdownHooks()` for a long-running host that receives termination
signals. Bound drain and close operations so one dependency cannot hold
termination forever. Keep signal listeners off in serverless invocations and
ordinary tests, which close or freeze the application their own way. Check
platform signal support instead of assuming every OS or process manager delivers
the same signals.

## Keep bootstrap checkable

Await `app.listen()` or the chosen microservice or worker start. A hybrid
application starts every connected microservice before or beside its HTTP
listener, under one explicit policy. Decide deliberately whether each connected
microservice inherits the main application's global configuration. When draining
starts, tell the operations module before connections close.

A finite standalone command resolves providers with strict module selection when
ambiguity is possible, reports its result through the command boundary, and
calls `app.close()` in `finally`. A long-running standalone worker owns one
start, drain, and close path. A framework runner receives registered entry
shells and keeps its documented ownership of discovery, dispatch,
acknowledgement, retry, and closing. Do not assume HTTP guards, pipes,
interceptors, or filters run when code is resolved straight from a context.

Finish when configuration fails closed, construction is repeatable in tests,
startup opens each listener or worker once, each runner dispatches registered
shells once, the lifecycle owner closes its context, shutdown drains every
long-running host, and each owned resource closes once.
