# Scaffolding

This reference owns the new-artifact scaffold command, its inputs, filesystem
effects, output, refusal behavior, and recovery boundary.

Resolve `<skill-directory>` to the directory holding `SKILL.md`. With Node.js
22.6 or newer, run from any working directory:

```bash
node --experimental-strip-types \
  "<skill-directory>/scripts/scaffolding/scaffold-html.ts" \
  output.html --lang "<explanation-language>" \
  --title "How the system works"
```

The command requires one `.html` output and a BCP 47 language tag. It creates
missing parent directories, writes the scaffold, prints the resolved output
path, and exits non-zero for invalid input or an existing target.

It refuses overwrite by default. Use `--force` only when the user authorized
replacing that exact file; the old content is not recoverable from this command.
It refuses to write through an output symlink even with `--force`. After
creation, replace every `data-scaffold-placeholder` element before deliverable
validation.
