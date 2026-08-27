# UI Prototype

This file covers the UI branch: several structurally different variants on one
route, chosen through `?variant=` and a floating bottom switcher, so an
evaluator can compare them inside the real application.

## Choose the host route

| Target                                                | Placement                                                                                |
| ----------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| An existing page, or a feature that belongs inside it | Mount the variants there; keep its params, auth, shell, density, and approved data reads |
| A really new top-level surface or flow                | Add a named prototype route using the existing routing convention                        |
| A new project with no application shell               | Create the smallest one-route project in the requested stack, or plain web files         |

Prefer the existing-page placement. A blank route hides hierarchy, density, and
navigation problems the surrounding application would expose. Apply the shared
data rules before keeping existing reads. Stub writes; the question is visual.

## Build structural variants

1. Put one plan line beside the route or at the top of the file: the number of
   variants, the target surface, the route, and the `?variant=` switch.
2. Create three variants by default and never more than five. Give each a clear
   component name and a short label for the evaluator.
3. Make the variants disagree about layout, information hierarchy, and the
   primary action. Redo a variant that differs only in color, copy, or
   decoration.
4. Use the project's component library, styling, representative content, and
   realistic density. Share neutral primitives and data access; let each variant
   own its layout.

Done when the variants give really different answers to the same UI question
without changing the data contract.

## Wire one shareable switcher

Read `variant` from the URL and default to `A`. Render only the selected
variant; keep existing data fetching above the switch.

Add one fixed bottom-center switcher with a previous arrow that wraps, the
current key and label, a next arrow that wraps, and a visually separate summary
of the relevant route, data, or interaction state.

Each change updates `?variant=` through the project router so the URL survives a
reload and can be shared. Left and right arrow keys also cycle, except while an
input, textarea, or editable element has focus.

Make the switcher visibly prototype-only and gate it out of production builds as
a second defense. Keep it beside the variants, not in a shared UI library.

Done when every variant has a stable URL, pointer and keyboard controls agree,
and prototype state stays visible without distorting a variant.

## Run and hand over

Start the project with one existing task-runner command, or one documented
local-serve command when no runner exists. Open every variant in the target
viewport and shell. Check direct URLs, reloads, wraparound, keyboard guards,
representative data, and the production gate.

Give the evaluator the command, base URL, variant keys, and the question. Wait
for the chosen variant or the parts they want to combine. Return that answer and
its reason to the shared capture step; the losing variants and the switcher stay
prototype evidence only.
