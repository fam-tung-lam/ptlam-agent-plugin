# HTML visualization design system

Use one Material 3 Expressive system for every artifact. Apply color, type,
shape, size, motion, and containment with task-appropriate intensity while
preserving Material roles, anatomy, states, accessibility, and hierarchy.

## Ownership

| Surface              | Owns                                                        |
| -------------------- | ----------------------------------------------------------- |
| Scaffold renderer    | Exact baseline token values, document shell, and global CSS |
| Token references     | Semantic use and customization                              |
| Component references | Reusable anatomy and states                                 |
| Pattern references   | Learning-specific compositions                              |

Run the scaffolder for a new artifact; do not reconstruct its baseline from
prose.

Do not name a base component after one artifact's workflow. Put a reusable UI
primitive under `components/`; put a goal-specific assembly under `patterns/`.

Material is adaptable rather than a requirement to imitate one Google product.
Express the subject's visual identity within the owned roles above.

Do not create classic, standard, and expressive versions. Reduced-motion,
high-contrast, narrow-screen, and no-JavaScript behavior are accessibility and
capability adaptations of the same expressive system, not alternate themes.

The governing expressive dimensions are color, shape, size, motion, and
containment. Use them to make key actions faster to find and related elements
easier to group while preserving familiar interaction patterns and visible text
labels.

Apply those dimensions selectively:

- use color contrast and scale to establish one clear priority;
- group related information with containment, spacing, and headings;
- use shape changes to communicate state or direct attention;
- reserve pronounced motion and other hero moments for brief, important
  interactions; and
- adapt component size and layout to context without changing its meaning.

Limit each page or stage to one primary task. Test whether its emphasis helps a
learner find, understand, and complete that task; familiar component anatomy and
predictable interaction behavior remain fixed while expressive intensity
changes.

The Material catalog groups components by action, containment, communication,
navigation, selection, and text input. This skill intentionally selects only the
families needed for focused learning artifacts. A component missing from this
local catalog is outside the contract, even when Material documents it.

## Source freshness

| Source family                       | Authoritative source                                                                                            |
| ----------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| Material system and current catalog | [Material Design 3](https://m3.material.io/)                                                                    |
| Interaction states                  | [Material 3 states](https://m3.material.io/foundations/interaction/states/overview)                             |
| Expressive research                 | [Google's expressive-design research](https://design.google/library/expressive-material-design-google-research) |

This local contract was reviewed on 2026-08-07 from Firecrawl snapshots of the
official Material 3 home, foundations, styles, and components catalogs plus
Google's Expressive design research. The research describes color, shape, size,
motion, and containment as the main expressive dimensions. Its evidence spans 46
studies with more than 18,000 participants and warns against breaking
established interaction patterns.

This file and its local references are the operational source for artifact
creation; agents do not need to open the web pages. A maintainer changing or
upgrading the design system must re-scrape the affected official page and its
linked component, foundation, or style page. Treat a new page update date,
component availability, anatomy, state, token, or accessibility rule as a review
trigger. Record a new local review date only after resolving differences.
