# Doc Comments and Comments

The dartdoc mechanics. The `ptlam-code-style` foundation owns what belongs in a
doc comment and what an explanatory comment is for.

## Form

Use `///`, never `/** */`. `very_good_analysis` enforces a doc comment on every
public member through `public_member_api_docs`; a private member gets one when
its name and signature do not already explain it.

Start with one sentence that ends in a period, on its own line. Dartdoc uses it
as the summary everywhere the symbol is listed, so it has to stand alone.

Leave a blank `///` line, then the detail.

```dart
/// Places [order] and returns the accepted confirmation.
///
/// Returns [OrdersFailure.rejected] when the server declines the order, and
/// [OrdersFailure.offline] when the device cannot reach the API. Never throws.
```

Write in the third person for a method — "Returns the cached locale", not
"Return the cached locale" or "This method returns…".

Reference another symbol in square brackets: `[Order]`, `[placeOrder]`,
`[OrdersRepository.watch]`. Dartdoc links them, and the analyzer reports a
bracket that no longer resolves — which is how a rename gets caught.

Reuse a repeated block with `{@template name}` and `{@macro name}` instead of
copying it, so the copies cannot drift.

## What each kind needs

| Symbol | Document |
| --- | --- |
| Widget | What it renders, what each constructor argument controls, and any required ancestor such as a provider or theme |
| BLoC | Which events it accepts, which states it emits, and what closes it |
| Use case | The rule it enforces and every failure it can return |
| Repository | Which sources answer, the fallback when one fails, and the failures it returns |
| Model or DTO | What the type means; note the wire name where `@JsonKey` renames a field |
| Extension or utility | When to use it, and when not to |

Document the failure cases. Dart's type system does not express them, so the doc
comment is the only place a caller learns what can come back.

Note anything the signature hides: whether a stream is broadcast, whether the
caller owns disposal, whether an operation is safe to call twice.

## Comments

Explain why. The code already says what. A comment restating the line under it
goes stale silently — the foundation covers this.

Mark a workaround with the condition that ends it: the package version, the
platform, or the upstream behavior it compensates for. A reader must be able to
tell whether it is still needed.

Do not write doc comments on generated files, and do not edit them to add one —
see [SKILL.md](../SKILL.md#shared-toolchain).

Do not leave commented-out widgets. They rot faster than anything else in the
file, and Git already has them.
