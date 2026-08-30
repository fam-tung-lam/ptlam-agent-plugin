# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/2.0.0/),
and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Fixed

- Placed DTOs in `application/dtos/` across the layout, architecture,
  model, and networking guidance.

## [0.4.0] - 2026-08-30

### Added

- Added an architecture skill that answers one system-level question with a
  suitability judgment: a framed solution space, positioned options, a
  recommendation sized for the next order of magnitude, and its trade-offs,
  assumptions, deferred concerns, and redesign trigger.

- Added a NestJS TypeScript code-style specialization for feature-first
  hexagonal structure, application use cases and DTOs, domain types,
  infrastructure adapters, presentation entry points, integrations, modules,
  dependency injection, lifecycle, operations, and Nest testing.

### Changed

- Updated the plugin compiler to `0.4.0-alpha.1` and set the exclusive skill
  dependency-depth boundary to `4`.
- Grouped authored skills under engineering, product-development, productivity,
  and project directories while keeping `ptlam-creating-skill` at the authored
  root and generated installation paths flat.
- Kept architecture judgments and architecture decision records as separate
  capabilities. A confirmed judgment is now handoff evidence for a later record
  workflow instead of loading that workflow automatically.
- Rewrote every authored skill and reference for plain language and one
  consistent shape: a two-to-four-sentence outcome, one Mermaid diagram of the
  whole path, numbered steps that each end in an observable result, and one
  closing finish condition. `ptlam-creating-skill` now records that template.
- Reserved user-only invocation for skills a person must start. `explaining`,
  `mermaiding`, `scraping-urls`, and `visualizing-with-html` are model-invocable
  again, so a skill that depends on them can actually load them.
- Moved every dependency name out of skill bodies and into `plugin/plugin.yml`,
  which is the only place a required skill may be named. Skill text now says
  what is outside its scope instead of naming the neighbor.
- Gave `ptlam-implementing` a disposal step for worker worktrees after
  integration, and a diagnosis dependency so a defect fix starts from a
  demonstrated cause.
- Replaced `ptlam-researching`'s dependency on the whole implementation
  orchestrator with a direct Git dependency.
- Made `ptlam-code-style` public, so a project with no matching stack
  specialization still gets the foundation.
- Regrouped categories by layer of work: deciding, specifying, building,
  conventions, communicating, utilities, and the Health Connector project.
- Renamed four skills so one verb names one job across the catalog:
  `ptlam-visualization-with-html` to `ptlam-visualizing-with-html`,
  `ptlam-health-connector-debug` to `ptlam-health-connector-diagnosing`,
  `ptlam-health-connector-review` to `ptlam-health-connector-reviewing`, and
  `ptlam-health-connector-data-type` to
  `ptlam-health-connector-adding-data-type`. The development guide records the
  naming shapes.
- Moved `PTLAM_AGENTS.md` from `references/` to `assets/`, because `ptlam-setup`
  installs it verbatim rather than reading it as guidance.
- Merged fourteen single-purpose fragments into the files that own their
  workflow, and dropped the duplicated Flutter version policy and generated-file
  rules.
- Dropped user-facing paths that embedded a category segment, which is manifest
  metadata rather than a directory.
- Feature specification creation now composes the architecture skill whenever a
  contract element fixes a structure that is expensive to reverse, records the
  result under a new architecture-constraints section, and blocks on an
  unconfirmed recommendation.
- Grilling now composes the architecture skill: a decision that fixes a
  structure expensive to reverse takes its recommendation, strongest
  alternative, and trade-off from the suitability judgment; the user decides.
- Implementing now stops on a change to a component, runtime, or data-store
  split, a published surface, state ownership, or a platform commitment that no
  spec, ADR, or confirmed decision covers, and routes it to the architecture
  skill.
- Diagnosing names the architecture skill as the handoff when the demonstrated
  cause is a misplaced boundary, a missing or shared state owner, or a
  published-surface contract that cannot hold.
- ADR creation prefers an architecture judgment as its evidence source, maps its
  fields onto ADR sections, and qualifies on the same expensive-to-reverse
  structures.
- Ticket planning maps deferred concerns as work no ticket owns and slices a
  migration as expand, migrate, contract with each stage shippable.
- PRD creation captures demand, growth, platform and compliance limits,
  lifespan, and cost of failure as numbered product facts.
- Code-style boundaries, structure, evolution, and complexity guidance name the
  architecture skill as the owner of component splits, published surfaces, and
  expensive-to-reverse decisions, and share its defer-until-a-signal vocabulary.
- Changeset review reads the architecture skill's judging-suitability standard
  when a change introduces a component, runtime, or data-store split, a
  published surface, state ownership, or a platform commitment.
- Domain modeling names its context boundaries as candidate component boundaries
  for the architecture skill and receives contested terms back.
- Health Connector architecture composes the architecture skill for judging
  where a change belongs, supplies its project constraints as inputs, and keeps
  a contract-conformance check for a change inside one layer.
- Renamed `ptlam-code-style-flutter` to `ptlam-code-style-dart-flutter` and
  restructured its guidance with FastAPI around feature-local application,
  domain, infrastructure, and presentation layers. Flutter BLoCs and Cubits live
  in presentation, and FastAPI domain entities stay separate from SQLAlchemy
  persistence models.

## [0.3.0] - 2026-08-24

### Added

- Added a read-only diagnosis foundation that returns a cause whose mechanism at
  the first failing boundary is demonstrated by named observations or a
  discriminating check after excluding every remaining evidence-supported
  alternative, or an exact evidence blocker and one discriminating next check.
- Added a research skill that traces one bounded question to high-trust primary
  sources and delivers an independently reviewed portable HTML evidence report.

### Changed

- Health Connector debugging now composes the shared diagnosis contract and
  keeps only SDK-specific evidence mechanics.
- Git guidance now requires commit bodies for breaking changes, security fixes,
  migrations, and reverts.
- GitHub Release creation now waits for approval through the protected
  `github-release` environment after CI and release detection pass.
- Expanded the shared code-style foundation with complexity rules for choosing
  sufficient implementations and preserving behavior while deleting, reusing,
  substituting, or abstracting code. General changeset review applies those
  rules through its existing code-style dependency.

## [0.2.0] - 2026-08-22

### Added

- Added an implementation-orchestration skill that turns prompts, session
  context, specifications, tickets, and issues into isolated worker worktrees,
  independent reviews, and evidence-led repair loops.
- Added a prototyping skill for building shareable logic demos or switchable UI
  variants that answer one design question before production implementation.
- Added a maintained changelog as the source for curated GitHub Release notes.
- Added Dart, Kotlin, and Swift code-style foundations for the language and
  toolchain mechanics that the shared code-style standard leaves open.
- Added a Health Connector SDK category holding project-specific Dart, Kotlin,
  and Swift code-style skills for that plugin monorepo.
- Added Health Connector skills for architecture, development setup, runtime
  diagnosis, changeset review, and end-to-end health data type implementation.
- Added a general code-review foundation that scopes one changeset, separates
  intent from conventions, examines risk, and reports evidence-backed findings
  with a readiness verdict.

### Changed

- Focused the contribution guide on the information plugin users need to report
  problems, propose skills, and submit changes.
- Expanded the Git skill with an evidence-led workflow for resolving and
  completing in-progress merge and rebase conflicts.
- Updated the plugin compiler to 0.2.3 and regenerated its owned outputs.
- Renamed the Health Connector language code-style skills so the shared project
  prefix keeps the complete skill family adjacent in skill listings.
- Expanded the setup skill contract with clearer communication, project
  instruction, and compatibility guidance.
- Flutter code-style guidance now builds on the Dart foundation instead of
  owning Dart language and tooling mechanics itself.
- Release CI now requires a dated changelog section and current comparison links
  for every version change.
- Split Health Connector architecture, platform behavior, Pigeon workflows, and
  feature construction out of the three language code-style skills so those
  skills own language conventions only.
- Composed the Health Connector changeset review with the general code-review
  foundation so project guidance owns only SDK-specific risks.

## [0.1.0] - 2026-08-18

### Added

- Added product-planning skills that carry work from problem discovery through
  requirements, specifications, domain models, architecture decisions, and
  implementation tickets.
- Added shared and stack-specific code-style guidance for TypeScript, Flutter,
  Python, and FastAPI projects.
- Added focused skills for Git and worktree workflows, testing, Mermaid
  diagrams, URL scraping, and reusable agent-skill authoring.

### Changed

- Promoted the portable skill catalog from alpha to the first stable release.
- Made skill contracts self-contained and composable across supported agents.

## [0.1.0-alpha.1] - 2026-08-12

### Added

- Published the first prerelease of the portable PTLam skill catalog for Claude
  Code, Codex, GitHub Copilot CLI, Gemini CLI, Kimi Code CLI, and Agent Skills
  compatible hosts.

[Unreleased]:
  https://github.com/fam-tung-lam/ptlam-agent-plugin/compare/v0.4.0...HEAD
[0.4.0]:
  https://github.com/fam-tung-lam/ptlam-agent-plugin/compare/v0.3.0...v0.4.0
[0.3.0]:
  https://github.com/fam-tung-lam/ptlam-agent-plugin/compare/v0.2.0...v0.3.0
[0.2.0]:
  https://github.com/fam-tung-lam/ptlam-agent-plugin/compare/v0.1.0...v0.2.0
[0.1.0]:
  https://github.com/fam-tung-lam/ptlam-agent-plugin/compare/v0.1.0-alpha.1...v0.1.0
[0.1.0-alpha.1]:
  https://github.com/fam-tung-lam/ptlam-agent-plugin/releases/tag/v0.1.0-alpha.1
