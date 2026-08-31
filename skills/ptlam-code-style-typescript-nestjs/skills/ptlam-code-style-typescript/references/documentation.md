# TypeScript Doc Comments

TSDoc syntax and documentation-tool mechanics.

Use the repository's established comment convention and documentation tool. Do
not introduce a second tag dialect into a project that already chose one.

When the repository is silent, use a TSDoc block comment placed directly above
the declaration: one summary sentence, a blank line, then the required detail.
Let the type signature carry the types; repeating them in prose creates a second
copy that drifts.

```ts
/**
 * Applies a discount to an order total.
 *
 * @param percentage - Whole percent between 0 and 100.
 * @throws RangeError when the percentage is outside that range.
 */
export function applyDiscount(total: Money, percentage: number): Money {
  // …
}
```

Use `@param name - description` for parameter documentation and `@returns` for
the result. Keep TypeScript type annotations in the signature, not in the tags.
Use `@throws` to describe a promised failure; the tag does not constrain what
JavaScript can throw at runtime.

Use `@deprecated` with the replacement and the release that removes it, so the
comment tells a reader what to do rather than only that something is wrong.

Use release tags such as `@internal`, `@alpha`, or `@beta` only when a
configured tool acts on them. An unenforced tag is a comment that reads like a
guarantee.

Treat an `@example` as executable only when the repository runs it. Otherwise it
is documentation that no check keeps true, so keep it small enough to verify by
reading.

Explain why in an ordinary comment at the surprise itself, not in the doc
comment. The doc comment states the contract; the inline comment records the
reason the code cannot be simpler.

Finish when the comment parses under the configured tool and, when the
repository generates API documentation, the rendered contract matches the
implementation and its tests.
