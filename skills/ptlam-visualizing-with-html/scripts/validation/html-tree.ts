export interface HtmlRootNode {
  readonly children: HtmlNode[];
}

export interface HtmlElementNode {
  readonly kind: "element";
  readonly tagName: string;
  readonly attributes: Readonly<Record<string, string>>;
  readonly children: HtmlNode[];
}

export interface HtmlTextNode {
  readonly kind: "text";
  readonly value: string;
}

export type HtmlParentNode = HtmlRootNode | HtmlElementNode;
export type HtmlNode = HtmlElementNode | HtmlTextNode;

export interface HtmlElementInspection {
  readonly tagName: string;
  readonly attributes: Readonly<Record<string, string>>;
}

export function collectElements(parent: HtmlParentNode): HtmlElementNode[] {
  const elements: HtmlElementNode[] = [];
  for (const child of parent.children) {
    if (child.kind === "text") continue;
    elements.push(child, ...collectElements(child));
  }
  return elements;
}

export function textContent(parent: HtmlParentNode): string {
  return parent.children
    .map((child) => (child.kind === "text" ? child.value : textContent(child)))
    .join("");
}

export function toElementInspection(
  element: HtmlElementNode,
): HtmlElementInspection {
  return Object.freeze({
    tagName: element.tagName,
    attributes: element.attributes,
  });
}
