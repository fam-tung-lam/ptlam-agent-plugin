# Control-plane pattern

The control plane drives one timeline. It sits below the diagram and the state
panel so it controls both. "Control plane" is the file's name; visible text may
simply say "Controls".

Build its actions from the [button family](../../components/buttons/buttons.md).
The `.button-row` layout below belongs to the control plane, not to any button
variant.

```html
<section class="control-plane" data-control-plane data-stepper="request-flow">
  <div class="step-readout">
    <span class="eyebrow">Current frame</span>
    <output data-step-count>1 / 6</output>
  </div>
  <p class="step-caption" data-step-caption aria-live="polite">
    The request enters the system.
  </p>
  <div class="button-row" role="group" aria-label="Timeline controls">
    <button class="button button--outlined" type="button" data-action="back">
      Back
    </button>
    <button
      class="button button--filled"
      type="button"
      data-action="play"
      aria-pressed="false"
    >
      Play
    </button>
    <button class="button button--outlined" type="button" data-action="next">
      Next
    </button>
    <button class="button button--text" type="button" data-action="reset">
      Reset
    </button>
  </div>
  <noscript>
    <ol>
      <li>The request enters the system.</li>
      <li>Replace this item with every remaining ordered step.</li>
    </ol>
  </noscript>
</section>
```

```css
.control-plane {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: var(--space-3);
  min-width: 0;
  padding: 1rem;
  border-top: 1px solid var(--color-outline);
  background: var(--color-surface-container-low);
}
.step-readout {
  display: grid;
  gap: 0.2rem;
}
.step-readout output {
  font-family: ui-monospace, monospace;
}
.step-caption {
  margin: 0;
  max-width: none;
  color: var(--color-on-surface-variant);
  overflow-wrap: anywhere;
}
.button-row {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  min-width: 0;
}
@media (max-width: 760px) {
  .control-plane {
    grid-template-columns: minmax(0, 1fr);
    align-items: start;
  }
}
```

```js
const stepper = document.querySelector('[data-stepper="request-flow"]');
const backButton = stepper.querySelector('[data-action="back"]');
const nextButton = stepper.querySelector('[data-action="next"]');
const playButton = stepper.querySelector('[data-action="play"]');
const resetButton = stepper.querySelector('[data-action="reset"]');
const caption = stepper.querySelector("[data-step-caption]");
const counter = stepper.querySelector("[data-step-count]");

function setStep(nextIndex) {
  index = Math.max(0, Math.min(steps.length - 1, nextIndex));
  render(index); // nodes, edges, state, caption, counter, disabled buttons
}

nextButton.addEventListener("click", () => setStep(index + 1));
backButton.addEventListener("click", () => setStep(index - 1));
resetButton.addEventListener("click", () => {
  stop();
  setStep(0);
});
playButton.addEventListener("click", () => (running ? stop() : play()));
```

Rules:

- Use one interval per control plane. Stop it on Reset, at the final step, and
  when the document becomes hidden. Never start it automatically.
- Make the step definitions the only source of visual and text state.
- Replace the example's two-item `<noscript>` list with every step, and keep the
  counter in `current / total` form.
- `render` updates the caption, the counter, the disabled states, and
  `aria-pressed`; `stop` restores the Play label and pressed state.
