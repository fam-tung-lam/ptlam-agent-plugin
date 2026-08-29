import type { HtmlStepperInspection } from "./html-document-inspection.ts";
import {
  collectElements,
  type HtmlElementNode,
  type HtmlParentNode,
  textContent,
  toElementInspection,
} from "./html-tree.ts";

export function inspectSteppers(
  elements: readonly HtmlElementNode[],
): HtmlStepperInspection[] {
  return elements
    .filter((element) => "data-stepper" in element.attributes)
    .map((stepper, index) => {
      const descendants = collectStepperOwnedElements(stepper);
      const noScript = descendants.find(
        (element) => element.tagName === "noscript",
      );
      const count = descendants.find(
        (element) => "data-step-count" in element.attributes,
      );

      return Object.freeze({
        name: stepper.attributes["data-stepper"]?.trim() || `#${index + 1}`,
        elements: Object.freeze(descendants.map(toElementInspection)),
        noScriptText: noScript ? textContent(noScript) : "",
        noScriptItemCount: noScript
          ? collectElements(noScript).filter(
              (element) => element.tagName === "li",
            ).length
          : 0,
        stepCountText: count ? textContent(count) : "",
      });
    });
}

function collectStepperOwnedElements(
  parent: HtmlParentNode,
): HtmlElementNode[] {
  const elements: HtmlElementNode[] = [];
  for (const child of parent.children) {
    if (child.kind === "text") continue;
    if ("data-stepper" in child.attributes) continue;
    elements.push(child, ...collectStepperOwnedElements(child));
  }
  return elements;
}
