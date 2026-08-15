# Visual contract selection

Use this routing reference after the literal learning model is stable. Each
linked reference owns the detailed anatomy, states, accessibility, and Material
3 Expressive application for that concern.

Choose the smallest visual grammar that exposes the important relationship. Use
one visual grammar per relationship. Load a contract only when the artifact's
actual content or controls select it, and give every loaded contract a concrete
consumer.

## Select the visual grammar

| Relationship to expose | Contract |
| --- | --- |
| Work order, branching, loops, or responsibility | [Flowchart](design-system/components/diagrams/flowchart.md) |
| Allowed states and transitions | [State diagram](design-system/components/diagrams/state-diagram.md) |
| Participants, messages, and timing | [Sequence diagram](design-system/components/diagrams/sequence-diagram.md) |
| Durable data, keys, ownership, and cardinality | [Entity-relationship diagram](design-system/components/diagrams/erd.md) |
| Several meaningful architecture abstraction levels | [C4 semantic zoom](design-system/components/diagrams/c4-diagram.md) |

## Select a learning composition

| Learning need | Contract |
| --- | --- |
| Observe values changing | [State panel](design-system/patterns/state-panel/state-panel.md) |
| Replay or inspect a timeline step by step | [Control plane](design-system/patterns/control-plane/control-plane.md) |
| Synchronize a flow with state but no playback | [Flowchart with state](design-system/patterns/interactive-flows/flowchart-with-state.md) |
| Default replayable flow with state and shared controls | [Flowchart with state and control plane](design-system/patterns/interactive-flows/flowchart-with-state-and-control-plane.md) |
| Repeated section anatomy | [Section layout](design-system/patterns/layouts/section-layout.md) |
| Visible long-page navigation | [Field-guide navigation](design-system/patterns/navigation/field-guide-navigation.md) |
| One interpretation-changing boundary or caveat | [Callout](design-system/patterns/content/callout.md) |

## Select control and component contracts

| Concern | Contract |
| --- | --- |
| Primary and secondary actions | [Buttons](design-system/components/buttons/buttons.md) |
| Grouped actions or connected selection | [Button groups](design-system/components/buttons/button-groups/button-groups.md) |
| Existing segmented control | [Segmented buttons](design-system/components/buttons/segmented-buttons/segmented-buttons.md) |
| Familiar action without a visible label | [Icon buttons](design-system/components/buttons/icon-buttons/icon-buttons.md) |
| Independent choices or multi-selection | [Checkbox](design-system/components/checkbox/checkbox.md) |
| Compact filters, selections, or contextual actions | [Chips](design-system/components/chips/chips.md) |
| Exactly one visible choice | [Radio button](design-system/components/radio-button/radio-button.md) |
| Approximate numeric input | [Sliders](design-system/components/sliders/sliders.md) |
| Immediately applied on/off setting | [Switch](design-system/components/switch/switch.md) |
| Labeled text input | [Text fields](design-system/components/text-fields/text-fields.md) |
| Attached count or status | [Badges](design-system/components/badges/badges.md) |
| One subject with related content and actions | [Cards](design-system/components/cards/cards.md) |
| Thematic boundary not clear from spacing | [Divider](design-system/components/divider/divider.md) |
| Continuous vertical index | [Lists](design-system/components/lists/lists.md) |
| Short wait with unknown progress | [Loading indicator](design-system/components/loading-indicator/loading-indicator.md) |
| Measurable progress | [Progress indicators](design-system/components/progress-indicators/progress-indicators.md) |
| Brief non-blocking process update | [Snackbar](design-system/components/snackbar/snackbar.md) |
| Supplemental label for a familiar control | [Tooltips](design-system/components/tooltips/tooltips.md) |

## Select style and adaptation contracts

Read [icons](design-system/styles/icons/icons.md) whenever icons appear. Read
only the semantic token contract being customized:
[color](design-system/tokens/color.md),
[typography](design-system/tokens/typography.md),
[spacing](design-system/tokens/spacing.md),
[shape](design-system/tokens/shape.md),
[elevation](design-system/tokens/elevation.md),
[motion](design-system/tokens/motion.md), or
[state](design-system/tokens/state.md).

Load an additional foundation only when it materially changes the artifact:
[building for all](design-system/foundations/building-for-all.md),
[content design](design-system/foundations/content-design.md),
[customization](design-system/foundations/customization.md),
[design tokens](design-system/foundations/design-tokens.md),
[designing](design-system/foundations/designing.md),
[writing](design-system/foundations/writing.md), or
[platform adaptation](design-system/foundations/platform-adaptation.md).

Selection is complete when each material relationship, composition, control,
component, and customization concern has one owner and every loaded contract is
used.
