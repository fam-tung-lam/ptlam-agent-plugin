# NestJS Use Cases

One transport-neutral use case per application operation under
`<feature>/application/use-cases/`. Controllers, resolvers, gateways, message
handlers, queue processors, schedules, and CLI commands all take the same path.

```text
presentation adapter -> application DTO -> use case -> application port -> infrastructure adapter
```

## Give each boundary one responsibility

| Boundary               | Owns                                                  | Does not own                                  |
| ---------------------- | ----------------------------------------------------- | --------------------------------------------- |
| Presentation adapter   | Trigger metadata, auth context, and protocol mapping  | Policy, queries, or transaction decisions     |
| Application DTO        | Validated operation input and output shape            | Nest context, writes, or orchestration        |
| Use case               | One operation, its orchestration, and its transaction | Nest decorators, transport context, or errors |
| Domain                 | Business values, rules, and failures                  | Nest or persistence mechanics                 |
| Application port       | One persistence or remote-effect contract             | Transport DTOs, errors, or commit policy      |
| Infrastructure adapter | Implements one port with database or vendor mechanics | Transport mapping or business policy          |
| Feature module         | Tokens, adapters, and use-case construction           | Business policy                               |

## Keep use cases independent of Nest

Use a verb-first file and class, such as `create-user.use-case.ts` and
`CreateUserUseCase`. Receive collaborators in the constructor and operation
input in one `execute` method. Use an application DTO or command object when the
operation has several fields; pass one scalar directly when that is the whole
input.

Import no `@nestjs/*` package, decorator, request object, execution context, or
transport exception. Application DTOs also stay free of Nest transport context.
Return a domain or application value and raise a domain failure; the
presentation adapter maps both to its public contract.

Do not call a sibling use case. Extract a shared feature policy, coordinate in a
higher operation, or publish an event, so each transaction boundary stays
visible. Another feature enters only through the target module's exported use
case or facade.

## Assemble use cases in the feature module

The feature module is the assembly seam. A factory provider keeps the use case
ordinary while registering its class token with Nest:

```typescript
{
  provide: CreateUserUseCase,
  inject: [USER_REPOSITORY],
  useFactory: (users: UserRepositoryPort) => new CreateUserUseCase(users),
}
```

Presentation adapters inject the use-case class, not the port token. Export a
use case only when another module really consumes it. Keep infrastructure
adapters and integration clients private to their owning module.

## Own one transaction decision

A write use case commits once, after its atomic work succeeds. A read use case
makes the no-commit decision explicit. Presentation and infrastructure adapters
never commit on the operation's behalf.

Keep a non-transactional remote effect after the commit only when its failure
and retry behavior is safe. Use an outbox or another durable handoff when the
database change and the effect must not drift apart.

## Check the pipeline mechanically

Search changed presentation adapters for ORM, infrastructure-adapter,
database-client, and integration-client imports. Search `application/use-cases/`
and `application/dtos/` for Nest and transport imports. Search presentation
adapters for commits and infrastructure adapters for hidden commits. Remove each
result, or identify it as untouched legacy code outside the change.

Finish when every changed presentation adapter calls one use case, each use case
owns one operation and one transaction decision, application and domain import
no Nest mechanic, infrastructure implements application ports, and ordinary
construction proves use-case behavior without a container.
