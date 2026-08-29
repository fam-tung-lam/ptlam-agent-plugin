# PTLam Agent Plugin

`ptlam-agent-plugin` is the personal agent plugin and portable skill catalog
maintained by [Pham Tung Lam](https://github.com/fam-tung-lam).

It provides one centralized place to manage:

- Available skills.
- Skill organization and categories.
- Catalog versions.
- Additions, updates, and retirements over time.

Keeping this state in one version-controlled repository makes changes visible
and repeatable across the agents and projects that Lam uses.

## Available skills

See the compiler-generated [skills catalog](skills/README.md) for the current
table of available skills.

## Using the catalog

Choose one installation route per agent. Installing the Claude Code plugin and
also copying the same skills into Claude Code with the `skills` CLI would expose
duplicates.

### Claude Code

Add this repository as a marketplace, then install its plugin:

```bash
claude plugin marketplace add fam-tung-lam/ptlam-agent-plugin
claude plugin install ptlam-agent-plugin
```

Or run the equivalent commands inside a Claude Code session:

```text
/plugin marketplace add fam-tung-lam/ptlam-agent-plugin
/plugin install ptlam-agent-plugin
/reload-plugins
```

Unlike a plugin in Claude Code's official marketplace, this self-hosted plugin
needs the one-time marketplace command first.

Update the installed plugin with Claude Code's plugin manager:

```bash
claude plugin update ptlam-agent-plugin@ptlam
```

Restart Claude Code to apply the update.

### Codex and other agents

Use the standard Agent Skills installer:

```bash
npx skills@latest add fam-tung-lam/ptlam-agent-plugin
```

Choose the skills and target agents interactively. For a non-interactive Codex
project install of the whole collection:

```bash
npx skills@latest add fam-tung-lam/ptlam-agent-plugin \
  --skill '*' --agent codex --copy --yes
```

The `skills` CLI owns the project installation and its source tracking. Refresh
installations later with:

```bash
npx skills@latest update
```

## Project documentation

- [Changelog](CHANGELOG.md): curated notable changes and release notes.
- [Contribution guide](CONTRIBUTION.md): ways to contribute, pull request
  expectations, and the contributor workflow.
- [Development guide](docs/DEVELOPMENT.md): local setup, source and generated
  files, commands, maintenance workflows, and quality gates.
- [Release guide](docs/RELEASE.md): version preparation, CI/CD behavior, Git
  tags, changelog notes, and source archives.
- [Plugin compiler](https://github.com/fam-tung-lam/ptlam-agent-plugin-compiler):
  sole implementation authority, package documentation, architecture,
  guarantees, and result contracts. This repository consumes the immutable
  package `@fam-tung-lam/ptlam-agent-plugin-compiler@0.4.0-alpha.1` exactly.
- [License](LICENSE): terms for using and contributing to this project.
