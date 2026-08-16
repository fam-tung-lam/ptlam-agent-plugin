# Rendered Inspection

This reference owns the browser conditions an artifact must survive after
static validation, and what to do when one fails.

Static validation cannot detect rendered overflow, clipped focus rings, or a
control that becomes unreachable. Only opening the document finds those.

## Inspect every condition

| Condition | Must still hold |
| --- | --- |
| Narrow and wide viewports | Content, controls, and diagrams stay visible and usable |
| 320 px viewport width | No horizontal document scroll |
| 200% text zoom | No clipped or overlapping text |
| Keyboard only | Every control is reachable, and focus stays visible |
| Reduced motion | Every transition still conveys its state change |
| Scripts disabled | The document explains every step |

Exercise every interactive step and every semantic-zoom level, not just the
default state.

## When something overflows

Reflow the offending grid, flex child, label, SVG, code block, or badge.

Never hide document overflow to make the symptom disappear. That trades a
visible layout bug for content the learner cannot reach.

## Finish

Finish when every condition above holds, and any behavior you could not verify
is named in the handoff.
