# Audit Mode

Read this when the user wants existing tests judged. The audit is read-only.

When the user also asks for fixes, finish the findings first, then enter
write-or-fix mode with its separate authority.

## Inspect

1. Define the reviewed scope and load every applicable reference.
2. Inspect production code wherever you need it to judge behavior, seams,
   placement, and implementation coupling.
3. Identify mandatory violations and materially missing scenarios at the public
   seam. Tie each gap to expected behavior, a failure mode, or a concrete risk.
4. Separate static findings from behavior that executed tests actually verified.

## Report each finding

Give every finding its location, the violated rule, the evidence, the impact,
the smallest useful correction, and any uncertainty or trade-off. Include what
was compliant, and what you could not verify.

| Severity | Use for |
| --- | --- |
| Critical | False confidence, or concealed severe breakage |
| Major | A mandatory violation, or missing material behavior |
| Minor | Readability or maintenance harm |

Then assign one scoped verdict: `Compliant`, `Compliant with recommendations`,
`Non-compliant`, or `Not fully verified`.

## Stay inside the mandate

Do not demand tests for every line, branch, or method. Do not impose a numeric
coverage threshold unless the user or the repository defines one.

## Finish

Finish when every finding carries its evidence and its correction, the verdict
is assigned, and the report names what could not be verified.
