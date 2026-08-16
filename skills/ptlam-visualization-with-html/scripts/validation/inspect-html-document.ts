import type {
  HtmlDocumentInspection,
  HtmlSvgInspection,
} from "./html-document-inspection.ts";
import {
  collectElements,
  textContent,
  toElementInspection,
} from "./html-tree.ts";
import { inspectRuntimeAssets } from "./inspect-runtime-assets.ts";
import { inspectSteppers } from "./inspect-steppers.ts";
import { inspectSvg, joinElementText } from "./inspect-svg.ts";
import { parseHtml } from "./parse-html.ts";

export type {
  HtmlDocumentInspection,
  HtmlElementInspection,
  HtmlScriptInspection,
  HtmlStepperInspection,
  HtmlSvgInspection,
} from "./html-document-inspection.ts";

/** Inspect the HTML structures used by visualization policy checks. */
export function inspectHtmlDocument(source: string): HtmlDocumentInspection {
  const elementNodes = collectElements(parseHtml(source));
  const elements = elementNodes.map(toElementInspection);
  const tags: Record<string, number> = {};
  const ids: string[] = [];
  const hrefs: string[] = [];
  const idText: Record<string, string> = {};
  const runtimeAssets: string[] = [];
  const svg: HtmlSvgInspection[] = [];

  for (const element of elementNodes) {
    tags[element.tagName] = (tags[element.tagName] ?? 0) + 1;
    const elementId = element.attributes["id"]?.trim();
    if (elementId) {
      ids.push(elementId);
      idText[elementId] = textContent(element);
    }
    const href = element.attributes["href"];
    if (href) hrefs.push(href);
    runtimeAssets.push(...inspectRuntimeAssets(element));
    if (element.tagName === "svg") svg.push(inspectSvg(element));
  }

  const head = elementNodes.find((element) => element.tagName === "head");
  const title = head
    ? collectElements(head).find((element) => element.tagName === "title")
    : undefined;

  return Object.freeze({
    tags: Object.freeze(tags),
    elements: Object.freeze(elements),
    ids: Object.freeze(ids),
    hrefs: Object.freeze(hrefs),
    idText: Object.freeze(idText),
    runtimeAssets: Object.freeze(runtimeAssets),
    steppers: Object.freeze(inspectSteppers(elementNodes)),
    svg: Object.freeze(svg),
    documentTitleText: title ? textContent(title) : "",
    h1Text: joinElementText(elementNodes, "h1"),
    scripts: Object.freeze(
      elementNodes
        .filter((element) => element.tagName === "script")
        .map((element) =>
          Object.freeze({
            source: textContent(element),
            type: element.attributes["type"]?.trim().toLowerCase() ?? "",
          }),
        ),
    ),
    styles: Object.freeze(
      elementNodes
        .filter((element) => element.tagName === "style")
        .map(textContent),
    ),
  });
}
