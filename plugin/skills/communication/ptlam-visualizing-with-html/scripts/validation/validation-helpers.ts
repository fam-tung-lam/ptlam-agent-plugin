import type { HtmlElementInspection } from "./inspect-html-document.ts";

export function hasAttribute(
  elements: readonly HtmlElementInspection[],
  tagName: string | undefined,
  attribute: string,
  value?: string,
): boolean {
  return elements.some(
    (element) =>
      (tagName === undefined || element.tagName === tagName) &&
      attribute in element.attributes &&
      (value === undefined || element.attributes[attribute] === value),
  );
}

export function findAttribute(
  elements: readonly HtmlElementInspection[],
  tagName: string,
  attribute: string,
): string | undefined {
  return elements.find((element) => element.tagName === tagName)?.attributes[
    attribute
  ];
}
