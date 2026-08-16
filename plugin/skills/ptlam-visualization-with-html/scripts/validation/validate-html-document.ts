import { inspectHtmlDocument } from "./inspect-html-document.ts";
import { validateC4Zoom } from "./validate-c4-zoom.ts";
import {
  validateReferences,
  validateSvgAccessibility,
} from "./validate-document-references.ts";
import {
  validateDocumentShell,
  validatePlaceholders,
  validateResponsiveCss,
} from "./validate-document-shell.ts";
import { validateEmbeddedJavaScript } from "./validate-embedded-javascript.ts";
import { validateSteppers } from "./validate-steppers.ts";

export interface HtmlValidationResult {
  readonly errors: readonly string[];
  readonly warnings: readonly string[];
}

export interface HtmlValidationOptions {
  readonly mode?: "deliverable" | "scaffold";
}

/** Validate one portable HTML visualization through its document contract. */
export function validateHtmlDocument(
  source: string,
  options: HtmlValidationOptions = {},
): HtmlValidationResult {
  const document = inspectHtmlDocument(source);
  const errors: string[] = [];

  validateDocumentShell(source, document, errors);
  if (options.mode !== "scaffold") validatePlaceholders(document, errors);
  validateReferences(document, errors);
  validateSvgAccessibility(document, errors);
  validateResponsiveCss(document, errors);
  validateSteppers(document.steppers, errors);
  validateC4Zoom(document, errors);
  errors.push(...validateEmbeddedJavaScript(document.scripts));

  return Object.freeze({
    errors: Object.freeze(errors),
    warnings: Object.freeze([]),
  });
}
