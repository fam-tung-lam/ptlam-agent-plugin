# Rendered inspection

This file covers the browser conditions a page must survive after static
validation, and what to do when one fails.

Static validation cannot see rendered overflow, a clipped focus ring, or a
control that becomes unreachable. Only opening the document finds those.

## Inspect every condition

| Condition                 | Must still hold                                         |
| ------------------------- | ------------------------------------------------------- |
| Narrow and wide viewports | Content, controls, and diagrams stay visible and usable |
| 320 px viewport width     | No horizontal document scroll                           |
| 200% text zoom            | No clipped or overlapping text                          |
| Keyboard only             | Every control is reachable, and focus stays visible     |
| Reduced motion            | Every transition still shows its state change           |
| Scripts disabled          | The document explains every step                        |
| Offline reload            | The page opens with zero external network requests      |

Exercise every interactive step and every zoom level, not just the default
state. Reload with the browser offline and read its network log; an external
request fails this contract even when the validator missed it.

## When something overflows

Reflow the offending grid, flex child, label, SVG, code block, or badge. Never
hide document overflow to make the symptom disappear; that trades a visible bug
for content the learner cannot reach.

Done when every condition above holds, and anything you could not check is named
in the handoff.
