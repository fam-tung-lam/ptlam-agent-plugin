# Documenting Flutter Types

What a doc comment on a Flutter type has to answer, beyond the contract every
public declaration owes its caller.

Each row below names what a reader of that type cannot work out from its
signature. Document all of it, in the domain's language.

| Symbol               | Document                                                                            |
| -------------------- | ----------------------------------------------------------------------------------- |
| Widget               | What it renders, what each constructor argument controls, and any required ancestor |
| BLoC or Cubit        | Which events it accepts, which states it emits, and what closes it                  |
| Use case             | The rule it enforces and every failure it can return                                |
| Repository           | Which sources answer, the fallback when one fails, and the failures it returns      |
| Entity or DTO        | What the type means and any renamed wire field                                      |
| Extension or utility | When to use it and when not to                                                      |

A widget's required ancestor is the commonest omission: a widget that reads a
`BlocProvider`, `Theme`, or localization scope throws at runtime when someone
mounts it without one, and only the doc comment warns them first.

Say who disposes what. Whenever a constructor accepts a controller, a focus
node, or a subscription, the comment states whether the widget closes it or the
caller keeps that duty.

Generated files receive no doc comments. Change their annotated source and
regenerate through [SKILL.md](../SKILL.md#shared-toolchain).

Finish when every public widget, state holder, use case, and repository you
touched answers its row, and every lifecycle duty the signature hides is named.
