import type { HtmlDocumentInspection } from "./inspect-html-document.ts";

export function validateReferences(
  document: HtmlDocumentInspection,
  errors: string[],
): void {
  const idCounts = new Map<string, number>();
  for (const id of document.ids) {
    idCounts.set(id, (idCounts.get(id) ?? 0) + 1);
  }

  const duplicateIds = [...idCounts]
    .filter(([, count]) => count > 1)
    .map(([id]) => id)
    .sort();
  if (duplicateIds.length > 0) {
    errors.push(`duplicate ids: ${duplicateIds.join(", ")}`);
  }

  const ids = new Set(document.ids);
  const missingTargets = [...new Set(document.hrefs)]
    .filter((href) => href.startsWith("#") && href !== "#")
    .map((href) => href.slice(1))
    .filter((target) => !ids.has(target))
    .sort();
  if (missingTargets.length > 0) {
    errors.push(`missing internal link targets: ${missingTargets.join(", ")}`);
  }

  const runtimeAssets = [...new Set(document.runtimeAssets)].sort();
  if (runtimeAssets.length > 0) {
    errors.push(`runtime assets must be embedded: ${runtimeAssets.join(", ")}`);
  }
}

export function validateSvgAccessibility(
  document: HtmlDocumentInspection,
  errors: string[],
): void {
  const accessibleCount = document.svg.filter((svg) => {
    if (svg.role !== "img" || svg.labelledBy.length === 0) return false;
    const [titleId, ...descriptionIds] = svg.labelledBy;
    if (
      !titleId ||
      !svg.localTitleIds.includes(titleId) ||
      !document.idText[titleId]?.trim()
    ) {
      return false;
    }
    return descriptionIds.every(
      (id) =>
        svg.localDescriptionIds.includes(id) && document.idText[id]?.trim(),
    );
  }).length;

  if (accessibleCount !== document.svg.length) {
    errors.push(
      "all SVGs need role=img and aria-labelledby whose first target is a " +
        `local non-empty title (${accessibleCount}/${document.svg.length})`,
    );
  }
}
