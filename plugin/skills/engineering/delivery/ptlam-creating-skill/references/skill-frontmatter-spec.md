# Skill Frontmatter Specification

This file covers Claude-style inline YAML frontmatter only: its fields and their
checks. Use an optional field only when the target's local schema, validator, or
accepted metadata verifies it.

When a manifest or compiler owns the metadata, edit that source instead. The
`ptlam-agent-plugin` compiler rejects frontmatter in authored
`plugin/skills/*/SKILL.md` and generates it from `plugin/plugin.yml`.

## Choose fields

Most skills need only `name` and `description`. Add an optional field only when
the workflow needs it and the target verifies it.

| Field                      | Purpose                                          |
| -------------------------- | ------------------------------------------------ |
| `name`                     | Skill and slash-command identifier               |
| `description`              | Trigger pointer for the model, or a user summary |
| `disable-model-invocation` | Only the user may start the skill                |
| `argument-hint`            | Documents slash-command arguments                |
| `user-invocable`           | Menu visibility where supported                  |
| `allowed-tools`            | Limits the tools available inside the skill      |
| `context`                  | Requests isolated execution                      |
| `agent`                    | Selects a supported subagent                     |
| `model`                    | Selects a supported model                        |
| `hooks`                    | Runs commands around supported lifecycle events  |

## Name and description

Follow the target's constraints. Common `name` rules: lowercase letters, digits,
and hyphens; 64 characters at most; no XML tags; a matching folder name.

A `description` is a pointer the model reads, or a summary a person reads. A
common maximum is 1024 characters. Write one trigger per branch plus a reach
clause when another skill should compose this one. The naming rules live in
[package layout](skill-package-layout.md#name-it-after-what-it-does).

## Invocation and visibility

Set `disable-model-invocation: true` only when a person must start the workflow.
Leaving it out normally allows model discovery. Use the target's schema or
validator to tell discovery from menu visibility.

Use `argument-hint` to document expected arguments. Use `user-invocable` only
when a local schema, validator, or accepted example verifies how it interacts
with model invocation.

## Tools, execution, and hooks

Declare the smallest verified `allowed-tools` set, with exact host names. Use
`context: fork` only when isolation helps and you know what the fork receives.
Pick an `agent` or `model` only from names the host's configuration or validator
exposes, and only when the choice really changes the workflow.

Use `hooks` only when the target supports the event, the side effect is allowed,
and an explicit workflow step cannot give the same control more clearly. Verify
the matchers, commands, inputs, and failure behavior.

## String substitutions

Claude-style hosts may support:

| Variable               | Meaning                                |
| ---------------------- | -------------------------------------- |
| `$ARGUMENTS`           | All arguments                          |
| `$ARGUMENTS[N]`        | One zero-based argument                |
| `$N`                   | Short positional form, where supported |
| `${CLAUDE_SESSION_ID}` | Current session identifier             |

Leave out substitutions and argument hints when the skill takes no arguments.
Use only substitutions a local schema, validator, or accepted example verifies.

## Static checks

Confirm that every field exists on the target; the name and folder meet its
rules; invocation and visibility match the chosen policy; the description's
triggers and reach clause are complete; every tool, agent, model, hook, and
substitution is available; time-sensitive behavior can be checked locally; and
no manifest or generator owns this metadata instead.
