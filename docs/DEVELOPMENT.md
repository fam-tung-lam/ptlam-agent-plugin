# Development guide

This guide is the canonical development and maintenance workflow for
`ptlam-agent-plugin`. For contribution scope, collaboration expectations, and
pull request guidance, see [CONTRIBUTION.md](../CONTRIBUTION.md).

The skills are the product. This repository consumes the installed
`@fam-tung-lam/ptlam-agent-plugin-compiler` package to validate and generate the
authored catalog for supported agent ecosystems; the compiler is not an
installer.

## Prerequisites

- Git.
- [Node Version Manager (NVM)](https://github.com/nvm-sh/nvm), or another Node
  version manager that reads `.nvmrc`.
- npm, which is bundled with Node.js and uses the committed `package-lock.json`.

## Set up the development environment

The repository pins Node.js 22.23.2 in `.nvmrc`. From the repository root,
install and activate that version, verify it, and install the exact development
dependencies:

```bash
nvm install
node --version
npm ci
```

`nvm install` reads `.nvmrc`, installs the pinned version when necessary, and
activates it. `node --version` must print `v22.23.2`. When returning to an
existing checkout, run `nvm use` to reactivate the pin.

The exact `.nvmrc` version keeps local development reproducible. The broader
`>=22.6.0` declaration in `package.json` remains the runtime compatibility
floor. Use `npm ci` after switching branches or pulling a lockfile change. Do
not manually edit `node_modules/` or commit it.

## Authored and generated files

```text
plugin/
├── plugin.yml                         # authored catalog and provider selection
└── skills/
    └── <skill-id>/                    # authored skill
        ├── SKILL.md
        └── {agents,assets,references,scripts}/

.claude-plugin/
├── plugin.json                       # generated host metadata
└── marketplace.json                  # generated host metadata

.codex-plugin/
└── plugin.json                       # generated host metadata

plugin.json                           # generated Copilot host metadata
gemini-extension.json                 # generated Gemini host metadata
kimi.plugin.json                      # generated Kimi host metadata

README.md                              # human-owned project documentation
skills/
├── README.md                          # generated available-skills catalog
└── <public-skill-id>/                 # generated public skill
    ├── SKILL.md
    └── skills/
```

Edit `plugin/plugin.yml` and `plugin/skills/`. The compiler owns the two Claude
manifests under `.claude-plugin/`, the Codex manifest, the Copilot, Gemini, and
Kimi manifests at the repository root, and the whole root `skills/` tree
including its catalog. Never edit those generated surfaces manually. Root
`README.md` remains normal human-owned project documentation and is never read
or changed by compiler operations.

Both authored and generated skill directories are flat. `category_id` is
metadata, not a path segment. The
[plugin manifest v1 schema](https://github.com/fam-tung-lam/ptlam-agent-plugin-compiler/blob/main/src/core/validation/schemas/plugin-manifest-v1.schema.ts)
defines the authored data contract; its JSON Schema is the machine-readable
source of truth.

## Skill naming

Name related skills with one shared concept prefix:
`ptlam-<concept>-<capability>`. The shared prefix keeps a skill family adjacent
in alphabetic listings and makes the relationship visible from its ID and
directory alone.

For example, use `ptlam-git-writing-commit-message` for a Git capability. Use
`ptlam-code-style` as the code-style foundation and `ptlam-code-style-flutter`
for its Flutter specialization.

Keep the manifest ID and authored directory name identical. Use a standalone
`ptlam-<capability>` name only when the skill does not belong to an established
concept family.

The required top-level `providers` list in `plugin/plugin.yml` selects generated
provider manifests. This repository selects `claude`, `codex`, `copilot`,
`gemini`, and `kimi`. Use an empty list only for a shared-skills-only plugin. A
command-line `--provider` list or `--no-providers` is an explicit temporary
override; normal repository commands use the committed manifest selection.

## Standard development flow

1. Create a focused branch from current `main`.
2. Change the smallest appropriate authored source, test, or documentation
   surface.
3. Run focused tests while developing.
4. If authored catalog data changed, run `npm run plugin:compile`.
5. Review every generated change. Unexpected generated changes are defects to
   investigate, not files to accept automatically.
6. Run the full local quality gates before opening a pull request.
7. Commit only the files that belong to the change.

During normal active development, keep the plugin version unchanged. A
maintainer preparing a GitHub Release follows the separate
[release guide](RELEASE.md).

## Commands

Run all commands from the repository root.

| Command                   | Purpose                                               | Writes |
| ------------------------- | ----------------------------------------------------- | ------ |
| `npm run plugin:validate` | Validate catalog data and authored skill sources      | No     |
| `npm run plugin:compile`  | Validate and replace stale compiler-owned outputs     | Yes    |
| `npm run plugin:check`    | Report generated-output drift                         | No     |
| `npm run plugin:verify`   | Run validation and generated-output drift checks      | No     |
| `npm run code:typecheck`  | Run strict TypeScript analysis without emitting files | No     |
| `npm run code:check`      | Check formatting, lint rules, and imports with Biome  | No     |
| `npm run code:format`     | Apply Biome fixes                                     | Yes    |
| `npm run markdown:check`  | Check Markdown formatting and lint rules              | No     |
| `npm run markdown:format` | Format project Markdown                               | Yes    |
| `npm run release:check`   | Validate version and GitHub Release metadata          | No     |
| `npm test`                | Run the Vitest suite once                             | No     |
| `npm run test:coverage`   | Run tests and enforce coverage thresholds             | Yes\*  |
| `npm run test:watch`      | Run Vitest in watch mode                              | No     |

For a new repository, `npm exec -- plugin-compiler init` creates only missing
authored paths and leaves existing content unchanged. Use
`plugin-compiler <command> --help` to inspect the installed CLI contract.

\* `test:coverage` refreshes the ignored local `coverage/` report.

`plugin:compile` invokes the compiler's generate operation and is the only
plugin command that may replace compiler-owned outputs. Check and validate are
read-only.

The validate, compile, and check scripts resolve the bare `plugin-compiler`
executable from the repository's `node_modules/.bin/`, installed by `npm ci`
from the exact lockfile; `plugin:verify` chains validate and check. Do not use a
global install, transient `npx`, or any repository-local compiler path. A
compiler defect is fixed in the standalone repository and adopted here through a
new immutable package version.

When selecting providers explicitly for diagnosis, pass one comma-separated
list, such as `--provider claude,codex`. Do not repeat `--provider`. The
`--no-providers` option explicitly selects shared skills only.

## Quality gates

Run the same gates used by continuous integration:

```bash
npm run release:check
npm run plugin:verify
npm run code:typecheck
npm run code:check
npm run markdown:check
npm run test:coverage
git diff --check
```

GitHub Actions runs these gates in one `CI Required` job for pull requests and
pushes to `main`. A successful `main` push then triggers CD. CD creates a tag
and GitHub Release only when that version has not already been released; it
never publishes this private package to npm.

Run focused tests first when practical, but do not substitute them for the full
pre-pull-request gates. Test paths put the source scope before the test level.
Compiler implementation tests live only in the standalone repository.

The ignored `local/` directory contains reference material and is intentionally
outside project-wide formatting, linting, and publication.

## Compiler rollback

Prefer a reviewed exact pin to a newly published immutable fix from the
standalone compiler repository. If Git-history restoration is required, revert
the complete reviewed cleanup change; do not reconstruct or selectively execute
former local paths. Never overwrite or normally unpublish a published package
version.

## Maintainer workflows

### Add or move a skill

1. Create or move `plugin/skills/<skill-id>/`.
2. Add one body-only `SKILL.md` with exactly one required-skills marker.
3. Add or update the matching entry in `plugin/plugin.yml`.
4. Run `npm run plugin:compile` and review every generated change.
5. Run all [quality gates](#quality-gates).

### Evolve the manifest schema

Make schema, model, validation, fixture, and manifest-guide changes together in
the standalone compiler repository. Publish a new immutable package version,
then adopt that exact version here and regenerate the owned outputs. Never
accept an unknown schema version silently or implement compiler behavior in this
consumer repository.

### Add a generated target

Implement the shared provider contract in the standalone compiler repository
through a pure adapter with one stable ID and exact owned file paths. Add
contract fixtures and conformance tests there, publish a new immutable package
version, then adopt it here and add the provider ID to `plugin/plugin.yml` when
this plugin should emit that target. Providers must not read files, own the
shared `skills/` tree, or emit outside their exact ownership. The installed
compiler currently supports Claude Code, Codex, GitHub Copilot CLI, Gemini CLI,
and Kimi Code CLI; this repository opts into all five providers.

## Development dependencies

`package.json` is strict JSON and cannot contain comments. This table records
why each direct development dependency exists after custody cleanup. Compiler
implementation dependencies belong to the standalone package and are not direct
dependencies of this consumer. Prettier remains required for the repository's
Markdown workflows.

| Dependency                                  | Usage in this project                                                                 |
| ------------------------------------------- | ------------------------------------------------------------------------------------- |
| `@biomejs/biome`                            | Formats, lints, and organizes imports in TypeScript source, tests, and configuration. |
| `@fam-tung-lam/ptlam-agent-plugin-compiler` | Supplies the exact installed stable package used by every active plugin command.      |
| `@types/node`                               | Supplies TypeScript declarations for Node.js APIs used by tests and skill tooling.    |
| `@vitest/coverage-v8`                       | Collects V8 coverage and enforces configured thresholds.                              |
| `markdownlint-cli2`                         | Enforces Markdown structure and style rules outside Prettier's responsibility.        |
| `prettier`                                  | Formats authored Markdown, generated README content, and YAML frontmatter.            |
| `typescript`                                | Runs strict, no-emit static analysis over source, tests, and configuration.           |
| `vite`                                      | Provides the pinned transformation and configuration engine used by Vitest.           |
| `vitest`                                    | Runs unit and integration tests and supplies their test APIs.                         |

When adding, removing, or changing a direct dependency, update `package.json`,
`package-lock.json`, and this rationale together.
