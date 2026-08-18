import { describe, expect, it } from "vitest";

import {
  extractReleaseNotes,
  validateReleaseChangelog,
} from "../../../../.github/scripts/release-notes.ts";

const validChangelog = `# Changelog

## [Unreleased]

## [1.1.0] - 2026-08-10

### Added

- Added curated release notes.

## [1.0.0] - 2026-08-09

### Added

- Published the first release.

[Unreleased]:
  https://github.com/example/project/compare/v1.1.0...HEAD
[1.1.0]:
  https://github.com/example/project/compare/v1.0.0...v1.1.0
`;

describe("release notes", () => {
  it("extracts the curated notes for one release", () => {
    // GIVEN a changelog with adjacent version sections

    // WHEN CD reads the notes for the current release
    const notes = extractReleaseNotes(validChangelog, "1.1.0");

    // THEN only the current release body is returned
    expect(notes).toBe("### Added\n\n- Added curated release notes.\n");
  });

  it("accepts a complete release changelog", () => {
    // GIVEN the release section is dated and Unreleased is empty

    // WHEN CI validates the changelog for the version bump
    const validate = () =>
      validateReleaseChangelog(validChangelog, "1.0.0", "1.1.0");

    // THEN the release changelog is accepted
    expect(validate).not.toThrow();
  });

  it("rejects changes left under Unreleased", () => {
    // GIVEN a release pull request that did not move its pending notes
    const staleChangelog = validChangelog.replace(
      "## [Unreleased]\n",
      "## [Unreleased]\n\n- Still unreleased.\n",
    );

    // WHEN CI validates the changelog for the version bump
    const validate = () =>
      validateReleaseChangelog(staleChangelog, "1.0.0", "1.1.0");

    // THEN the stale Unreleased section is rejected
    expect(validate).toThrow("Unreleased must be empty");
  });

  it("rejects stale comparison links", () => {
    // GIVEN Unreleased still compares from the previous release
    const staleChangelog = validChangelog.replace(
      "v1.1.0...HEAD",
      "v1.0.0...HEAD",
    );

    // WHEN CI validates the changelog for the version bump
    const validate = () =>
      validateReleaseChangelog(staleChangelog, "1.0.0", "1.1.0");

    // THEN the stale comparison range is rejected
    expect(validate).toThrow("Unreleased comparison link");
  });
});
