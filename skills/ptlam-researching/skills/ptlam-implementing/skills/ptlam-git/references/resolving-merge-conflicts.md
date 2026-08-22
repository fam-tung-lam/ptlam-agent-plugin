# Resolving Merge Conflicts

Resolve every conflicted hunk in one in-progress merge or rebase, verify the
integrated result, and finish the operation without inventing behavior or
aborting it.

## 1. Establish the operation and its goal

Run `git status --short --branch`, `git diff --name-only --diff-filter=U`, and
`git ls-files -u` in the conflicted worktree. Use full `git status` when its
operation guidance or next command is unclear.

Read the request, applicable repository instructions, and recent history. Name
the merge or rebase goal, every unmerged path, and any unrelated changes that
must remain untouched.

Complete this step when the operation, goal, conflict set, and protected changes
are explicit.

## 2. Recover both intents

For each conflict, inspect the working file and the available index stages with
`git show :1:<path>`, `git show :2:<path>`, and `git show :3:<path>`. Inspect
the relevant commits and patches with `git log`, `git show`, and `git blame` as
the repository history requires.

Treat stage labels according to the operation. During a merge, stage 2 is the
current side and stage 3 is the incoming side. During a rebase, stage 2 is the
rebased-onto result and stage 3 is the commit being replayed. Do not choose a
side from the words `ours` or `theirs` alone.

Trace referenced pull requests, issues, or tickets when local history does not
fully explain an intent and the user has authorized the required remote access.
For a generated conflict, find the authored source and generator instead of
treating generated output as the primary source.

Complete this step when each hunk has two named intents, supporting evidence,
and a judgment about whether those intents are compatible.

## 3. Resolve every hunk

Preserve both intents when they are compatible. When they are incompatible, keep
the evidenced intent that matches the operation's stated goal and record which
intent the resolution cannot preserve.

Edit the authored source, remove every conflict marker, and regenerate derived
files through the repository's documented command. Choose a complete side only
when the evidence shows the whole file should come from that side and the
operation-specific stage mapping is verified.

Do not add behavior that neither side intended. Keep resolving until
`git diff --name-only --diff-filter=U` names no path and `git diff --check`
reports no conflict-marker or whitespace error.

## 4. Prove the integrated result

Discover required checks from repository instructions, continuous-integration
configuration, and project manifests. Run the relevant typecheck first, then
tests, then formatting and lint checks. Run every full pre-merge gate the
repository requires.

Fix only failures caused by the conflict resolution. Re-run each failed check
after the fix and inspect formatting changes before staging them.

Complete this step when required checks pass or every unavailable check and its
impact are known.

## 5. Finish the operation

Stage the explicit resolved paths and confirm `git ls-files -u` is empty. For a
merge, create the merge commit with the intended message. For a rebase, run
`git rebase --continue` and repeat this workflow for every later conflict until
all commits have been replayed.

Never use `git merge --abort` or `git rebase --abort`. Do not skip a rebased
commit unless repository evidence proves its complete intent is already present.

Verify the final state with `git status --short --branch` and the relevant
history. Report the operation completed, the intent decisions and trade-offs,
the checks run, and any remaining unrelated changes.
