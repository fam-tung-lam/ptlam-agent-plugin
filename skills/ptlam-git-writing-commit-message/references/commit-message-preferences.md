# Commit Message Preferences

Use these defaults only for choices left open by current user instructions,
applicable `AGENTS.md` rules, and any policy file the user explicitly names.

- Use Conventional Commits with an outcome-focused subject:
  `<type>(<scope>): <description>`, omitting the scope only when it adds no
  useful context. Preferred types are `feat`, `fix`, `docs`, `style`,
  `refactor`, `perf`, `test`, `chore`, and `ci`.
- Make the subject explain why the change exists. Name the outcome, capability,
  broken behavior fixed, or reason for a refactor rather than implementation
  mechanics. Use imperative mood, omit the final period, aim for 50 characters,
  and never exceed 72.
- Add a short concrete body when the subject cannot carry enough context. For a
  feature, show the capability or sample usage. For a fix, state the cause and
  how the change prevents failure. Prefer rationale over a step-by-step account.
- Add `Fixes #<issue-number>` or `Closes #<issue-number>` when the commit
  resolves an issue. Add `Relates #<issue-number>` when it contributes without
  closing it. Use the full issue URL for an issue in another repository.
