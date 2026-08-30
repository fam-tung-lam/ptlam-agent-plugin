<!-- PTLAM-SETUP-SKILL:START -->

## AGENTS.override.md has precedence

Read [AGENTS.override.md](AGENTS.override.md). It has precedence over this file.

<!-- PTLAM-SETUP-SKILL:END -->

## Rules

Never read/write in [skills](skills), as it is generated. The source of truth
for agent plugin is the folder [plugin](plugin).

The plugin is pre-release. Remove a skill outright when it is merged, replaced,
or renamed. Do not use `status: deprecated` or `status: archived`.
