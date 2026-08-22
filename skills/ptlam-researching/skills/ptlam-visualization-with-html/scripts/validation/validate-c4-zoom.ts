import type { HtmlDocumentInspection } from "./inspect-html-document.ts";
import { hasAttribute } from "./validation-helpers.ts";

export function validateC4Zoom(
  document: HtmlDocumentInspection,
  errors: string[],
): void {
  if (!hasAttribute(document.elements, undefined, "data-c4")) return;

  const levels = new Set(
    document.elements
      .map(({ attributes }) => attributes["data-c4-level"])
      .filter((level): level is string => Boolean(level)),
  );
  if (levels.size < 2) {
    errors.push("C4 semantic zoom needs at least two distinct maps");
  }
  if (!hasAttribute(document.elements, "button", "data-c4-back")) {
    errors.push("C4 semantic zoom needs an explicit Zoom out control");
  }
}
