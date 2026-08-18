# Project agent instructions

<!-- PTLAM-SETUP-SKILL:START -->

## AGENTS.override.md has precendence

Read [AGENTS.override.md](AGENTS.override.md). It has precendence over this file.

<!-- PTLAM-SETUP-SKILL:END -->

Never read/write in [skills](skills), as it is generated. The source of truth
for agent plugin is the folder [plugin](plugin).

The plugin is pre-release. Remove a skill outright when it is merged, replaced,
or renamed. Do not use `status: deprecated` or `status: archived`.
