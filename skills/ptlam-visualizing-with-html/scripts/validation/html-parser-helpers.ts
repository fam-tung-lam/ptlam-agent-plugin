import { decodeHtmlEntities } from "./html-entities.ts";
import type { HtmlParentNode } from "./html-tree.ts";

export function findTagEnd(source: string, start: number): number {
  let quote: '"' | "'" | undefined;
  for (let index = start; index < source.length; index += 1) {
    const character = source[index];
    if ((character === '"' || character === "'") && quote === undefined) {
      quote = character;
    } else if (character === quote) quote = undefined;
    else if (character === ">" && quote === undefined) return index;
  }
  return -1;
}

export function parseAttributes(source: string): Record<string, string> {
  const attributes: Record<string, string> = {};
  const pattern =
    /([^\s"'<>/=]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;

  for (const match of source.matchAll(pattern)) {
    const name = match[1]?.toLowerCase();
    if (!name || name === "/") continue;
    attributes[name] = decodeHtmlEntities(
      match[2] ?? match[3] ?? match[4] ?? "",
    );
  }
  return attributes;
}

export function findRawTextClosingTag(
  source: string,
  start: number,
  tagName: string,
): { readonly start: number; readonly end: number } | undefined {
  const pattern = new RegExp(`</${tagName}\\s*>`, "gi");
  pattern.lastIndex = start;
  const match = pattern.exec(source);
  return match
    ? { start: match.index, end: match.index + match[0].length }
    : undefined;
}

export function closeElement(parents: HtmlParentNode[], tagName: string): void {
  for (let index = parents.length - 1; index > 0; index -= 1) {
    const parent = parents[index];
    if (parent && "tagName" in parent && parent.tagName === tagName) {
      parents.length = index;
      return;
    }
  }
}

export function currentParent(
  parents: readonly HtmlParentNode[],
): HtmlParentNode {
  const parent = parents.at(-1);
  if (!parent) throw new Error("HTML parser lost its root node");
  return parent;
}

export function appendText(
  parent: HtmlParentNode,
  value: string,
  decode = true,
): void {
  if (!value) return;
  parent.children.push({
    kind: "text",
    value: decode ? decodeHtmlEntities(value) : value,
  });
}
