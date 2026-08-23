# NestJS Use Cases

One transport-neutral use case per application operation under
`<feature>/usecases/`. Controllers, resolvers, gateways, message handlers, queue
processors, schedules, and CLI commands all use the same path.

```text
entry shell -> use case -> repository or integration port
```

## Give each boundary one responsibility

| Boundary       | Owns                                                 | Does not own                                   |
| -------------- | ---------------------------------------------------- | ---------------------------------------------- |
| Entry shell    | Trigger metadata, auth context, input and output map | Policy, queries, transaction decisions         |
| Use case       | One operation, orchestration, transaction boundary   | Nest decorators, transport context or errors   |
| Domain         | Business values, rules, and failures                 | Nest or persistence mechanics                  |
| Repository     | One persistence or remote-data contract              | Transport DTOs, protocol errors, commit policy |
| DTO            | Boundary validation and serialization                | Database writes or orchestration               |
| Feature module | Tokens, adapters, and use-case construction          | Business policy                                |

## Keep use cases independent of Nest

Use a verb-first file and class such as `create-user.ts` and `CreateUser`.
Receive collaborators in the constructor and operation input in one `execute`
method. Use a command object when the operation has several fields; pass one
scalar directly when it is the whole input.

Import no `@nestjs/*` package, decorator, request object, execution context, or
transport exception. Return a domain or application value and raise a domain
failure. The entry shell maps both to its public contract.

Do not call a sibling use case. Extract a shared feature policy, coordinate in a
higher operation, or publish an event so each transaction boundary stays
visible. Another feature enters only through the target module's exported use
case or facade.

## Assemble use cases in the feature module

Use the feature module as the DI assembly seam. A factory provider keeps the use
case ordinary while registering its runtime class token with Nest:

```typescript
{
  provide: CreateUser,
  inject: [USER_REPOSITORY],
  useFactory: (users: UserRepository) => new CreateUser(users),
}
```

Controllers inject the use-case class, not the repository token. Export a use
case only when another module has a real consumer. Keep repository adapters and
integration clients private to their owning module.

## Own one transaction decision

A write use case commits once after its atomic work succeeds. A read use case
makes the no-commit decision explicit. Entry shells and repositories do not
commit on behalf of the operation.

Keep a non-transactional remote effect after commit only when its failure and
retry contract is safe. Use an outbox or durable handoff when the database
change and effect must not drift apart.

## Review the pipeline mechanically

Search changed entry shells for ORM, repository-adapter, database-client, and
integration-client imports. Search `usecases/` for Nest and transport imports.
Search entry shells for commits and repositories for hidden commits. Remove each
result or identify it as untouched legacy code outside the change.

Finish when every changed entry shell calls one use case, each use case owns one
operation and transaction decision, each use case imports no Nest mechanic, and
ordinary construction proves its behavior without a container.
