# Portable artifact contract

Apply this contract to every HTML explainer created or revised by the skill. The
delivered file must remain useful when opened directly and when JavaScript,
motion, or a wide viewport is unavailable.

## File and document boundary

- Produce one `.html` file with embedded CSS and JavaScript.
- Import no runtime dependency and reference no sibling or remote runtime asset.
- Include a descriptive `title`, correct `lang`, viewport metadata, one `main`,
  and one clear `h1`.
- Include a visible-on-focus skip link to `main`.
- Write concise literal labels and place qualifications beside the visual they
  constrain.

## Visual and accessibility boundary

- Use native controls, visible focus, accessible names, and `aria-live` for
  changing captions or state.
- Scale SVGs through `viewBox`; give each SVG a concise accessible name.
- Show direction with arrowheads and labels.
- Encode active or completed state with color plus outline, weight, shape,
  pattern, or text.
- Preserve DOM order as the reading and narrow-screen order.
- Reflow content at 320 px and 200% text zoom. Do not hide document overflow to
  mask a layout defect.
- Honor `prefers-reduced-motion`; motion never carries the only meaning.

## Interaction and fallback boundary

- Never auto-play.
- Keep one state owner for every synchronized visual and textual value.
- Make Back restore the exact prior state, Reset restore the first state, and a
  completed Play sequence replayable.
- Keep a meaningful default state in the HTML.
- When JavaScript changes a sequence, include a complete ordered no-JavaScript
  explanation of every step and observable state.
- Add quizzes, checks, or scoring only when the user requests them.

## Verification boundary

The bundled validator proves only its static rules. Browser inspection owns
rendered layout, reflow, focus order, control behavior, reduced motion, and
scripts-disabled behavior. Report these evidence types separately.

The artifact satisfies this contract only when it remains complete,
understandable, and operable within every boundary above.
