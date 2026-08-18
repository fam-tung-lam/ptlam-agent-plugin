import { execFile } from "node:child_process";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { promisify } from "node:util";
import { describe, expect, it, onTestFinished } from "vitest";

import { validateReleaseMetadataFiles } from "../../../../.github/scripts/validate-release-metadata.ts";

const execFileAsync = promisify(execFile);
const VERSION = "0.1.0-alpha.1";
const VALID_CHANGELOG = `# Changelog

## [Unreleased]

## [${VERSION}] - 2026-08-18

### Added

- Added release automation.

[Unreleased]:
  https://github.com/example/project/compare/v${VERSION}...HEAD
[${VERSION}]:
  https://github.com/example/project/compare/v0.1.0-alpha.0...v${VERSION}
`;

async function createProject(historicalVersion?: string): Promise<{
  readonly baseSha: string;
  readonly projectRoot: string;
}> {
  const projectRoot = await mkdtemp(
    path.join(tmpdir(), "release-metadata-test-"),
  );
  onTestFinished(() => rm(projectRoot, { force: true, recursive: true }));

  await execFileAsync("git", ["init", "--quiet"], { cwd: projectRoot });
  await writeFile(path.join(projectRoot, "README.md"), "# Initial commit\n");
  if (historicalVersion !== undefined) {
    await writeFile(
      path.join(projectRoot, "package.json"),
      `${JSON.stringify({
        name: "ptlam-agent-plugin",
        private: true,
        version: historicalVersion,
      })}\n`,
    );
  }
  await execFileAsync("git", ["add", "."], { cwd: projectRoot });
  await execFileAsync(
    "git",
    [
      "-c",
      "user.name=Release Test",
      "-c",
      "user.email=release-test@example.invalid",
      "commit",
      "--quiet",
      "-m",
      "Initial commit",
    ],
    { cwd: projectRoot },
  );
  const { stdout } = await execFileAsync("git", ["rev-parse", "HEAD"], {
    cwd: projectRoot,
  });

  await Promise.all([
    mkdir(path.join(projectRoot, "plugin")),
    mkdir(path.join(projectRoot, ".claude-plugin")),
    mkdir(path.join(projectRoot, ".codex-plugin")),
  ]);
  const manifest = {
    name: "ptlam-agent-plugin",
    private: true,
    version: VERSION,
  };
  const generatedManifest = {
    name: "ptlam-agent-plugin",
    version: VERSION,
  };
  await Promise.all([
    writeFile(
      path.join(projectRoot, "package.json"),
      `${JSON.stringify(manifest)}\n`,
    ),
    writeFile(
      path.join(projectRoot, "package-lock.json"),
      `${JSON.stringify({
        name: manifest.name,
        packages: { "": generatedManifest },
        version: VERSION,
      })}\n`,
    ),
    writeFile(path.join(projectRoot, "CHANGELOG.md"), VALID_CHANGELOG),
    writeFile(
      path.join(projectRoot, "plugin/plugin.yml"),
      `name: ${manifest.name}\nversion: ${VERSION}\n`,
    ),
    writeFile(
      path.join(projectRoot, ".claude-plugin/plugin.json"),
      `${JSON.stringify(generatedManifest)}\n`,
    ),
    writeFile(
      path.join(projectRoot, ".codex-plugin/plugin.json"),
      `${JSON.stringify(generatedManifest)}\n`,
    ),
    writeFile(
      path.join(projectRoot, "plugin.json"),
      `${JSON.stringify(generatedManifest)}\n`,
    ),
    writeFile(
      path.join(projectRoot, "gemini-extension.json"),
      `${JSON.stringify(generatedManifest)}\n`,
    ),
    writeFile(
      path.join(projectRoot, "kimi.plugin.json"),
      `${JSON.stringify(generatedManifest)}\n`,
    ),
  ]);

  return { baseSha: stdout.trim(), projectRoot };
}

describe("GitHub release metadata files", () => {
  it("validates the first manifest when the base commit predates package.json", async () => {
    // GIVEN a valid project whose base commit has no package manifest
    const { baseSha, projectRoot } = await createProject();

    // WHEN release metadata is validated against that base commit
    const result = await validateReleaseMetadataFiles(projectRoot, baseSha);

    // THEN current metadata remains valid without a previous-version comparison
    expect(result.version).toBe(VERSION);
  });

  it("rejects a base SHA that is unavailable in the repository", async () => {
    // GIVEN a valid project and a full SHA that does not identify a commit
    const { projectRoot } = await createProject();
    const unavailableSha = "f".repeat(40);

    // WHEN release metadata is validated against the unavailable base
    const validate = () =>
      validateReleaseMetadataFiles(projectRoot, unavailableSha);

    // THEN the missing Git history still fails the release check
    await expect(validate).rejects.toThrow();
  });

  it("validates the changelog when the version changes", async () => {
    // GIVEN a valid version bump with a complete release changelog
    const { baseSha, projectRoot } = await createProject("0.1.0-alpha.0");

    // WHEN release metadata is validated against the prior version
    const result = await validateReleaseMetadataFiles(projectRoot, baseSha);

    // THEN the version and its changelog are accepted together
    expect(result.version).toBe(VERSION);
  });

  it("rejects a version change with stale changelog comparison links", async () => {
    // GIVEN a valid version bump whose Unreleased link starts at an older tag
    const { baseSha, projectRoot } = await createProject("0.1.0-alpha.0");
    await writeFile(
      path.join(projectRoot, "CHANGELOG.md"),
      VALID_CHANGELOG.replace(`v${VERSION}...HEAD`, "v0.1.0-alpha.0...HEAD"),
    );

    // WHEN release metadata is validated against the prior version
    const validate = () => validateReleaseMetadataFiles(projectRoot, baseSha);

    // THEN CI rejects the stale release range
    await expect(validate).rejects.toThrow("Unreleased comparison link");
  });
});
