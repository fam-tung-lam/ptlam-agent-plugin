# Widgets

How a widget is built, split, rebuilt, and keyed.

## Split into widgets, not build methods

Extract a subtree into its own widget class. Do not extract it into a
`Widget _buildHeader()` method on the same class.

A widget class can be `const`, and it rebuilds on its own. A build method
returns a subtree that rebuilds whenever its host does, and can never be
`const`. The two look alike in the editor and behave nothing alike at runtime.

The feature's `widgets/` directory contains one page and a `components/`
directory. Give each logical part of that page its own component widget instead
of nesting the whole page in one build method.

Start every widget `StatelessWidget`. Promote to `StatefulWidget` only for state
the widget itself owns across a rebuild: a controller, an animation, a
subscription, a focus node. Anything a business rule observes belongs in a BLoC.

Dispose in `dispose()` everything you created in `initState()`.

## Keep build cheap

`build` composes widgets and reads state. It never sorts a list, parses a
string, formats a date for the twentieth time, or starts a request. Do that work
where the state is produced, and let `build` render the result.

Nothing in `build` may have a side effect. A rebuild can happen at any time, for
reasons the widget cannot see.

## Rebuild the smallest subtree

| Need                                                 | Use            |
| ---------------------------------------------------- | -------------- |
| Render on every state change                         | `BlocBuilder`  |
| Render on one field of the state                     | `BlocSelector` |
| React without rendering — navigate, snackbar, dialog | `BlocListener` |
| Both, on the same state                              | `BlocConsumer` |

Put the builder as deep in the tree as the state is actually used. Wrapping a
whole page in one `BlocBuilder` rebuilds a static app bar to update a counter.

Use `buildWhen` and `listenWhen` when a state class carries fields the subtree
does not read.

Navigation, dialogs, and snackbars belong in a listener, never in a builder. A
builder can run more than once for the same state.

## BuildContext

- Never store a `BuildContext` in a field or pass one into a BLoC, use case, or
  repository.
- After an `await`, the context may be dead. Check `context.mounted` before
  using it, or capture what you need before the gap.
- Read `Theme`, `MediaQuery`, and localization at the narrowest widget that
  needs them. Reading them high in the tree makes everything below rebuild on
  rotation or theme change.

## Keys

Most widgets need no key. Add one when the framework must tell two same-typed
siblings apart across a rebuild: reorderable lists, dismissible items, swapped
form fields.

Use a `ValueKey` carrying the item's stable identifier. An index changes when
the list reorders, which is precisely the case the key exists for.

## Take every visual value from the design system

Colors, typography, spacing, elevation, shape, and motion come from the theme
and the design-system package. A literal `Color(0xFF…)` or `TextStyle` inside a
feature widget is a defect: it will not follow the dark theme and it will not
change when the design does.

When a value is genuinely missing from the design system, add it there and use
it from the feature.

## Lists

Build long or unbounded lists with a `builder` constructor so only visible items
are built. `ListView(children: [...])` builds every child immediately, which is
fine only for a short, fixed list.

Give the list a stable item identity and keep item widgets `const` where their
inputs allow.
