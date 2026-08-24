# NestJS Project Structure

A feature-first hexagonal backend layout. Preserve a coherent existing structure
and reorganize only files owned by the requested change.

## Grow into this structure

Keep a small application flat until a second business capability makes feature
directories useful. Add a directory when its first owned file appears.

```text
project/
├── src/
│   ├── main.ts                         # one runnable entry point
│   ├── app.module.ts                   # composition root
│   ├── config/                         # typed application configuration
│   ├── operations/                     # health, readiness, and build information
│   │   ├── operations.controller.ts
│   │   └── operations.module.ts
│   ├── integrations/                   # shared clients and pools
│   │   ├── database/
│   │   │   ├── database.module.ts
│   │   │   └── database.client.ts
│   │   ├── redis/
│   │   │   ├── redis.module.ts
│   │   │   └── redis.client.ts
│   │   └── queue/
│   │       ├── queue.module.ts
│   │       └── queue.client.ts
│   ├── shared/                         # framework-neutral, proven cross-feature reuse
│   │   ├── errors/
│   │   ├── constants/
│   │   └── utils/
│   └── users/                          # one business capability
│       ├── users.module.ts             # feature composition and public Nest facade
│       ├── application/
│       │   ├── dtos/                   # validated application input and output contracts
│       │   │   ├── create-user.dto.ts
│       │   │   └── user.dto.ts
│       │   ├── ports/                  # contracts plus stable runtime tokens
│       │   │   └── user-repository.port.ts
│       │   └── use-cases/              # one application operation per file
│       │       ├── create-user.use-case.ts
│       │       └── get-user.use-case.ts
│       ├── domain/
│       │   ├── entities/
│       │   ├── failures/
│       │   └── value-objects/
│       ├── infrastructure/
│       │   └── adapters/               # persistence and outbound port implementations
│       │       └── sql-user.repository.ts
│       └── presentation/               # inbound Nest adapters
│           ├── http/
│           │   └── users.controller.ts
│           └── tasks/                  # processors, schedules, listeners, and commands
└── tests/
    ├── app/
    │   └── integration/
    └── users/                          # mirrors src/users/
        ├── test-doubles/
        ├── unit/
        │   ├── application/use-cases/
        │   └── domain/
        └── integration/
            ├── infrastructure/
            └── presentation/
```

## Give each location one role

| Location                   | Owns                                                                          |
| -------------------------- | ----------------------------------------------------------------------------- |
| `main.ts`                  | Bootstrap one HTTP, microservice, worker, CLI, or application context         |
| `app.module.ts`            | Configuration, integrations, operations, and feature composition              |
| `config/`                  | Parsing and exposing typed configuration                                      |
| `operations/`              | Unversioned operational endpoints and drain state                             |
| `integrations/`            | One reusable client, pool, or broker facade per external system               |
| `shared/`                  | Framework-neutral code with multiple proven feature consumers                 |
| `<feature>.module.ts`      | Feature DI assembly and the capability's public Nest surface                  |
| `application/dtos/`        | Validated application inputs and outputs; no Nest transport context           |
| `application/ports/`       | Feature-owned repository and integration contracts plus runtime tokens        |
| `application/use-cases/`   | Transport-neutral application operations                                      |
| `domain/`                  | Entities, immutable values, business rules, and stable failures               |
| `infrastructure/adapters/` | Persistence and outbound implementations of application ports                 |
| `presentation/`            | Thin inbound HTTP, GraphQL, message, queue, schedule, event, and CLI adapters |
| `tests/<feature>/`         | Tests mirroring the same feature layers and test-level ownership              |

Keep a shared integration free of feature policy. A database integration owns
the pool and framework registration; a feature infrastructure adapter owns its
queries and mapping. Put a queue processor or schedule in the owning feature's
presentation layer, not in the shared queue integration.

Finish when the source tree names business capabilities, dependency flow runs
from presentation through application to domain and inward-facing ports, each
feature has one module facade, integrations expose infrastructure rather than
policy, and tests mirror the same ownership.
