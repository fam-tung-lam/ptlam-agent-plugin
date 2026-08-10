import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import {
  AgentPluginCompiler,
  CLAUDE,
  CODEX,
  ProviderAdapterRegistry,
} from "@fam-tung-lam/ptlam-agent-plugin-compiler";
import { describe, expect, it } from "vitest";

describe("installed plugin compiler package", () => {
  it("provides the pinned alpha.4 package through its public API", async () => {
    // GIVEN this repository's installed package metadata
    const packageJsonPath = resolve(
      "node_modules/@fam-tung-lam/ptlam-agent-plugin-compiler/package.json",
    );

    // WHEN the installed package metadata is read
    const packageJson = JSON.parse(await readFile(packageJsonPath, "utf8")) as {
      name: string;
      version: string;
    };

    // THEN the exact adopted release and its alpha.4 public seams are available
    expect(packageJson).toMatchObject({
      name: "@fam-tung-lam/ptlam-agent-plugin-compiler",
      version: "0.1.0-alpha.4",
    });
    expect(AgentPluginCompiler).toBeTypeOf("function");
    expect(ProviderAdapterRegistry).toBeTypeOf("function");
    expect([CLAUDE, CODEX]).toEqual(["claude", "codex"]);
  });
});
