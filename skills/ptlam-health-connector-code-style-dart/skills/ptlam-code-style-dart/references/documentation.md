# Dartdoc Comments

The syntax Dart uses for a documentation comment, and the tools that check it.

## Write `///`, summary first

Use `///` on every line. `/** */` is legacy and `slash_for_doc_comments` reports
it. Put the comment directly above the declaration, above any annotation.

Open with one sentence that ends in a period and fits on its own line. Dartdoc
lifts that first paragraph into every index and search result, so a summary that
runs three lines shows up cut off everywhere. Leave a blank `///` line before
any further detail. Write the summary in the third person: "Returns the cached
locale."

```dart
/// Places [order] and returns the accepted confirmation.
///
/// Throws [ArgumentError] when [Order.id] is empty, and
/// [OrdersUnavailable] when the service declines the request.
Future<Confirmation> place(Order order) async { … }
```

## Link every symbol you name

Put a symbol in square brackets, such as `[Order]`, `[place]`, or `[Order.id]`,
and dartdoc links it to that declaration's page. Enable `comment_references`; it
reports `The referenced name isn't visible in scope`, which catches a renamed
symbol and a symbol you never imported.

Name each thrown type in brackets too. That is the only way a caller browsing
the generated API sees what it must catch.

## Reuse a block instead of copying it

Define the block once and stamp it wherever it belongs:

```dart
/// {@template orders.retry}
/// Retries up to three times with exponential backoff.
/// {@endtemplate}

/// Fetches the order.
///
/// {@macro orders.retry}
Future<Order> fetch(String id) async { … }
```

`dart doc` expands `{@macro}` into the generated page. Prefix the template name
with the package or library so two packages cannot collide.

## Document the library, not the file

A library-level doc comment needs a `library;` directive below it, or dartdoc
attaches it to whatever declaration follows. The `dangling_library_doc_comments`
lint reports a doc comment left floating.

## Let the tools check it

| Rule                     | Requires                                             |
| ------------------------ | ---------------------------------------------------- |
| `public_member_api_docs` | A doc comment on every public member                 |
| `package_api_docs`       | A doc comment on every declaration a package exports |
| `comment_references`     | Every bracketed name to resolve                      |

Run `dart doc` before publishing anything with a documented surface. It prints a
warning-and-error count and fails on a broken reference.

Generated files get no doc comments. Change the annotated source and regenerate.

## Finish

Finish when every public declaration you touched has a `///` comment whose first
sentence stands alone, every symbol and thrown type it names is bracketed, and
`dart doc` reports no new warning.
