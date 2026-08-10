import { execFile } from "node:child_process";
import { appendFile, readFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const EXPECTED_PLUGIN_NAME = "ptlam-agent-plugin";
const SEMVER_PATTERN =
  /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[A-Za-z-][0-9A-Za-z-]*)(?:\.(?:0|[1-9]\d*|\d*[A-Za-z-][0-9A-Za-z-]*))*))?(?:\+[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?$/;

interface SemanticVersion {
  readonly major: number;
  readonly minor: number;
  readonly patch: number;
  readonly prerelease: readonly (number | string)[];
}

export interface ReleaseMetadataInput {
  readonly packageName: unknown;
  readonly packagePrivate: unknown;
  readonly packageVersion: unknown;
  readonly lockfileName: unknown;
  readonly lockfileVersion: unknown;
  readonly lockfileRootName: unknown;
  readonly lockfileRootVersion: unknown;
  readonly pluginName: unknown;
  readonly pluginVersion: unknown;
  readonly claudeName: unknown;
  readonly claudeVersion: unknown;
  readonly codexName: unknown;
  readonly codexVersion: unknown;
}

export interface ReleaseMetadata {
  readonly prerelease: boolean;
  readonly tag: string;
  readonly title: string;
  readonly version: string;
}

function isRecord(value: unknown): value is Readonly<Record<string, unknown>> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function requireString(value: unknown, label: string): string {
  if (typeof value !== "string" || value.length === 0) {
    throw new Error(`${label} must be a non-empty string.`);
  }
  return value;
}

function parseSemVer(value: string): SemanticVersion {
  const match = SEMVER_PATTERN.exec(value);
  if (match === null) throw new Error(`${value} is not valid SemVer.`);
  return {
    major: Number(match[1]),
    minor: Number(match[2]),
    patch: Number(match[3]),
    prerelease:
      match[4]
        ?.split(".")
        .map((identifier) =>
          /^\d+$/.test(identifier) ? Number(identifier) : identifier,
        ) ?? [],
  };
}

function compareIdentifier(
  left: number | string,
  right: number | string,
): number {
  if (left === right) return 0;
  if (typeof left === "number" && typeof right === "string") return -1;
  if (typeof left === "string" && typeof right === "number") return 1;
  return left < right ? -1 : 1;
}

export function compareSemVer(leftValue: string, rightValue: string): number {
  const left = parseSemVer(leftValue);
  const right = parseSemVer(rightValue);
  for (const part of ["major", "minor", "patch"] as const) {
    if (left[part] !== right[part]) return left[part] < right[part] ? -1 : 1;
  }
  if (left.prerelease.length === 0 || right.prerelease.length === 0) {
    if (left.prerelease.length === right.prerelease.length) return 0;
    return left.prerelease.length === 0 ? 1 : -1;
  }
  const length = Math.max(left.prerelease.length, right.prerelease.length);
  for (let index = 0; index < length; index += 1) {
    const leftIdentifier = left.prerelease[index];
    const rightIdentifier = right.prerelease[index];
    if (leftIdentifier === undefined) return -1;
    if (rightIdentifier === undefined) return 1;
    const comparison = compareIdentifier(leftIdentifier, rightIdentifier);
    if (comparison !== 0) return comparison;
  }
  return 0;
}

export function parsePluginMetadata(source: string): {
  readonly name: string;
  readonly version: string;
} {
  function readScalar(key: string): string {
    const match = new RegExp(
      `^${key}:\\s*["']?([^"'\\s#]+)["']?\\s*(?:#.*)?$`,
      "m",
    ).exec(source);
    if (match?.[1] === undefined) {
      throw new Error(`plugin/plugin.yml must define top-level ${key}.`);
    }
    return match[1];
  }
  return { name: readScalar("name"), version: readScalar("version") };
}

export function validateReleaseMetadata(
  input: ReleaseMetadataInput,
  previousVersion?: string,
): ReleaseMetadata {
  const packageName = requireString(input.packageName, "package.json name");
  const version = requireString(input.packageVersion, "package.json version");
  if (packageName !== EXPECTED_PLUGIN_NAME || input.packagePrivate !== true) {
    throw new Error("package.json must describe the private plugin project.");
  }

  const names = [
    input.lockfileName,
    input.lockfileRootName,
    input.pluginName,
    input.claudeName,
    input.codexName,
  ];
  if (names.some((name) => name !== EXPECTED_PLUGIN_NAME)) {
    throw new Error("Release metadata contains inconsistent plugin names.");
  }

  const versions = [
    input.lockfileVersion,
    input.lockfileRootVersion,
    input.pluginVersion,
    input.claudeVersion,
    input.codexVersion,
  ];
  if (versions.some((candidate) => candidate !== version)) {
    throw new Error("Release metadata contains inconsistent versions.");
  }

  const parsed = parseSemVer(version);
  if (
    previousVersion !== undefined &&
    previousVersion !== version &&
    compareSemVer(version, previousVersion) <= 0
  ) {
    throw new Error(`${version} must be greater than ${previousVersion}.`);
  }
  return {
    prerelease: parsed.prerelease.length > 0,
    tag: `v${version}`,
    title: `PTLam Agent Plugin v${version}`,
    version,
  };
}

async function readJson(filePath: string): Promise<unknown> {
  return JSON.parse(await readFile(filePath, "utf8")) as unknown;
}

function requireRecord(
  value: unknown,
  label: string,
): Readonly<Record<string, unknown>> {
  if (!isRecord(value)) throw new Error(`${label} must contain a JSON object.`);
  return value;
}

async function readPreviousVersion(baseSha: string): Promise<string> {
  if (!/^[0-9a-f]{40}$/i.test(baseSha)) {
    throw new Error("BASE_SHA must be a full Git commit SHA.");
  }
  const { stdout } = await execFileAsync("git", [
    "show",
    `${baseSha}:package.json`,
  ]);
  const manifest = requireRecord(
    JSON.parse(stdout) as unknown,
    `${baseSha}:package.json`,
  );
  return requireString(manifest["version"], "Previous package version");
}

export async function validateReleaseMetadataFiles(
  projectRoot: string,
  baseSha?: string,
): Promise<ReleaseMetadata> {
  const [manifestValue, lockfileValue, pluginSource, claudeValue, codexValue] =
    await Promise.all([
      readJson(path.join(projectRoot, "package.json")),
      readJson(path.join(projectRoot, "package-lock.json")),
      readFile(path.join(projectRoot, "plugin/plugin.yml"), "utf8"),
      readJson(path.join(projectRoot, ".claude-plugin/plugin.json")),
      readJson(path.join(projectRoot, ".codex-plugin/plugin.json")),
    ]);
  const manifest = requireRecord(manifestValue, "package.json");
  const lockfile = requireRecord(lockfileValue, "package-lock.json");
  const lockPackages = requireRecord(
    lockfile["packages"],
    "package-lock.json packages",
  );
  const lockRoot = requireRecord(
    lockPackages[""],
    "package-lock.json root package",
  );
  const plugin = parsePluginMetadata(pluginSource);
  const claude = requireRecord(claudeValue, ".claude-plugin/plugin.json");
  const codex = requireRecord(codexValue, ".codex-plugin/plugin.json");
  const previousVersion =
    baseSha === undefined || /^0{40}$/.test(baseSha)
      ? undefined
      : await readPreviousVersion(baseSha);
  return validateReleaseMetadata(
    {
      packageName: manifest["name"],
      packagePrivate: manifest["private"],
      packageVersion: manifest["version"],
      lockfileName: lockfile["name"],
      lockfileVersion: lockfile["version"],
      lockfileRootName: lockRoot["name"],
      lockfileRootVersion: lockRoot["version"],
      pluginName: plugin.name,
      pluginVersion: plugin.version,
      claudeName: claude["name"],
      claudeVersion: claude["version"],
      codexName: codex["name"],
      codexVersion: codex["version"],
    },
    previousVersion,
  );
}

async function run(): Promise<void> {
  const metadata = await validateReleaseMetadataFiles(
    process.cwd(),
    process.env["BASE_SHA"] || undefined,
  );
  const lines = [
    `version=${metadata.version}`,
    `tag=${metadata.tag}`,
    `title=${metadata.title}`,
    `prerelease=${String(metadata.prerelease)}`,
  ];
  const outputPath = process.env["GITHUB_OUTPUT"];
  if (outputPath === undefined) {
    process.stdout.write(`${lines.join("\n")}\n`);
  } else {
    await appendFile(outputPath, `${lines.join("\n")}\n`);
  }
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
