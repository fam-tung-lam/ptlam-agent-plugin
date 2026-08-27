# Scaffolding

This file covers the new-page scaffold command, its inputs, filesystem effects,
output, refusal behavior, and the shell it produces.

Resolve `<skill-directory>` to the folder holding `SKILL.md`. With Node.js 22.6
or newer, run from any working directory:

```bash
node --experimental-strip-types \
  "<skill-directory>/scripts/scaffolding/scaffold-html.ts" \
  output.html --lang "<explanation-language>" \
  --title "How the system works"
```

The command needs one `.html` output and a BCP 47 language tag. It creates
missing parent folders, writes the scaffold, prints the resolved path, and exits
non-zero for invalid input or an existing target.

It refuses to overwrite by default. Use `--force` only when the user allowed
replacing that exact file; the old content is not recoverable. It refuses to
write through a symlink even with `--force`.

## What the scaffold gives you

The scaffold is the canonical shell: one long-form field guide the learner
scrolls from orientation into deeper mechanisms. Keep its visible-on-focus skip
link, descriptive head metadata, orientation header, wrapping anchor navigation,
single `main`, progressively deeper sections, and source-and-scope footer.
Change the section count and labels to fit the learner's question.

Anchor links may jump between sections, but must never hide content the way tabs
do. Write a useful static default state into the HTML; JavaScript enhances it
after load.

After creation, replace every `data-scaffold-placeholder` element before
validation.
