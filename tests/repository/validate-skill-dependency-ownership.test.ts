import assert from "node:assert/strict";
import { describe, it } from "vitest";

import {
  findDependencyMentions,
  parseSkillDependencyContracts,
} from "../../.github/scripts/validate-skill-dependency-ownership.ts";

describe("skill dependency ownership", () => {
  it("reads each required skill from its manifest owner", () => {
    const contracts = parseSkillDependencyContracts(`
categories:
  - id: engineering
skills:
  - id: foundation
    required_skills: []
  - id: specialization
    required_skills:
      - skill_id: foundation
        reason: Supplies the shared standard.
  - id: standalone
    required_skills: []
`);

    assert.deepEqual(contracts, [
      { id: "foundation", requiredSkills: [] },
      { id: "specialization", requiredSkills: ["foundation"] },
      { id: "standalone", requiredSkills: [] },
    ]);
  });

  it("reports exact dependency names in authored references", () => {
    const mentions = findDependencyMentions(
      { id: "ptlam-code-style-flutter", requiredSkills: ["ptlam-code-style"] },
      "plugin/skills/ptlam-code-style-flutter/references/testing.md",
      "Use the `ptlam-code-style` foundation.\n",
    );

    assert.deepEqual(mentions, [
      {
        authoredPath:
          "plugin/skills/ptlam-code-style-flutter/references/testing.md",
        dependencyId: "ptlam-code-style",
        line: 1,
        skillId: "ptlam-code-style-flutter",
      },
    ]);
  });

  it("allows self-references and unrelated dependency vocabulary", () => {
    const mentions = findDependencyMentions(
      { id: "ptlam-code-style-flutter", requiredSkills: ["ptlam-code-style"] },
      "plugin/skills/ptlam-code-style-flutter/references/testing.md",
      [
        "Return to ptlam-code-style-flutter.",
        "The foundation owns this Material design token.",
        "Inject the runtime dependency through the constructor.",
      ].join("\n"),
    );

    assert.deepEqual(mentions, []);
  });
});
