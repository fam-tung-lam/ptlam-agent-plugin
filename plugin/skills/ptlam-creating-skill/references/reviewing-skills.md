# Reviewing Skills

This file covers the read-only review branch and its output. Read it only when
the operation is a review.

## Keep the review read-only

Inspect the package, its metadata owner, dependencies, host schema, validators,
and neighboring skills as needed to judge the capability. Do not edit, generate,
compile, stage, or publish files during a review.

## Apply the package standard

1. Write the capability contract: responsibility, artifact judged, branches,
   inputs, standard for being done, permission, and dependencies.
2. Apply the six capability tests and any foundation-specialization ownership
   map from `skill-atomicity.md`.
3. Use `skill-package-layout.md`, `self-contained-documentation.md`,
   `writing-for-maintainers.md`, and `prompting-best-practices.md` as review
   criteria.
4. Run read-only validators and inspect headings, links, file consumers, and
   declared dependency edges. Audit every external link for required knowledge
   the package does not hold locally.

## Return one verdict

- **Atomic:** one complete capability with one result and one standard.
- **Usably focused:** one capability is clear, but justified context prevents a
  purely atomic package.
- **Unfinished:** one capability is intended, but an execution or acceptance
  branch is incomplete.
- **Mixed:** independently invocable capabilities need a split or a router.

Lead with the verdict. Then report findings from highest to lowest severity. For
each: the exact location, the observed evidence, the impact on the human-agent
contract, and the smallest fix.

Finish when every failed check has evidence and a fix, every check is named, and
unavailable or unmeasured verification is explicit.
