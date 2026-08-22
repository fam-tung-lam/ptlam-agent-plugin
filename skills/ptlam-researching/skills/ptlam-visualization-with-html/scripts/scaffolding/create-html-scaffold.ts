import { lstat, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import { resolveUserPath } from "../command-line/resolve-user-path.ts";
import { renderHtmlScaffold } from "./render-html-scaffold.ts";

export interface CreateHtmlScaffoldRequest {
  readonly outputPath: string;
  readonly language: string;
  readonly title?: string;
  readonly overwrite?: boolean;
}

export interface CreateHtmlScaffoldResult {
  readonly outputPath: string;
}

/** Create a portable HTML scaffold and refuse replacement unless requested. */
export async function createHtmlScaffold(
  request: CreateHtmlScaffoldRequest,
): Promise<CreateHtmlScaffoldResult> {
  const outputPath = resolveUserPath(request.outputPath);
  if (path.extname(outputPath).toLowerCase() !== ".html") {
    throw new Error("output must end in .html");
  }

  await mkdir(path.dirname(outputPath), { recursive: true });
  await rejectSymbolicLink(outputPath);

  try {
    await writeFile(outputPath, renderHtmlScaffold(request), {
      encoding: "utf8",
      flag: request.overwrite === true ? "w" : "wx",
    });
  } catch (error: unknown) {
    if (isNodeError(error) && error.code === "EEXIST") {
      throw new Error(`refusing to overwrite existing file: ${outputPath}`);
    }
    throw error;
  }

  return Object.freeze({ outputPath });
}

async function rejectSymbolicLink(outputPath: string): Promise<void> {
  try {
    if ((await lstat(outputPath)).isSymbolicLink()) {
      throw new Error(`refusing to write through symbolic link: ${outputPath}`);
    }
  } catch (error: unknown) {
    if (isNodeError(error) && error.code === "ENOENT") return;
    throw error;
  }
}

function isNodeError(error: unknown): error is NodeJS.ErrnoException {
  return error instanceof Error && "code" in error;
}
