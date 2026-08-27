# HTML visualization design system

Use one Material 3 Expressive system for every page. Apply color, type, shape,
size, motion, and containment as strongly as the task needs, while keeping
Material's roles, anatomy, states, accessibility, and hierarchy.

## Ownership

| Surface              | Owns                                                        |
| -------------------- | ----------------------------------------------------------- |
| Scaffold renderer    | Exact baseline token values, document shell, and global CSS |
| This file            | Semantic token roles and how to customize them              |
| Component references | Reusable anatomy and states                                 |
| Pattern references   | Learning-specific compositions                              |

Run the scaffolder for a new page; do not rebuild its baseline from prose.

Do not name a base component after one page's workflow. Put a reusable UI
primitive under `components/`; put a goal-specific assembly under `patterns/`.

Material is adaptable, not a Google product to imitate. Express the subject's
visual identity inside the roles above.

Do not build classic, standard, and expressive versions. Reduced-motion,
high-contrast, narrow-screen, and no-JavaScript behavior are adaptations of the
same system, not alternate themes.

## Use the five expressive dimensions on purpose

The dimensions are color, shape, size, motion, and containment. Use them to make
key actions easier to find and related elements easier to group, while familiar
interaction patterns and visible text labels stay fixed:

- use color contrast and scale to establish one clear priority;
- group related information with containment, spacing, and headings;
- use shape changes to show state or direct attention;
- keep pronounced motion for brief, important moments; and
- adapt component size and layout to context without changing meaning.

Limit each page or stage to one main task, and test whether its emphasis helps a
learner find, understand, and finish that task.

The Material catalog groups components by action, containment, communication,
navigation, selection, and text input. This skill selects only the families
focused learning pages need. A component missing from this local catalog is
outside the contract, even when Material documents it.

## Consume semantic tokens, not raw values

The scaffold owns the exact values. Never hard-code a raw color, radius,
duration, or type size when a semantic token exists. Raw values feed semantic
system roles, and components consume those roles: keep the direction
`reference -> system -> component`.

| Token group | Rules                                                                                                                                                                                                                                                                                                                                                                     |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Color       | Surface roles own backgrounds; `on-*` roles own readable foregrounds; outline roles separate regions. Use `--color-primary` for the current step or main action, `--color-secondary` for relationships, `--color-error` only for failure. Keep body text at 4.5:1 contrast or better, and pair color with a label, outline, weight, or shape.                             |
| Typography  | Keep the display, headline, title, body, and label roles. Display for rare high-impact framing, headline for sections, title for contained regions, body for explanation, label for controls and compact metadata. Scale font size and line height together and check every role at 200% zoom.                                                                            |
| Spacing     | Use the shared scale to show grouping, hierarchy, and touch safety. Use the smallest step that keeps grouping and target size. Apply the same token to equivalent relationships, never to places that merely share a pixel value.                                                                                                                                         |
| Shape       | Small shapes for compact labels, medium for controls, large for panels and diagram stages, full for circular controls and pills. Use shape to clarify containment, not for decoration. Keep rest and active shapes related, and keep the active end shape under reduced motion.                                                                                           |
| Elevation   | Keep ordinary nested panels flat. Use the first elevation role for an interactive element that must rise, the second only for an overlay or focused stage. Elevation shows layering; shadow alone is never a focus indicator.                                                                                                                                             |
| Motion      | Motion identifies the active relationship; pair it with color, weight, shape, or a label. Use effect easing for color and opacity (no overshoot) and spatial easing for position, size, and shape. Fast timing for small controls, default for partial-page changes, slow for whole-page changes. Never auto-play. Under reduced motion, show the same end state at once. |
| State       | Apply hover, focus, pressed, dragged, and disabled layers consistently. Pair every state with a visible shape, outline, label, or position change. Never show selection or focus through opacity alone, and keep combined states distinguishable.                                                                                                                         |

Map a brand's key colors into the primary, secondary, tertiary, neutral, and
neutral-variant groups, then derive the `on-*` and container roles instead of
picking each color separately. Keep a complete fallback theme when dynamic color
is unavailable. Keep component anatomy, states, accessible names, and target
sizes stable while customizing the look.

## Build each page for everyone

Identify the learner groups, environments, assistive technologies, language
needs, and likely exclusion risks before choosing a visual treatment. Do not
treat one persona as all users, and keep a text route through every visual
lesson.

For a high-impact page, involve the people it could exclude early enough for
their feedback to change priority, behavior, and language. Ask which groups the
current model misses and what harm exclusion could cause.

Build each screen from elements, structure, and flow: make boundaries,
relationships, hierarchy, reading order, and transitions visible before tuning
the expressive intensity. Use semantic HTML order, landmarks, and one sequential
heading hierarchy before adding ARIA. Give a custom interactive element a native
equivalent where possible; otherwise give it a short role and label. Keep the
browser's default tab order, and return focus to the initiating control after
closing a temporary surface.

The portable HTML baseline covers pointer, keyboard, touch, and assistive
technology. Do not claim a platform-specific Material component is implemented
on the web merely because its look can be reproduced in HTML.

## Source attribution and freshness

| Source family                       | Attribution                                                                                                     |
| ----------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| Material system and current catalog | [Material Design 3](https://m3.material.io/)                                                                    |
| Interaction states                  | [Material 3 states](https://m3.material.io/foundations/interaction/states/overview)                             |
| Expressive research                 | [Google's expressive-design research](https://design.google/library/expressive-material-design-google-research) |

This contract was reviewed on 2026-08-07 from snapshots of the official Material
3 home, foundations, styles, and components catalogs plus Google's Expressive
design research. That research names color, shape, size, motion, and containment
as the main expressive dimensions, spans 46 studies with more than 18,000
participants, and warns against breaking established interaction patterns.

The links record attribution; they are not required reading. This file and its
local references are the source for building a page. New external research may
trigger a package update, but no conclusion becomes operational until its rules
and examples are captured here.
