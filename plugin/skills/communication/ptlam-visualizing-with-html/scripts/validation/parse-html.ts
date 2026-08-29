import { RAW_TEXT_ELEMENTS, VOID_ELEMENTS } from "./html-element-kinds.ts";
import {
  appendText,
  closeElement,
  currentParent,
  findRawTextClosingTag,
  findTagEnd,
  parseAttributes,
} from "./html-parser-helpers.ts";
import type {
  HtmlElementNode,
  HtmlParentNode,
  HtmlRootNode,
} from "./html-tree.ts";

/** Parse the HTML subset needed by the portable-artifact validator. */
export function parseHtml(source: string): HtmlRootNode {
  const root: HtmlRootNode = { children: [] };
  const parents: HtmlParentNode[] = [root];
  let cursor = 0;

  while (cursor < source.length) {
    if (source[cursor] !== "<") {
      const nextTag = source.indexOf("<", cursor);
      const end = nextTag === -1 ? source.length : nextTag;
      appendText(currentParent(parents), source.slice(cursor, end));
      cursor = end;
      continue;
    }
    if (source.startsWith("<!--", cursor)) {
      const commentEnd = source.indexOf("-->", cursor + 4);
      cursor = commentEnd === -1 ? source.length : commentEnd + 3;
      continue;
    }
    if (/^<![^-]/.test(source.slice(cursor, cursor + 4))) {
      const declarationEnd = findTagEnd(source, cursor + 2);
      cursor = declarationEnd === -1 ? source.length : declarationEnd + 1;
      continue;
    }
    if (source.startsWith("</", cursor)) {
      const end = findTagEnd(source, cursor + 2);
      if (end === -1) break;
      const match = source.slice(cursor + 2, end).match(/^\s*([^\s>]+)/);
      if (match?.[1]) closeElement(parents, match[1].toLowerCase());
      cursor = end + 1;
      continue;
    }

    const end = findTagEnd(source, cursor + 1);
    if (end === -1) {
      appendText(currentParent(parents), source.slice(cursor));
      break;
    }
    const token = source.slice(cursor + 1, end);
    const tagMatch = token.match(/^\s*([^\s/>]+)/);
    if (!tagMatch?.[1]) {
      appendText(currentParent(parents), "<");
      cursor += 1;
      continue;
    }

    const tagName = tagMatch[1].toLowerCase();
    const element: HtmlElementNode = {
      kind: "element",
      tagName,
      attributes: Object.freeze(
        parseAttributes(token.slice(tagMatch[0].length)),
      ),
      children: [],
    };
    currentParent(parents).children.push(element);
    cursor = end + 1;

    if (RAW_TEXT_ELEMENTS.has(tagName)) {
      const closingTag = findRawTextClosingTag(source, cursor, tagName);
      const rawEnd = closingTag?.start ?? source.length;
      appendText(element, source.slice(cursor, rawEnd), false);
      cursor = closingTag?.end ?? source.length;
    } else if (!VOID_ELEMENTS.has(tagName) && !/\/\s*$/.test(token)) {
      parents.push(element);
    }
  }
  return root;
}
