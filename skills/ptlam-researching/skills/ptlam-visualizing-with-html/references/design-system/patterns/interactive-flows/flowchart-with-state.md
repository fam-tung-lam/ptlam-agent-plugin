# Flowchart with state

Use this composition when each flow transition changes observable state. Put the
full [flowchart](../../components/diagrams/flowchart.md) contract on the left
and the [state panel](../state-panel/state-panel.md) on the right. On narrow
screens, keep flow first and state second.

This is the default replayable composition. When the learner should drive the
timeline, add one [control plane](../control-plane/control-plane.md) below both
panels and change the outer `data-flow-state` attribute to `data-stepper`.

```html
<div class="visual-stage" data-flow-state="request-flow">
  <div class="stage-grid">
    <div class="diagram-panel">
      <p class="eyebrow">Flow</p>
      <svg
        class="flowchart"
        viewBox="0 0 560 520"
        role="img"
        aria-labelledby="request-flow-title"
      >
        <title id="request-flow-title">Request flow</title>
        <!-- Use the node and edge contract from flowchart.md. -->
      </svg>
    </div>
    <aside class="state-panel" aria-labelledby="request-state-title">
      <h3 id="request-state-title">Current state</h3>
      <dl class="state-grid">
        <div>
          <dt>phase</dt>
          <dd data-state="phase">received</dd>
        </div>
        <div>
          <dt>attempt</dt>
          <dd data-state="attempt">0</dd>
        </div>
      </dl>
      <div class="frame" data-frame aria-live="polite">
        The request has entered the system.
      </div>
    </aside>
  </div>
</div>
```

Represent each step once:

```js
const steps = [
  {
    node: "receive",
    edge: null,
    state: { phase: "received", attempt: "0" },
    frame: "The request has entered the system.",
  },
  {
    node: "prepare",
    edge: "receive-prepare",
    state: { phase: "preparing", attempt: "0" },
    frame: "Rules and history form the working context.",
  },
];
```

While rendering, update all matching `data-node`, `data-edge`, and `data-state`
elements from the same step object. Add `.is-changed` only where the value
differs from the previous step.

Rules for the composed version:

- The flowchart and state panel keep the shared step identities defined here.
  The control plane owns the timeline controls, caption, counter, playback, and
  controller code.
- Never put independent controls inside either panel.
- Keep the DOM and narrow-screen order as flowchart, state panel, then controls.
- Add the synchronized step model and the scripts-disabled fallback that
  [state-model.md](../../../state-model.md) requires before renaming the
  attribute.

The composition is complete when one step change updates the flow, the state,
the caption, and the counter together, and the fallback still explains every
step without JavaScript.
