# Widgets and Routes

How a widget is built, split, rebuilt, and keyed, and how a route is declared.

## Split into widgets, not build methods

Extract a subtree into its own widget class, never into a
`Widget _buildHeader()` method. A widget class can be `const` and rebuilds on
its own; a build method rebuilds whenever its host does and can never be
`const`.

`presentation/pages/` holds route-level pages; `presentation/widgets/` holds
their component widgets. Give each logical part of a page its own widget.

Start every widget as a `StatelessWidget`. Promote to `StatefulWidget` only for
state the widget itself owns across a rebuild: a controller, an animation, a
subscription, a focus node. State that outlives a widget belongs in a BLoC;
product rules belong in a use case or domain type. Dispose in `dispose()`
everything you created in `initState()`.

## Keep `build` cheap

`build` composes widgets and reads state. It never sorts a list, parses a
string, formats a date for the twentieth time, or starts a request. Do that work
where the state is produced. Nothing in `build` may have a side effect; a
rebuild can happen at any time for reasons the widget cannot see.

## Rebuild the smallest subtree

| Need                                                 | Use            |
| ---------------------------------------------------- | -------------- |
| Render on every state change                         | `BlocBuilder`  |
| Render on one field of the state                     | `BlocSelector` |
| React without rendering (navigate, snackbar, dialog) | `BlocListener` |
| Both, on the same state                              | `BlocConsumer` |

Put the builder as deep in the tree as the state is used. Wrapping a whole page
in one `BlocBuilder` rebuilds a static app bar to update a counter. Use
`buildWhen` and `listenWhen` when a state carries fields the subtree does not
read. Navigation, dialogs, and snackbars belong in a listener, never a builder;
a builder can run more than once for the same state.

## `BuildContext`

- Never store a `BuildContext` in a field or pass one into a BLoC, use case, or
  repository.
- After an `await`, the context may be dead. Check `context.mounted` before
  using it, or capture what you need before the gap.
- Read `Theme`, `MediaQuery`, and localization at the narrowest widget that
  needs them; reading them high in the tree rebuilds everything below on
  rotation or theme change.

## Keys

Most widgets need no key. Add one when the framework must tell two same-typed
siblings apart across a rebuild: reorderable lists, dismissible items, swapped
form fields. Use a `ValueKey` carrying the item's stable identifier, never its
index.

## Take every visual value from the design system

Colors, typography, spacing, elevation, shape, and motion come from the theme
and the design-system package. A literal `Color(0xFF…)` or `TextStyle` inside a
feature widget is a defect: it will not follow the dark theme or the next design
change. When a value is missing from the design system, add it there.

## Lists

Build long or unbounded lists with a `builder` constructor so only visible items
are built. `ListView(children: [...])` builds every child at once, which is fine
only for a short, fixed list. Give items a stable identity and keep item widgets
`const` where their inputs allow.

## Routes

Keep routes in `app_router.dart`. Declare them with
[`go_router`](https://pub.dev/packages/go_router) and
[`go_router_builder`](https://pub.dev/packages/go_router_builder), so route
names and parameters are checked at compile time. Navigate through generated
route objects; never build a route from a hand-written path string. Regenerate
route output through the shared command in
[SKILL.md](../SKILL.md#shared-toolchain) after changing a route annotation.
