import type { HtmlSvgInspection } from "./html-document-inspection.ts";
import {
  collectElements,
  type HtmlElementNode,
  textContent,
} from "./html-tree.ts";

export function inspectSvg(element: HtmlElementNode): HtmlSvgInspection {
  const descendants = collectElements(element);
  const localIds = (tagName: "desc" | "title") =>
    descendants
      .filter((child) => child.tagName === tagName)
      .map((child) => child.attributes["id"]?.trim() ?? "")
      .filter(Boolean);

  return Object.freeze({
    role: element.attributes["role"]?.trim() ?? "",
    labelledBy: Object.freeze(
      (element.attributes["aria-labelledby"] ?? "")
        .split(/\s+/)
        .filter(Boolean),
    ),
    localDescriptionIds: Object.freeze(localIds("desc")),
    localTitleIds: Object.freeze(localIds("title")),
  });
}

export function joinElementText(
  elements: readonly HtmlElementNode[],
  tagName: string,
): string {
  return elements
    .filter((element) => element.tagName === tagName)
    .map(textContent)
    .join(" ");
}
