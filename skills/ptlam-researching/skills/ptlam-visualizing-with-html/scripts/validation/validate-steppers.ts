import type { HtmlStepperInspection } from "./inspect-html-document.ts";
import { hasAttribute } from "./validation-helpers.ts";

const STEPPER_ACTIONS = ["next", "back", "play", "reset"] as const;

export function validateSteppers(
  steppers: readonly HtmlStepperInspection[],
  errors: string[],
): void {
  for (const stepper of steppers) {
    for (const action of STEPPER_ACTIONS) {
      if (!hasAttribute(stepper.elements, "button", "data-action", action)) {
        errors.push(`stepper "${stepper.name}" missing ${action} button`);
      }
    }

    if (!hasAttribute(stepper.elements, undefined, "data-step-caption")) {
      errors.push(`stepper "${stepper.name}" missing synchronized caption`);
    }
    if (!hasAttribute(stepper.elements, undefined, "data-step-count")) {
      errors.push(`stepper "${stepper.name}" missing step counter`);
    }

    const noScript = stepper.elements.some(
      ({ tagName }) => tagName === "noscript",
    );
    if (noScript) validateNoScriptSummary(stepper, errors);
    else {
      errors.push(
        `stepper "${stepper.name}" missing no-JavaScript step summary`,
      );
    }

    const playButton = stepper.elements.find(
      ({ tagName, attributes }) =>
        tagName === "button" && attributes["data-action"] === "play",
    );
    if (!playButton || !("aria-pressed" in playButton.attributes)) {
      errors.push(
        `stepper "${stepper.name}" play/pause button needs aria-pressed`,
      );
    }
  }
}

function validateNoScriptSummary(
  stepper: HtmlStepperInspection,
  errors: string[],
): void {
  const summaryText = stepper.noScriptText.trim();
  const arrowSteps = summaryText.includes("→")
    ? summaryText.split("→").length
    : 0;
  const coveredSteps = Math.max(stepper.noScriptItemCount, arrowSteps);

  if (summaryText.split(/\s+/).filter(Boolean).length < 5 || coveredSteps < 2) {
    errors.push(
      `stepper "${stepper.name}" has an empty no-JavaScript step summary`,
    );
  }

  const countMatch = stepper.stepCountText.match(/\b\d+\s*\/\s*(\d+)\b/);
  if (!countMatch?.[1]) {
    errors.push(
      `stepper "${stepper.name}" step counter must show current / total`,
    );
  } else if (coveredSteps < Number.parseInt(countMatch[1], 10)) {
    errors.push(
      `stepper "${stepper.name}" no-JavaScript summary covers ` +
        `${coveredSteps}/${countMatch[1]} steps`,
    );
  }
}
