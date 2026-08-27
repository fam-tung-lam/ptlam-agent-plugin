# Interaction

Support enabled, disabled, hover, focused, pressed, and selected states
consistently. Combine indicators when needed; never let one state erase
another's meaning.

```css
:focus-visible {
  outline: 2px solid var(--color-focus);
  outline-offset: 3px;
  box-shadow: var(--elevation-focus);
}
button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}
```

Support touch, keyboard, mouse, trackpad, and assistive input through the same
state model. Every gesture-only operation needs a visible control or a keyboard
route. Respond at once to pointer and touch input, keep text selectable, and
keep the browser's default scrolling, zoom, focus, and activation behavior.

Expressive feedback uses shape morph, spring-like motion, size, containment, or
color emphasis according to the state. The state must stay readable when motion
is disabled, and combined states must stay distinguishable.

Source snapshot: Material 3 gesture, input, and interaction-state guidance,
captured with Firecrawl on 2026-08-07.
