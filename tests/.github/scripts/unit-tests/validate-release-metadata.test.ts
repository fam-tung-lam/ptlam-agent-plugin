import { describe, expect, it } from "vitest";

import {
  compareSemVer,
  parsePluginMetadata,
  type ReleaseMetadataInput,
  validateReleaseMetadata,
} from "../../../../.github/scripts/validate-release-metadata.ts";

function validInput(version = "0.1.0-alpha.1"): ReleaseMetadataInput {
  return {
    packageName: "ptlam-agent-plugin",
    packagePrivate: true,
    packageVersion: version,
    lockfileName: "ptlam-agent-plugin",
    lockfileVersion: version,
    lockfileRootName: "ptlam-agent-plugin",
    lockfileRootVersion: version,
    pluginName: "ptlam-agent-plugin",
    pluginVersion: version,
    claudeName: "ptlam-agent-plugin",
    claudeVersion: version,
    codexName: "ptlam-agent-plugin",
    codexVersion: version,
    copilotName: "ptlam-agent-plugin",
    copilotVersion: version,
    geminiName: "ptlam-agent-plugin",
    geminiVersion: version,
    kimiName: "ptlam-agent-plugin",
    kimiVersion: version,
  };
}

describe("GitHub release metadata", () => {
  it("derives a prerelease tag and product title from aligned metadata", () => {
    // GIVEN aligned metadata for a newer prerelease version
    const input = validInput("0.1.0-alpha.2");

    // WHEN the release metadata is validated
    const result = validateReleaseMetadata(input, "0.1.0-alpha.1");

    // THEN GitHub receives the expected release identity
    expect(result).toEqual({
      prerelease: true,
      tag: "v0.1.0-alpha.2",
      title: "PTLam Agent Plugin v0.1.0-alpha.2",
      version: "0.1.0-alpha.2",
    });
  });

  it("rejects a version that disagrees with generated plugin metadata", () => {
    // GIVEN generated metadata with a different version
    const input = { ...validInput(), kimiVersion: "0.1.0-alpha.2" };

    // WHEN the release metadata is validated
    const validate = () => validateReleaseMetadata(input);

    // THEN release creation is blocked
    expect(validate).toThrow(
      "Release metadata contains inconsistent versions.",
    );
  });

  it.each([
    ["0.1.0-alpha.2", "0.1.0-alpha.1", 1],
    ["0.1.0", "0.1.0-rc.1", 1],
    ["1.0.0", "0.9.9", 1],
    ["0.1.0-alpha.1", "0.1.0-alpha.1", 0],
    ["0.1.0-alpha.1", "0.1.0", -1],
  ])("compares SemVer %s with %s as %i", (left, right, expected) => {
    // GIVEN two valid semantic versions

    // WHEN their precedence is compared
    const result = compareSemVer(left, right);

    // THEN the expected ordering is returned
    expect(result).toBe(expected);
  });

  it("rejects a changed version that does not increase", () => {
    // GIVEN a stable version changed to a lower-precedence prerelease
    const input = validInput("0.1.0-alpha.1");

    // WHEN the version transition is validated
    const validate = () => validateReleaseMetadata(input, "0.1.0");

    // THEN release creation is blocked
    expect(validate).toThrow("0.1.0-alpha.1 must be greater than 0.1.0.");
  });

  it("marks a stable semantic version as a normal release", () => {
    // GIVEN aligned metadata for a stable version
    const input = validInput("1.0.0");

    // WHEN the release metadata is validated
    const result = validateReleaseMetadata(input, "1.0.0-rc.1");

    // THEN GitHub receives normal release metadata
    expect(result.prerelease).toBe(false);
    expect(result.tag).toBe("v1.0.0");
  });

  it("rejects a version outside the Semantic Versioning contract", () => {
    // GIVEN aligned metadata with a non-SemVer version
    const input = validInput("release-1");

    // WHEN the release metadata is validated
    const validate = () => validateReleaseMetadata(input);

    // THEN release creation is blocked
    expect(validate).toThrow("release-1 is not valid SemVer.");
  });

  it("reads the top-level plugin name and version", () => {
    // GIVEN a manifest with comments, quoted version, and nested names
    const source = `# Plugin\nname: ptlam-agent-plugin\nversion: "1.2.3"\nauthor:\n  name: Example\n`;

    // WHEN the manifest release fields are read
    const result = parsePluginMetadata(source);

    // THEN only the top-level values are returned
    expect(result).toEqual({ name: "ptlam-agent-plugin", version: "1.2.3" });
  });
});
