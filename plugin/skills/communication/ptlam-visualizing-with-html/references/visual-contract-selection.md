# Visual contract selection

This file routes each relationship, composition, control, and component concern
to the contract that owns it. Each linked file owns its detailed anatomy,
states, accessibility, and Material 3 Expressive application.

Choose the smallest visual grammar that shows the important relationship. Use
one grammar per relationship. Load a contract only when the page's real content
or controls need it, and give every loaded contract a concrete use.

## Select the visual grammar

| Relationship to show                            | Contract                                                                  |
| ----------------------------------------------- | ------------------------------------------------------------------------- |
| Work order, branching, loops, or responsibility | [Flowchart](design-system/components/diagrams/flowchart.md)               |
| Allowed states and transitions                  | [State diagram](design-system/components/diagrams/state-diagram.md)       |
| Participants, messages, and timing              | [Sequence diagram](design-system/components/diagrams/sequence-diagram.md) |
| Stored data, keys, ownership, and cardinality   | [Entity-relationship diagram](design-system/components/diagrams/erd.md)   |
| Several architecture abstraction levels         | [C4 semantic zoom](design-system/components/diagrams/c4-diagram.md)       |

## Select a learning composition

| Learning need                                                      | Contract                                                                                 |
| ------------------------------------------------------------------ | ---------------------------------------------------------------------------------------- |
| Watch values change                                                | [State panel](design-system/patterns/state-panel/state-panel.md)                         |
| Replay or inspect a timeline step by step                          | [Control plane](design-system/patterns/control-plane/control-plane.md)                   |
| Synchronize a flow with observable state, with or without playback | [Flowchart with state](design-system/patterns/interactive-flows/flowchart-with-state.md) |
| Repeated section anatomy                                           | [Section layout](design-system/patterns/layouts/section-layout.md)                       |
| Visible long-page navigation                                       | [Field-guide navigation](design-system/patterns/navigation/field-guide-navigation.md)    |
| One caveat that changes how a section is read                      | [Callout](design-system/patterns/content/callout.md)                                     |

## Select control and component contracts

| Concern                                            | Contract                                                                                     |
| -------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| Primary and secondary actions                      | [Buttons](design-system/components/buttons/buttons.md)                                       |
| Grouped actions or connected selection             | [Button groups](design-system/components/buttons/button-groups/button-groups.md)             |
| An existing segmented control                      | [Segmented buttons](design-system/components/buttons/segmented-buttons/segmented-buttons.md) |
| A familiar action with no visible label            | [Icon buttons](design-system/components/buttons/icon-buttons/icon-buttons.md)                |
| Independent choices or multi-selection             | [Checkbox](design-system/components/checkbox/checkbox.md)                                    |
| Compact filters, selections, or contextual actions | [Chips](design-system/components/chips/chips.md)                                             |
| Exactly one visible choice                         | [Radio button](design-system/components/radio-button/radio-button.md)                        |
| Approximate numeric input                          | [Sliders](design-system/components/sliders/sliders.md)                                       |
| An on/off setting applied at once                  | [Switch](design-system/components/switch/switch.md)                                          |
| Labeled text input                                 | [Text fields](design-system/components/text-fields/text-fields.md)                           |
| An attached count or status                        | [Badges](design-system/components/badges/badges.md)                                          |
| One subject with related content and actions       | [Cards](design-system/components/cards/cards.md)                                             |
| A boundary that spacing does not make clear        | [Divider](design-system/components/divider/divider.md)                                       |
| A continuous vertical index                        | [Lists](design-system/components/lists/lists.md)                                             |
| A short wait with unknown progress                 | [Loading indicator](design-system/components/loading-indicator/loading-indicator.md)         |
| Measurable progress                                | [Progress indicators](design-system/components/progress-indicators/progress-indicators.md)   |
| A brief non-blocking update                        | [Snackbar](design-system/components/snackbar/snackbar.md)                                    |
| A supplemental label for a familiar control        | [Tooltips](design-system/components/tooltips/tooltips.md)                                    |

Icons use the [icons contract](design-system/styles/icons/icons.md). Semantic
token roles and their customization live in the
[design system](design-system/design-system.md).

Selection is complete when each material relationship, composition, control, and
component concern has one owner and every loaded contract is used.
