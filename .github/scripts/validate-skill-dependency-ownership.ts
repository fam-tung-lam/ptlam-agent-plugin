import type { Dirent } from "node:fs";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

export interface SkillDependencyContract {
  readonly id: string;
  readonly requiredSkills: readonly string[];
}

export interface DependencyMention {
  readonly authoredPath: string;
  readonly dependencyId: string;
  readonly line: number;
  readonly skillId: string;
}

const SKILL_ID_PATTERN = "[a-z0-9]+(?:-[a-z0-9]+)*";
const SKILL_PATTERN = new RegExp(
  `^  - id:\\s+["']?(${SKILL_ID_PATTERN})["']?\\s*$`,
);
const REQUIRED_SKILL_PATTERN = new RegExp(
  `^      - skill_id:\\s+["']?(${SKILL_ID_PATTERN})["']?\\s*$`,
);

export function parseSkillDependencyContracts(
  manifestSource: string,
): readonly SkillDependencyContract[] {
  const contracts: Array<{
    id: string;
    requiredSkills: string[];
  }> = [];
  let current: { id: string; requiredSkills: string[] } | undefined;
  let inSkills = false;

  for (const line of manifestSource.split(/\r?\n/)) {
    if (/^skills:\s*$/.test(line)) {
      inSkills = true;
      continue;
    }
    if (!inSkills) continue;
    if (/^[a-z_]/.test(line)) break;

    const skillMatch = SKILL_PATTERN.exec(line);
    if (skillMatch?.[1] !== undefined) {
      current = { id: skillMatch[1], requiredSkills: [] };
      contracts.push(current);
      continue;
    }

    const requiredSkillMatch = REQUIRED_SKILL_PATTERN.exec(line);
    if (requiredSkillMatch?.[1] !== undefined) {
      if (current === undefined) {
        throw new Error("A required skill appears before its owning skill.");
      }
      current.requiredSkills.push(requiredSkillMatch[1]);
    }
  }

  if (contracts.length === 0) {
    throw new Error("plugin/plugin.yml does not declare any skills.");
  }
  return contracts;
}

function escapeRegularExpression(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function findDependencyMentions(
  contract: SkillDependencyContract,
  authoredPath: string,
  source: string,
): readonly DependencyMention[] {
  const mentions: DependencyMention[] = [];
  for (const dependencyId of contract.requiredSkills) {
    const dependencyPattern = new RegExp(
      `(?<![a-z0-9-])${escapeRegularExpression(dependencyId)}(?![a-z0-9-])`,
    );
    for (const [index, line] of source.split(/\r?\n/).entries()) {
      if (dependencyPattern.test(line)) {
        mentions.push({
          authoredPath,
          dependencyId,
          line: index + 1,
          skillId: contract.id,
        });
      }
    }
  }
  return mentions;
}

async function listMarkdownFiles(
  directory: string,
): Promise<readonly string[]> {
  let entries: readonly Dirent<string>[];
  try {
    entries = await readdir(directory, { withFileTypes: true });
  } catch (error: unknown) {
    if (error instanceof Error && "code" in error && error.code === "ENOENT") {
      return [];
    }
    throw error;
  }

  const files: string[] = [];
  for (const entry of [...entries].sort((left, right) =>
    left.name.localeCompare(right.name),
  )) {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await listMarkdownFiles(entryPath)));
    } else if (entry.isFile() && entry.name.endsWith(".md")) {
      files.push(entryPath);
    }
  }
  return files;
}

export async function validateSkillDependencyOwnership(
  projectRoot: string,
): Promise<readonly DependencyMention[]> {
  const manifestSource = await readFile(
    path.join(projectRoot, "plugin/plugin.yml"),
    "utf8",
  );
  const contracts = parseSkillDependencyContracts(manifestSource);
  const mentions: DependencyMention[] = [];

  for (const contract of contracts) {
    const skillDirectory = path.join(projectRoot, "plugin/skills", contract.id);
    const referencesDirectory = path.join(skillDirectory, "references");
    const authoredPaths = [
      path.join(skillDirectory, "SKILL.md"),
      ...(await listMarkdownFiles(referencesDirectory)),
    ];
    for (const authoredPath of authoredPaths) {
      const source = await readFile(authoredPath, "utf8");
      mentions.push(
        ...findDependencyMentions(
          contract,
          path.relative(projectRoot, authoredPath),
          source,
        ),
      );
    }
  }
  return mentions;
}

async function run(): Promise<void> {
  const mentions = await validateSkillDependencyOwnership(process.cwd());
  if (mentions.length === 0) {
    process.stdout.write("Skill dependency ownership is valid.\n");
    return;
  }

  for (const mention of mentions) {
    process.stderr.write(
      `${mention.authoredPath}:${mention.line}: ${mention.skillId} names required skill ${mention.dependencyId}.\n`,
    );
  }
  throw new Error(
    "Required skill names belong only in plugin/plugin.yml and the generated SKILL.md contract.",
  );
}

const invokedPath = process.argv[1];
if (
  invokedPath !== undefined &&
  import.meta.url === pathToFileURL(path.resolve(invokedPath)).href
) {
  run().catch((error: unknown) => {
    process.stderr.write(
      `${error instanceof Error ? error.message : String(error)}\n`,
    );
    process.exitCode = 1;
  });
}
