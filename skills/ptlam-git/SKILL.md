---
name: ptlam-git
description:
  Apply PTLam's commit-message preferences and maintain project-local Git
  context. Use for repository-tied Git work that should load current facts or
  preferences from CONTEXT.md; for recording, refreshing, or consolidating
  durable Git context; and for creating or changing a commit message. Apply
  current user, repository, and CONTEXT.md preferences before the portable
  defaults.
---

# PTLam Git Preferences

Apply project-local Git context and commit-message preferences to an existing
Git workflow. This skill does not own general Git mechanics or grant authority
for Git actions.

## 1. Load the branch-specific source of truth

| Task branch | Read | That reference owns |
| --- | --- | --- |
| Any repository-tied Git work | [Project Git context](references/project-git-context.md) | `CONTEXT.md` location, contents, maintenance, freshness, and reporting |
| Creating or changing a commit message | [Commit message preferences](references/commit-message-preferences.md) | Preference precedence and portable subject, body, and issue-reference defaults |

Load both references when both branches apply. Do not load unrelated Git
workflow instructions.

Complete this step when every applicable preference source is loaded and its
authority is clear.

## 2. Apply preferences in precedence order

1. Follow the current user's instructions and repository policy as the sources
   of truth.
2. Apply verified, task-relevant facts and preferences from `CONTEXT.md`.
3. For commit-message choices still unconstrained, apply the portable defaults.
4. Maintain `CONTEXT.md` only under its documented write and scope rules.
5. Report the context state, preferences that affected the result, and any
   stale, conflicting, or unavailable information.

Complete the workflow when current preferences have been applied, authorized
context maintenance is verified, and the handoff accounts for `CONTEXT.md` and
every unresolved conflict.
