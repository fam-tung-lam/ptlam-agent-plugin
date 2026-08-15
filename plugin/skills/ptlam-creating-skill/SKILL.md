# PTLam Creating Skills

Create, review, or refactor a skill so future agents follow one predictable,
complete workflow. Keep the normal path in `SKILL.md`, give each supporting
resource one owner, and disclose branch detail only when that branch needs it.

<!-- PLUGIN-COMPILER:REQUIRED-SKILLS -->

## At a glance

```mermaid
flowchart LR
    A[Resolve operation, target, and authority] --> B[Model reusable behavior]
    B --> C{Who should start it?}
    C -- Agent discovers it --> D[Model invocation]
    C -- Human starts it --> E[User invocation]
    E --> F{Several skills hard to remember?}
    F -- Yes --> G[Add a router]
    F -- No --> H[Design the package]
    D --> H
    G --> H
    H --> I[Write, prune, verify, and hand off]
```

| Concern | Boundary |
| --- | --- |
| Operation | Review is read-only. Create and refactor may change the target package. |
| Authority | Target instructions and host schemas own mechanics; authored sources own generated surfaces. |
| File effect | Change only owned package files and required generated surfaces; preserve unrelated work. |
| Done | Invocation, boundaries, reading order, and validation agree; the handoff names any remaining limit. |

## 1. Resolve the task and authority

1. Identify whether the user wants to create, change, or review a skill. Keep a
   review read-only unless the user also requests changes.
2. Resolve the target repository, skill root, and host from explicit context and
   filesystem evidence. The current directory and this skill's installation
   directory are not automatically the target.
3. Read the target's repository instructions, adjacent skills, host
   documentation, schemas, generators, and static validators.
4. Identify the authored sources, generated surfaces, supported resource
   directories, metadata owner, and permitted side effects. Preserve foreign and
   in-progress changes.

## 2. Model the reusable behavior

Extract available evidence before asking questions. Define:

- the capability and observable outcome;
- each distinct invocation branch;
- the inputs, outputs, tools, dependencies, and side effects of each branch;
- the boundary against adjacent work; and
- the decisions a future agent should not need to rediscover.

Use examples to discover the general workflow, not as cases to optimize around.
Ask only when an undiscoverable answer would materially change compatibility,
scope, authority, or behavior.

## 3. Choose invocation and skill boundaries

Resolve the target's invocation mechanics instead of assuming one host's
fields. Where the target distinguishes them:

- choose model invocation when the agent or another skill must discover the
  skill autonomously, accepting its permanent description cost;
- choose user invocation when only the human should start the workflow,
  accepting the human discovery cost; and
- add a router only when several user-invoked skills are genuinely difficult to
  remember.

Split a branch into another skill only when it needs independent invocation or
when later steps repeatedly cause premature completion. First make the current
stage's action and output explicit. Split by sequence only if that does not
solve the problem.

## 4. Design the package and reading order

Read [skill authoring best practices](references/skill-best-practices.md) before
reviewing, designing, or materially revising the package. It owns naming,
package anatomy, progressive disclosure, reusable resources, executable
resources, and the static quality checklist.

Use it with the required Human-First Work Contract to produce the package tree
and reading order before writing detailed instructions.

## 5. Write discovery metadata

Use a compact leading word already present in user prompts, the domain, or the
repository when it accurately anchors the skill. Write one trigger for each
distinct branch; collapse synonymous triggers that only rename the same branch.

For model invocation, make the description a precise model-facing context
pointer. For user invocation, keep its human-facing summary compact. Follow the
resolved target schema instead of generic examples.

When the target uses Claude-style inline YAML, read
[skill frontmatter specification](references/skill-frontmatter-spec.md). Do not
apply that host-specific schema when a manifest, generator, or another host owns
metadata.

## 6. Write the instructions

Read [prompting best practices](references/prompting-best-practices.md) when the
skill must steer non-trivial reasoning, tool use, output shape, long context, or
agentic behavior. Apply only the sections relevant to the target and branch.

Write the positive target behavior first. Use a prohibition only for a hard
guardrail that cannot be expressed positively, and pair it with the permitted
behavior. Explain non-obvious reasons, calibrate specificity to risk, and use an
example only when direct prose leaves the desired behavior ambiguous.

Keep tests, evals, baselines, benchmarks, graders, comparison viewers, and
trigger optimization outside this skill's static authoring scope.

## 7. Prune the package

Apply the
[content-maintenance rules](references/skill-best-practices.md#content-maintenance)
after instructions and resources exist. Remove every rejected item before
verification.

## 8. Verify and hand off

1. Inspect the final tree and diff for unintended or generated-file edits.
2. Apply the
   [static quality checklist](references/skill-best-practices.md#static-quality-checklist)
   to `SKILL.md` and every changed resource. Correct every violation.
3. Report what changed, where it changed, the exact checks and results,
   unavailable checks, generated effects, and remaining uncertainty. Do not
   claim unmeasured behavioral effectiveness.

Complete the task when the authored package is structurally valid, generated
outputs are current, foreign work remains preserved, and the handoff accounts
for every changed surface and verification boundary.
