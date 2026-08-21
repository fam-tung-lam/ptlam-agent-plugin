# UI Prototype

This reference owns the UI branch: several structurally different variants on
one route, selected through `?variant=` and a floating bottom switcher so an
evaluator can compare them in the real application context.

## Choose the host route

| Target                                               | Placement                                                                                  |
| ---------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| An existing page or a feature that belongs inside it | Mount variants there; keep its params, auth, shell, density, and only approved data reads. |
| A genuinely new top-level surface or flow            | Add a named prototype route using the existing routing convention.                         |
| A new project with no application shell              | Create the smallest one-route project in the requested stack, or plain web files if none.  |

Prefer the existing-page placement. A blank route hides hierarchy, density, and
navigation problems that the surrounding application would expose. Apply the
shared data conditions before retaining existing reads. Stub mutations because
the question is visual.

## Generate structural variants

1. Put one plan line beside the route or in a top-of-file comment. Name the
   number of variants, target surface, route, and `?variant=` switch.
2. Create three variants by default and never more than five. Give each a clear
   component name and a short evaluator-facing label.
3. Make variants disagree about layout, information hierarchy, and the primary
   affordance. Redo a variant that differs only in color, copy, or decoration.
4. Use the project's component library, styling system, representative content,
   and realistic density. Share neutral primitives and data access, but let each
   variant own its layout.

Complete this step when the variants express genuinely different answers to the
same UI question without changing the underlying data contract.

## Wire one shareable switcher

Read `variant` from the URL search parameters and default to `A`. Render only
the selected variant while leaving existing data fetching above the switch.

Add one fixed bottom-center switcher with:

- a previous arrow that wraps;
- the current key and evaluator-facing label;
- a next arrow that wraps; and
- a visually separate summary of the relevant route, data, or interaction state.

Each change updates `?variant=` through the project router so the URL survives a
reload and can be shared. Left and right arrow keys also cycle. Ignore those
keys while an input, textarea, or editable element has focus.

Make the switcher visibly prototype-only and gate it out of production builds as
a second defense. Keep the switcher beside the variants rather than promoting it
into a durable shared UI library.

Complete this step when every variant has a stable URL, pointer and keyboard
controls agree, and prototype state stays visible without distorting a variant.

## Run and hand over the comparison

Start the project with one existing task-runner command, or one documented local
serve command when no runner exists. Open every variant in the target viewport
and surrounding application shell. Verify direct URLs, reloads, wraparound,
keyboard guards, representative data, and the production gate.

Give the evaluator the command, base URL, variant keys, and design question.
Wait for the selected variant or the elements they want to combine. Return that
answer and its reason to the shared capture step; the losing variants and
switcher remain prototype primary source only.
