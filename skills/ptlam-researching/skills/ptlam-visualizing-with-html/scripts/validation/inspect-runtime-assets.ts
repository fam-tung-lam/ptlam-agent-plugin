import type { HtmlElementNode } from "./html-tree.ts";
import { textContent } from "./html-tree.ts";

const RESOURCE_HREF_TAGS = new Set(["image", "link", "script", "use"]);

export function inspectRuntimeAssets(element: HtmlElementNode): string[] {
  const assets: string[] = [];
  addRuntimeAsset(assets, element.attributes["src"]);

  if (RESOURCE_HREF_TAGS.has(element.tagName)) {
    addRuntimeAsset(assets, element.attributes["href"]);
    addRuntimeAsset(assets, element.attributes["xlink:href"]);
  }
  if (element.tagName === "video") {
    addRuntimeAsset(assets, element.attributes["poster"]);
  }
  if (element.tagName === "object") {
    addRuntimeAsset(assets, element.attributes["data"]);
  }

  assets.push(...findSrcsetAssets(element.attributes["srcset"] ?? ""));
  assets.push(...findCssAssets(element.attributes["style"] ?? ""));
  if (element.tagName === "style") {
    assets.push(...findCssAssets(textContent(element)));
  }
  return assets;
}

function addRuntimeAsset(
  assets: string[],
  candidate: string | undefined,
): void {
  if (candidate && !/^(?:#|data:)/i.test(candidate)) assets.push(candidate);
}

function findCssAssets(source: string): string[] {
  const assets: string[] = [];
  for (const match of source.matchAll(/url\(\s*(['"]?)(.*?)\1\s*\)/gis)) {
    const value = match[2]?.trim();
    if (value && !/^(?:#|data:)/i.test(value)) {
      assets.push(`css-url:${value}`);
    }
  }
  for (const match of source.matchAll(
    /@import\s+(?:url\(\s*)?['"]?([^'"\s);]+)/gi,
  )) {
    const value = match[1]?.trim();
    if (value && !/^(?:#|data:)/i.test(value)) {
      assets.push(`css-import:${value}`);
    }
  }
  return assets;
}

function findSrcsetAssets(source: string): string[] {
  const assets: string[] = [];
  for (const candidate of source.trim().split(/,\s+(?=\S)/)) {
    if (!candidate) continue;
    const value = candidate.split(/\s+/, 1)[0];
    if (value && !/^data:/i.test(value)) assets.push(`srcset:${value}`);
  }
  return assets;
}
