import type { HtmlDocumentInspection } from "./inspect-html-document.ts";
import { findAttribute } from "./validation-helpers.ts";

export function validateDocumentShell(
  source: string,
  document: HtmlDocumentInspection,
  errors: string[],
): void {
  if (!/^\s*<!doctype\s+html>/i.test(source)) {
    errors.push("missing HTML5 doctype");
  }
  const language = findAttribute(document.elements, "html", "lang");
  if (!language || !/^[a-z]{2,3}(?:-[a-z0-9]{2,8})*$/i.test(language)) {
    errors.push("html element needs a non-empty BCP 47 lang attribute");
  }
  const viewport = document.elements.find(
    ({ tagName, attributes }) =>
      tagName === "meta" && attributes["name"] === "viewport",
  );
  if (!viewport?.attributes["content"]?.trim()) {
    errors.push("missing non-empty viewport meta tag");
  }
  if (!document.documentTitleText.trim()) {
    errors.push("missing non-empty title");
  }

  const mainCount = document.tags["main"] ?? 0;
  if (mainCount !== 1) {
    errors.push(`expected exactly one main element, found ${mainCount}`);
  }

  const h1Count = document.tags["h1"] ?? 0;
  if (h1Count !== 1 || !document.h1Text.trim()) {
    errors.push("expected exactly one non-empty h1");
  }

  const hasSkipLink = document.elements.some(
    ({ tagName, attributes }) =>
      tagName === "a" &&
      attributes["href"]?.startsWith("#") === true &&
      attributes["class"]?.includes("skip") === true,
  );
  if (!hasSkipLink) errors.push("missing visible-on-focus skip link");
}

export function validatePlaceholders(
  document: HtmlDocumentInspection,
  errors: string[],
): void {
  const count = document.elements.filter(
    ({ attributes }) => "data-scaffold-placeholder" in attributes,
  ).length;
  if (count > 0) {
    errors.push(`replace all scaffold placeholders before delivery (${count})`);
  }
}

export function validateResponsiveCss(
  document: HtmlDocumentInspection,
  errors: string[],
): void {
  const css = document.styles.join("\n");
  if (
    !/@media\s*\([^)]*prefers-reduced-motion\s*:\s*reduce[^)]*\)\s*\{/i.test(
      css,
    )
  ) {
    errors.push("missing prefers-reduced-motion handling");
  }
  if (!/:focus-visible\s*[^,{]*\{[^}]+\}/i.test(css)) {
    errors.push("missing explicit keyboard focus style");
  }
}
