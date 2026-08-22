import type { HtmlElementInspection } from "./html-tree.ts";

export type { HtmlElementInspection } from "./html-tree.ts";

export interface HtmlStepperInspection {
  readonly name: string;
  readonly elements: readonly HtmlElementInspection[];
  readonly noScriptText: string;
  readonly noScriptItemCount: number;
  readonly stepCountText: string;
}

export interface HtmlSvgInspection {
  readonly role: string;
  readonly labelledBy: readonly string[];
  readonly localDescriptionIds: readonly string[];
  readonly localTitleIds: readonly string[];
}

export interface HtmlScriptInspection {
  readonly source: string;
  readonly type: string;
}

export interface HtmlDocumentInspection {
  readonly tags: Readonly<Record<string, number>>;
  readonly elements: readonly HtmlElementInspection[];
  readonly ids: readonly string[];
  readonly hrefs: readonly string[];
  readonly idText: Readonly<Record<string, string>>;
  readonly runtimeAssets: readonly string[];
  readonly steppers: readonly HtmlStepperInspection[];
  readonly svg: readonly HtmlSvgInspection[];
  readonly documentTitleText: string;
  readonly h1Text: string;
  readonly scripts: readonly HtmlScriptInspection[];
  readonly styles: readonly string[];
}
