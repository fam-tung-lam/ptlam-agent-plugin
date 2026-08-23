# NestJS Project Structure

A feature-first backend layout shared with the other PTLam service
specializations. Preserve a coherent existing structure and reorganize only
files owned by the requested change.

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
│       ├── users.module.ts             # feature composition and public facade
│       ├── users.controller.ts         # or resolver, gateway, or message handler
│       ├── users.tokens.ts             # stable runtime injection tokens
│       ├── models/
│       │   ├── dtos/                   # transport request and response contracts
│       │   ├── entities/               # persistence entities
│       │   ├── failures/               # domain failure types
│       │   └── value-objects/          # immutable domain values
│       ├── usecases/                   # one application operation per file
│       │   ├── create-user.ts
│       │   └── get-user.ts
│       ├── repositories/               # ports and persistence adapters
│       │   ├── user-repository.ts
│       │   └── sql-user-repository.ts
│       └── tasks/                      # queue, schedule, event, or CLI entry shells
└── tests/
    ├── app/
    │   └── integration/
    └── users/                          # mirrors src/users/
        ├── test-doubles/
        ├── unit/
        │   └── usecases/
        └── integration/
```

## Give each location one role

| Location              | Owns                                                                     |
| --------------------- | ------------------------------------------------------------------------ |
| `main.ts`             | Bootstrap one HTTP, microservice, worker, CLI, or application context    |
| `app.module.ts`       | Configuration, integrations, operations, and feature composition         |
| `config/`             | Parsing and exposing typed configuration                                 |
| `operations/`         | Unversioned operational endpoints and drain state                        |
| `integrations/`       | One reusable client, pool, or broker facade per external system          |
| `shared/`             | Framework-neutral code with multiple proven feature consumers            |
| `<feature>.module.ts` | Feature DI assembly and the capability's public Nest surface             |
| Entry shell           | Trigger metadata, validated input, one use-case call, and output mapping |
| `models/`             | Explicit DTO, entity, failure, and value-object categories               |
| `usecases/`           | Transport-neutral application operations                                 |
| `repositories/`       | Feature-owned data contracts and their adapters                          |
| `tests/<feature>/`    | Tests arranged by the same capability and level ownership                |

Keep a shared integration free of feature policy. A database integration owns
the pool and framework registration; a feature repository owns its queries and
mapping. Put a queue processor or schedule beside the feature that owns its
behavior, not in the shared queue integration.

Finish when the source tree names business capabilities, every entry shell
delegates to a use case, each feature has one module facade, integrations expose
infrastructure rather than policy, and tests mirror the same ownership.
