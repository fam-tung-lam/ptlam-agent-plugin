# Accessibility

Treat accessibility as a property of the whole page: content, layout,
interaction, styles, and components.

- Give each SVG `role="img"` and `aria-labelledby` pointing to a `<title>` and
  optional `<desc>` in that same SVG.
- Use native controls, and `aria-pressed` for toggles.
- Put changing captions in an `aria-live="polite"` region.
- Keep pointer targets at least 44 by 44 CSS pixels, and prefer 48 by 48 for
  touch-first controls, with about 8 pixels between neighbors.
- Keep body text at 4.5:1 contrast or better.
- Never rely on hover, motion, or color alone to carry meaning.
- Keep DOM order the same as the intended visual and keyboard reading order.
- Show a visible keyboard focus indicator and a skip link to `<main>`.
- Use one meaningful `h1`, keep heading levels in order, and use native
  landmarks. Label repeated landmarks without repeating the landmark name.
- Give an informative image real alternative text and a decorative one `alt=""`.
  The content-design file owns the wording; keep essential information out of
  text embedded in images.

Support at least 200% text scaling. Scale font size and line height together,
and let a text-bearing control grow when its label needs more room. Reflow or
scroll the containing region instead of clipping instructions or state.

Use at least two indicators for an interaction state when meaning matters, such
as shape plus color, or border plus label. Support keyboard, screen-reader,
switch, pointer, and touch input without making one route depend on another.

Source snapshot: Material 3 accessibility, assistive-technology, designing, and
interaction-state guidance, captured with Firecrawl on 2026-08-07.
