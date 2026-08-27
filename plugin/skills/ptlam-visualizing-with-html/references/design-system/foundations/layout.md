# Layout

Apply `min-width: 0` to every nested grid and flex child. Use `minmax(0, 1fr)`
rather than `1fr`. Wrap technical text on purpose.

The scaffold owns global box sizing and responsive media defaults, and it owns
the page shell. Add layout-specific containment without hiding document
overflow:

```css
.split {
  display: grid;
  grid-template-columns: minmax(0, 1.15fr) minmax(0, 0.85fr);
  gap: var(--space-4);
}
.split > * {
  min-width: 0;
}
@media (max-width: 47.5rem) {
  .split {
    grid-template-columns: minmax(0, 1fr);
  }
}
```

Never clip meaningful content to hide overflow. Reflow first; let a contained
code block scroll only when wrapping would corrupt its meaning.

Use Material's compact, medium, expanded, large, and extra-large breakpoints as
decision inputs, not device labels. A breakpoint marks a layout change based on
available space, input conventions, and ergonomics. Keep the layout correct for
both left-to-right and right-to-left content.

Prefer one of these structures before inventing a custom layout:

- feed: a grid for scanning many peer items;
- list-detail: a list beside the selected detail; or
- supporting pane: a main learning area beside secondary context.

Source snapshot: Material 3 layout overview and canonical examples, captured
with Firecrawl on 2026-08-07.
