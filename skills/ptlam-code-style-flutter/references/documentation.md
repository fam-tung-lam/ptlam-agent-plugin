# Dartdoc Mechanics

How Flutter code spells the public documentation contract owned by the
`ptlam-code-style` foundation.

## Form

Use `///`, never `/** */`. `very_good_analysis` enforces a doc comment on every
public member through `public_member_api_docs`; add one to a private member only
when its name and signature do not already explain it.

Start with one sentence that ends in a period, on its own line. Dartdoc uses it
as the summary wherever the symbol is listed. Leave a blank `///` line before
any detail.

```dart
/// Places [order] and returns the accepted confirmation.
///
/// Returns [OrdersFailure.rejected] when the server declines the order, and
/// [OrdersFailure.offline] when the device cannot reach the API. Never throws.
```

Write a method summary in the third person: “Returns the cached locale,” not
“Return the cached locale” or “This method returns…”.

Reference another symbol in square brackets: `[Order]`, `[placeOrder]`, or
`[OrdersRepository.watch]`. Reuse a repeated block with `{@template name}` and
`{@macro name}` so copies cannot drift.

## What each kind needs

| Symbol               | Document                                                                            |
| -------------------- | ----------------------------------------------------------------------------------- |
| Widget               | What it renders, what each constructor argument controls, and any required ancestor |
| BLoC                 | Which events it accepts, which states it emits, and what closes it                  |
| Use case             | The rule it enforces and every failure it can return                                |
| Repository           | Which sources answer, the fallback when one fails, and the failures it returns      |
| Model or DTO         | What the type means and any renamed wire field                                      |
| Extension or utility | When to use it and when not to                                                      |

Document failure cases and anything the signature hides, such as stream type,
disposal ownership, idempotency, or another lifecycle constraint.

Generated files receive no doc comments. Change their annotated source and
regenerate through [SKILL.md](../SKILL.md#shared-toolchain).
