# Writing a Git Commit Message

Write one commit message whose subject, optional body, and issue references
match the inspected change and the repository's active policy.

## 1. Resolve the message policy

Apply preferences in this order:

1. Follow the user's explicit message instructions.
2. Follow applicable `AGENTS.md` or equivalent repository instructions for
   choices the user left open.
3. Follow a repository policy file that those instructions identify.
4. Use the portable defaults below for every remaining choice.

Report a conflict instead of silently applying a lower-precedence preference.
Treat neighboring commit history as evidence, not as policy, unless the user or
repository instructions explicitly make it policy.

Complete this step when every message choice has one controlling source.

## 2. Draft the subject

Use Conventional Commits by default: `<type>(<scope>): <description>`. Omit the
scope when it adds no useful context.

- Prefer `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`,
  and `ci` as types.
- Name the outcome, capability, fixed behavior, or refactor reason.
- Start the description with a lowercase imperative verb.
- Omit the final period, aim for 50 characters, and never exceed 72 characters.

Complete this step when the subject accurately describes the complete inspected
change in isolation.

## 3. Add the body and issue references

Add a short body only when the subject cannot carry necessary rationale or
impact. Explain why the change exists instead of replaying its implementation.

Add `Fixes #<issue>` or `Closes #<issue>` only when the change resolves a
verified issue. Use `Relates #<issue>` when it contributes without closing. Use
the full issue URL when the issue belongs to another repository.

Complete this step when every body paragraph and issue reference carries
information the subject cannot.

## 4. Verify and return the message

Read the subject in isolation. Confirm that it matches the inspected change,
uses the selected type and scope accurately, starts its description with a
lowercase imperative verb, meets the active length rules, and agrees with the
body.

Verify every issue reference against the request or repository evidence. Return
the exact subject and body with real line breaks, and disclose anything not
fully verified.
