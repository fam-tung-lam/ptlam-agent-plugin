# Flowchart with State and Control Plane

Use this as the default replayable flow composition. Start with the complete
[flowchart-with-state pattern](flowchart-with-state.md), then place one
[control plane](../control-plane/control-plane.md) below both panels.

The flowchart and state panel keep the shared step identities owned by the
partial. The control plane is the only owner of timeline controls, captions,
counters, playback, and controller mechanics.

Replace the partial's `data-flow-state` attribute with `data-stepper` only after
the composition includes the complete control plane and the synchronized step
model required by [state-model.md](../../../state-model.md).

Keep the DOM and narrow-screen order as flowchart, state panel, then controls.
Do not add independent controls inside either panel. The composition is complete
when one step change updates the flow, state, caption, and counter together and
the state-model fallback remains available without JavaScript.
