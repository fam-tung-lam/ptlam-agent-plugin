import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import {
  access,
  cp,
  mkdir,
  mkdtemp,
  readFile,
  realpath,
  rm,
  symlink,
  writeFile,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { describe, it, onTestFinished } from "vitest";

const packageName = "@fam-tung-lam/ptlam-agent-plugin-compiler";
const testDirectory = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(testDirectory, "../../../");
const fixtureSource = path.join(
  testDirectory,
  "test-fixtures/consumer-repository",
);
const installedPackagePath = path.join(
  repositoryRoot,
  "node_modules",
  "@fam-tung-lam",
  "ptlam-agent-plugin-compiler",
);
const installedShimPath = path.join(
  repositoryRoot,
  "node_modules",
  ".bin",
  process.platform === "win32" ? "plugin-compiler.cmd" : "plugin-compiler",
);
const typescriptCliPath = path.join(
  repositoryRoot,
  "node_modules",
  "typescript",
  "bin",
  "tsc",
);

interface ProcessResult {
  readonly exitCode: number | null;
  readonly stdout: string;
  readonly stderr: string;
}

function runProcess(
  executable: string,
  argv: readonly string[],
  cwd: string,
): Promise<ProcessResult> {
  return new Promise((resolve, reject) => {
    const child = spawn(executable, [...argv], {
      cwd,
      env: { ...process.env, INIT_CWD: cwd },
      shell: process.platform === "win32" && executable.endsWith(".cmd"),
      stdio: ["ignore", "pipe", "pipe"],
      windowsHide: true,
    });
    let stdout = "";
    let stderr = "";
    child.stdout.setEncoding("utf8");
    child.stderr.setEncoding("utf8");
    child.stdout.on("data", (chunk: string) => {
      stdout += chunk;
    });
    child.stderr.on("data", (chunk: string) => {
      stderr += chunk;
    });
    child.once("error", reject);
    child.once("close", (exitCode) => resolve({ exitCode, stdout, stderr }));
  });
}

function isInside(parent: string, candidate: string): boolean {
  const relative = path.relative(parent, candidate);
  return (
    relative === "" ||
    (relative !== ".." &&
      !relative.startsWith(`..${path.sep}`) &&
      !path.isAbsolute(relative))
  );
}

function exportedDeclarationNames(source: string): readonly string[] {
  return [...source.matchAll(/^export(?: type)? \{([^}]*)\}/gmu)]
    .flatMap((match) => match[1]?.split(",") ?? [])
    .map((name) => name.trim())
    .filter((name) => name !== "")
    .toSorted();
}

async function createTemporaryDirectory(prefix: string): Promise<string> {
  const directory = await mkdtemp(path.join(tmpdir(), prefix));
  onTestFinished(() => rm(directory, { force: true, recursive: true }));
  return directory;
}

async function assertUnavailable(target: string): Promise<void> {
  await assert.rejects(access(target), (error: unknown) => {
    return (
      error instanceof Error &&
      "code" in error &&
      (error as NodeJS.ErrnoException).code === "ENOENT"
    );
  });
}

describe("installed PTLam agent plugin compiler consumer", () => {
  it("resolves the closed root API, declarations, and executable from node_modules", async () => {
    // GIVEN: npm ci installed the exact prerelease compiler and executable shim.
    const packageRoot = await realpath(installedPackagePath);
    const resolution = await runProcess(
      process.execPath,
      [
        "--input-type=module",
        "--eval",
        `process.stdout.write(import.meta.resolve(${JSON.stringify(packageName)}))`,
      ],
      repositoryRoot,
    );
    assert.equal(resolution.exitCode, 0, resolution.stderr);
    const resolvedRootEntry = await realpath(fileURLToPath(resolution.stdout));
    const resolvedBinaryEntry = await realpath(
      path.join(packageRoot, "dist/bin.js"),
    );
    const packageMetadata = JSON.parse(
      await readFile(path.join(packageRoot, "package.json"), "utf8"),
    ) as {
      readonly bin: Record<string, string>;
      readonly exports: Record<string, unknown>;
      readonly version: string;
    };
    const consumerMetadata = JSON.parse(
      await readFile(path.join(repositoryRoot, "package.json"), "utf8"),
    ) as {
      readonly devDependencies: Record<string, string>;
      readonly scripts: Record<string, string>;
    };
    const consumerLockfile = JSON.parse(
      await readFile(path.join(repositoryRoot, "package-lock.json"), "utf8"),
    ) as {
      readonly packages: Record<
        string,
        {
          readonly devDependencies?: Record<string, string>;
          readonly version?: string;
        }
      >;
    };

    // WHEN: A consumer imports the root and compiles all documented declarations.
    const rootImport = await runProcess(
      process.execPath,
      [
        "--input-type=module",
        "--eval",
        `const namespace = await import(${JSON.stringify(packageName)}); process.stdout.write(JSON.stringify(Object.keys(namespace)));`,
      ],
      repositoryRoot,
    );
    const declarations = await readFile(
      path.join(packageRoot, "dist/index.d.ts"),
      "utf8",
    );
    const typeConsumerRoot = await createTemporaryDirectory(
      "ptlam-plugin-compiler-types-",
    );
    const linkedPackageParent = path.join(
      typeConsumerRoot,
      "node_modules",
      "@fam-tung-lam",
    );
    await mkdir(linkedPackageParent, { recursive: true });
    await symlink(
      packageRoot,
      path.join(linkedPackageParent, "ptlam-agent-plugin-compiler"),
      process.platform === "win32" ? "junction" : "dir",
    );
    await writeFile(
      path.join(typeConsumerRoot, "package.json"),
      '{"private":true,"type":"module"}\n',
      "utf8",
    );
    await writeFile(
      path.join(typeConsumerRoot, "tsconfig.json"),
      `${JSON.stringify(
        {
          compilerOptions: {
            module: "NodeNext",
            noEmit: true,
            skipLibCheck: true,
            strict: true,
            target: "ES2024",
          },
          files: ["consumer.ts"],
        },
        null,
        2,
      )}\n`,
      "utf8",
    );
    await writeFile(
      path.join(typeConsumerRoot, "consumer.ts"),
      `import {
  PluginCompiler,
  type CheckResult,
  type CompilerOptionsInput,
  type GenerateResult,
  type ValidateResult,
} from "${packageName}";
// @ts-expect-error Undocumented internal names are not root exports.
import type { CompilerOptions } from "${packageName}";

const options: CompilerOptionsInput = {
  rootDir: ".",
  providerIds: ["claude", "codex"],
};
const compiler = new PluginCompiler(options);
let validate: ValidateResult | undefined;
let check: CheckResult | undefined;
let generate: GenerateResult | undefined;
void [compiler, validate, check, generate];
void (0 as unknown as CompilerOptions);
`,
      "utf8",
    );
    const typecheck = await runProcess(
      process.execPath,
      [
        typescriptCliPath,
        "--project",
        path.join(typeConsumerRoot, "tsconfig.json"),
      ],
      typeConsumerRoot,
    );

    // THEN: Runtime, declarations, exports, and the real shim stay inside the package.
    assert.equal(
      consumerMetadata.devDependencies[packageName],
      "0.1.0-alpha.1",
    );
    assert.equal(
      consumerLockfile.packages[""]?.devDependencies?.[packageName],
      "0.1.0-alpha.1",
    );
    assert.equal(
      consumerLockfile.packages[`node_modules/${packageName}`]?.version,
      "0.1.0-alpha.1",
    );
    assert.deepEqual(
      {
        "plugin:check": consumerMetadata.scripts["plugin:check"],
        "plugin:compile": consumerMetadata.scripts["plugin:compile"],
        "plugin:validate": consumerMetadata.scripts["plugin:validate"],
        "plugin:verify": consumerMetadata.scripts["plugin:verify"],
      },
      {
        "plugin:check": "plugin-compiler check",
        "plugin:compile": "plugin-compiler generate",
        "plugin:validate": "plugin-compiler validate",
        "plugin:verify": "npm run plugin:validate && npm run plugin:check",
      },
    );
    assert.equal(packageMetadata.version, "0.1.0-alpha.1");
    assert.deepEqual(packageMetadata.exports, {
      ".": {
        types: "./dist/index.d.ts",
        import: "./dist/index.js",
      },
    });
    assert.deepEqual(packageMetadata.bin, {
      "plugin-compiler": "./dist/bin.js",
    });
    assert.equal(isInside(packageRoot, resolvedRootEntry), true);
    assert.equal(resolvedRootEntry, path.join(packageRoot, "dist/index.js"));
    assert.equal(isInside(packageRoot, resolvedBinaryEntry), true);
    if (process.platform === "win32") {
      assert.match(
        await readFile(installedShimPath, "utf8"),
        /@fam-tung-lam[\\/]ptlam-agent-plugin-compiler[\\/]dist[\\/]bin\.js/u,
      );
    } else {
      assert.equal(await realpath(installedShimPath), resolvedBinaryEntry);
    }
    assert.equal(rootImport.exitCode, 0, rootImport.stderr);
    assert.deepEqual(JSON.parse(rootImport.stdout), ["PluginCompiler"]);
    assert.deepEqual(exportedDeclarationNames(declarations), [
      "CheckResult",
      "CompilerOptionsInput",
      "GenerateResult",
      "PluginCompiler",
      "ValidateResult",
    ]);
    assert.equal(typecheck.exitCode, 0, typecheck.stderr || typecheck.stdout);
    assert.equal(typecheck.stdout, "");
    assert.equal(typecheck.stderr, "");
  });

  it("runs validate, generate, and check without repository-local compiler source", async () => {
    // GIVEN: A clean copied consumer has authored inputs but no local compiler or node_modules.
    const consumerRoot = await createTemporaryDirectory(
      "ptlam-plugin-compiler-consumer-",
    );
    await cp(fixtureSource, consumerRoot, { recursive: true });
    const unavailableCompilerSource = path.join(
      consumerRoot,
      "tools",
      "plugin-compiler",
    );
    const localNodeModules = path.join(consumerRoot, "node_modules");
    const humanReadmeBefore = await readFile(
      path.join(consumerRoot, "README.md"),
    );
    await Promise.all([
      assertUnavailable(unavailableCompilerSource),
      assertUnavailable(localNodeModules),
    ]);

    // WHEN: The absolute installed npm shim performs the complete consumer flow.
    const validate = await runProcess(
      installedShimPath,
      ["validate"],
      consumerRoot,
    );
    const generate = await runProcess(
      installedShimPath,
      ["generate"],
      consumerRoot,
    );
    const check = await runProcess(installedShimPath, ["check"], consumerRoot);

    // THEN: Both provider outputs are generated and verified without a source fallback.
    assert.equal(validate.exitCode, 0, validate.stderr);
    assert.match(validate.stdout, /providers: claude, codex/u);
    assert.match(validate.stdout, /Validated consumer-fixture@0\.1\.0/u);
    assert.equal(validate.stderr, "");
    assert.equal(generate.exitCode, 0, generate.stderr);
    assert.match(generate.stdout, /Generation completed/u);
    assert.equal(generate.stderr, "");
    assert.equal(check.exitCode, 0, check.stderr);
    assert.match(check.stdout, /Output check passed/u);
    assert.equal(check.stderr, "");

    const [
      claudePlugin,
      claudeMarketplace,
      codexPlugin,
      catalog,
      generatedSkill,
    ] = await Promise.all([
      readFile(path.join(consumerRoot, ".claude-plugin/plugin.json"), "utf8"),
      readFile(
        path.join(consumerRoot, ".claude-plugin/marketplace.json"),
        "utf8",
      ),
      readFile(path.join(consumerRoot, ".codex-plugin/plugin.json"), "utf8"),
      readFile(path.join(consumerRoot, "skills/README.md"), "utf8"),
      readFile(
        path.join(consumerRoot, "skills/consumer-skill/SKILL.md"),
        "utf8",
      ),
    ]);
    assert.deepEqual(JSON.parse(claudePlugin).skills, [
      "./skills/consumer-skill",
    ]);
    assert.equal(JSON.parse(claudeMarketplace).plugins[0]?.source, "./");
    assert.equal(JSON.parse(codexPlugin).skills, "./skills/");
    assert.match(catalog, /`consumer-skill`/u);
    assert.match(generatedSkill, /^# Consumer skill$/mu);
    assert.deepEqual(
      await readFile(path.join(consumerRoot, "README.md")),
      humanReadmeBefore,
    );
    await Promise.all([
      assertUnavailable(unavailableCompilerSource),
      assertUnavailable(localNodeModules),
    ]);
  });
});
