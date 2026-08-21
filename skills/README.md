## Available skills

| Skill                                      | Category             | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | Visibility | Status | Replacement |
| ------------------------------------------ | -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | ------ | ----------- |
| `ptlam-setup`                              | Utilities            | Install or refresh PTLam's general agent instructions for a project.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | public     | Active | —           |
| `ptlam-git`                                | Engineering          | Carry out repository-local Git commit, worktree, and conflict-resolution workflows without disturbing unrelated work. Use when creating a commit, writing or revising a commit message, creating or managing a worktree, deciding whether a repository write belongs in the current checkout or a new linked worktree, or resolving an in-progress merge or rebase conflict.                                                                                                                                                                                                                                                                                                                   | public     | Active | —           |
| `ptlam-implementing`                       | Engineering          | Deliver one bounded software change through task-specific worker agents and independent reviewer agents in a dedicated Git worktree. Use when asked to implement from the current prompt or confirmed session context. Use when given a specification, ticket file, issue, or equivalent task link. Do not use for a read-only explanation, plan, diagnosis, or review.                                                                                                                                                                                                                                                                                                                        | public     | Active | —           |
| `ptlam-prototyping`                        | Engineering          | Build one throwaway prototype to answer a design question. Use when a user wants to test a state model, business logic, or data shape through a shareable HTML demo, or explore a UI through structurally different variants on one route. Works from scratch or beside an existing module or page. Do not use for an MVP, production feature, technical benchmark, or durable demo.                                                                                                                                                                                                                                                                                                           | public     | Active | —           |
| `ptlam-code-style-dart`                    | Engineering          | Write, review, and fix Dart library and application code against conventions for language mechanics, package layout, the analyzer and formatter toolchain, dartdoc comments, and package:test tests. Use when starting or standardizing a Dart package, changing Dart code or its analysis options, reviewing Dart-specific design, or resolving a dart analyze, dart format, or dart test failure. Apply ptlam-code-style first for the standard these mechanics satisfy. Use as the foundation for Dart framework and project specializations. Do not use for non-Dart code.                                                                                                                 | public     | Active | —           |
| `ptlam-code-style-kotlin`                  | Engineering          | Write, review, and fix Kotlin library and application code against conventions for language mechanics, null safety, coroutines, the Gradle, ktlint, and detekt toolchain, KDoc comments, and JUnit tests. Use when starting or standardizing a Kotlin module, changing Kotlin code or its build and lint configuration, reviewing Kotlin-specific design, or resolving a ktlint, detekt, or JUnit failure. Apply ptlam-code-style first for the standard these mechanics satisfy. Use as the foundation for Kotlin platform and project specializations. Do not use for Java or for another JVM language.                                                                                      | public     | Active | —           |
| `ptlam-code-style-swift`                   | Engineering          | Write, review, and fix Swift library and application code against conventions for language mechanics, optionals, error handling, structured concurrency and actor isolation, the Swift Package Manager, SwiftFormat, and SwiftLint toolchain, documentation comments, and tests. Use when starting or standardizing a Swift package, changing Swift code or its lint and format configuration, reviewing Swift-specific design, or resolving a swift build, SwiftLint, or SwiftFormat failure. Apply ptlam-code-style first for the standard these mechanics satisfy. Use as the foundation for Swift platform and project specializations. Do not use for Objective-C.                        | public     | Active | —           |
| `ptlam-code-style-flutter`                 | Engineering          | Write, review, and fix Flutter application code against conventions for the toolchain, layer boundaries, source tree, widgets, models, networking, storage, localization, logging, widget documentation, and tests. Use when adding or changing Flutter code, choosing between setState, Cubit, and Bloc, placing a new file or feature, wiring get_it or go_router, or fixing a flutter analyze or build_runner failure. Apply ptlam-code-style-dart first for the Dart language, package, and tooling mechanics. Do not use this specialization for Dart outside Flutter or for another stack.                                                                                               | public     | Active | —           |
| `ptlam-code-style-python`                  | Engineering          | Write, review, and fix Python library and application code against conventions for language mechanics, project structure, tooling, and tests. Use when starting or standardizing a Python project, changing Python code or its toolchain, reviewing Python-specific design, or resolving code-quality and test failures. Apply ptlam-code-style first for the standard these mechanics satisfy. Use as the foundation for Python framework specializations. Do not use for non-Python code.                                                                                                                                                                                                    | public     | Active | —           |
| `ptlam-code-style-python-fastapi`          | Engineering          | Write, review, and fix FastAPI application code against conventions for service and feature-package structure, application lifespan, routes, request and response contracts, dependency injection, use cases, feature boundaries, model registration, concurrency, errors, observability, and API tests. Use when starting or reorganizing a FastAPI service or feature, adding or changing endpoints, use cases, dependencies, exception handlers, middleware, schemas, SQLAlchemy registration, background handoffs, or tests, or fixing OpenAPI and runtime failures. Apply ptlam-code-style-python first for the Python mechanics. Do not use for Python services that do not use FastAPI. | public     | Active | —           |
| `ptlam-code-style-typescript`              | Engineering          | Write, review, and fix TypeScript library and application code against conventions for language mechanics, module boundaries, tooling, and tests. Use when starting or standardizing a TypeScript project, changing TypeScript code or its toolchain, reviewing TypeScript-specific design, or resolving type-check, lint, or Vitest failures. Apply ptlam-code-style first for the standard these mechanics satisfy. Use as the foundation for TypeScript framework specializations. Do not use for non-TypeScript code.                                                                                                                                                                      | public     | Active | —           |
| `ptlam-creating-skill`                     | Engineering          | Create, review, or refactor one agent skill so that a human maintainer can read it once and change it later. Use when turning a workflow or reference set into a new skill, revising an existing SKILL.md, splitting a skill that grew too broad, or auditing a package without editing it. Use as the foundation for skills that specialize skill authoring.                                                                                                                                                                                                                                                                                                                                  | public     | Active | —           |
| `ptlam-reviewing-code`                     | Engineering          | Review one bounded code changeset and return an evidence-backed, prioritized findings report and readiness verdict. Use when reviewing a pull request, branch, commit range, or explicit revision comparison. Use when reviewing staged, unstaged, or untracked working-tree changes. Use when judging an implementation against a task, issue, or specification. Compose this skill when a stack or project review needs the general review standard.                                                                                                                                                                                                                                         | public     | Active | —           |
| `ptlam-grilling`                           | Productivity         | Stress-test a plan, decision, or idea through a persistent interview that resolves one user-owned decision at a time, records confirmed understanding for later continuation, sharpens contested business terms, and captures decisions that are expensive to reverse.                                                                                                                                                                                                                                                                                                                                                                                                                         | public     | Active | —           |
| `ptlam-creating-prd`                       | Productivity         | Create one product requirements document from a confirmed grilling record or durable product brief for a new product or large epic. Use when product framing, audience, outcomes, scope, non-goals, and success measures must become a durable handoff before feature specifications. Start an existing-product feature at ptlam-creating-spec; skip this pipeline for a small fix.                                                                                                                                                                                                                                                                                                            | public     | Active | —           |
| `ptlam-creating-spec`                      | Productivity         | Create one buildable feature specification from a confirmed PRD scope item or a feature brief inside an existing product. Use when behavior, boundaries, failure handling, interfaces, data, rollout constraints, and required evidence must be fixed before ticket planning. Start a new product or large epic with ptlam-creating-prd; skip this pipeline for a small fix.                                                                                                                                                                                                                                                                                                                   | public     | Active | —           |
| `ptlam-planning-tickets`                   | Productivity         | Turn one ready feature specification into an ordered set of vertically sliced ticket files with explicit blocking edges. Use after a feature spec is ready for implementation planning. A new product or large epic starts at ptlam-creating-prd, an existing-product feature starts at ptlam-creating-spec, and a small fix skips this pipeline.                                                                                                                                                                                                                                                                                                                                              | public     | Active | —           |
| `ptlam-modeling-domain`                    | Productivity         | Model project business language, context boundaries, and business processes in CONTEXT.md. Use when a business term is contested, overloaded, or newly coined, when two business contexts use one term differently, or when a business process needs a durable map. Do not use for code types, storage schemas, or serialization mechanics.                                                                                                                                                                                                                                                                                                                                                    | public     | Active | —           |
| `ptlam-creating-adr`                       | Engineering          | Decide whether a crystallized architectural choice warrants a durable architecture decision record and write the qualifying ADR. Use when a decision constrains future architecture, is expensive to reverse, affects a published boundary, or carries material rejected alternatives. Do not use for local implementation choices with cheap reversal.                                                                                                                                                                                                                                                                                                                                        | public     | Active | —           |
| `ptlam-creating-atomic-note`               | Productivity         | Create, mature, review, split, or merge durable atomic notes by identifying one knowledge building block, preserving useful context, and following local vault conventions.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | public     | Active | —           |
| `ptlam-scraping-urls`                      | Utilities            | Batch-scrape URLs supplied in a prompt or input file into cached local Markdown files with configurable output, concurrency, and cache lifetime.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | public     | Active | —           |
| `ptlam-explaining`                         | Productivity         | Explain concepts, mechanisms, and systems through a verified literal model and an explanatory device matched to the learner's difficulty. Use when a learner needs an unfamiliar, abstract, or complex concept made usable, and when a request explicitly asks for a real-life analogy with a stable mapping table, a short story, and explicit caveats. Select the analogy device only on that explicit ask; a request to explain, define, simplify, or break down a concept is not that ask.                                                                                                                                                                                                 | public     | Active | —           |
| `ptlam-mermaiding`                         | Productivity         | Create, revise, or review Mermaid diagrams whose type, structure, notation, and layout preserve the source relationships and remain readable in raw Markdown. Use directly or from another skill when the output needs a swimlane, flowchart, class, state, ER, sequence, quadrant, mindmap, kanban, architecture, or tree-view diagram.                                                                                                                                                                                                                                                                                                                                                       | public     | Active | —           |
| `ptlam-visualization-with-html`            | Productivity         | Create or revise one portable HTML explainer that renders a verified explanation as an accessible, optionally interactive artifact using native web technologies and Material 3 Expressive.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | public     | Active | —           |
| `ptlam-health-connector-architecture`      | Health Connector SDK | Explain and judge the Health Connector SDK's structure across its Melos packages, Dart API surfaces, Pigeon contracts, Android Health Connect layers, iOS HealthKit layers, failure boundaries, concurrency, and platform limits. Use when tracing a call, deciding where behavior belongs, evaluating a boundary or public API change, or answering how the SDK works internally. Do not use for diagnosing one failure, setting up a checkout, reviewing a whole diff, or implementing a health data type.                                                                                                                                                                                   | public     | Active | —           |
| `ptlam-health-connector-setup`             | Health Connector SDK | Set up or repair a local Health Connector SDK checkout with its pinned Flutter, Java, and Ruby toolchains, Melos workspace links, Android tools, and macOS-only Swift tools, then prove the available development lanes. Runs only when explicitly requested. Use when bootstrapping a clone, repairing missing dependencies, or preparing a machine to contribute. Do not use for a runtime defect or an already-working checkout's lint failure.                                                                                                                                                                                                                                             | public     | Active | —           |
| `ptlam-health-connector-debug`             | Health Connector SDK | Diagnose Health Connector SDK failures by reproducing the narrowest Dart, Pigeon, Android Health Connect, or iOS HealthKit path and tracing logs, error codes, generated contracts, handlers, permissions, and platform prerequisites to one failing boundary. Use when a call throws, returns the wrong record or status, hangs, crashes, loses native logs, or behaves differently across platforms. Do not use for toolchain bootstrap, style checks, or a review of an otherwise-working changeset.                                                                                                                                                                                        | public     | Active | —           |
| `ptlam-health-connector-review`            | Health Connector SDK | Review one Health Connector SDK changeset for project-specific public API, cross-platform, generated-code, privacy, language-convention, test, documentation, and release risks. Use when a code review reaches Health Connector packages, Pigeon contracts, Android Health Connect, or iOS HealthKit. Apply ptlam-reviewing-code for the review surface, finding standard, and verdict. Do not use for fixing findings or diagnosing one failing run.                                                                                                                                                                                                                                         | public     | Active | —           |
| `ptlam-health-connector-data-type`         | Health Connector SDK | Add or extend one Health Connector health data type and record across the core Dart model, public exports, platform annotations, Pigeon contracts, Dart mappers, Android Health Connect handlers, iOS HealthKit handlers, and applicable tests. Use when introducing a record type, adding one platform to an existing type, changing its capabilities, or repairing an incomplete end-to-end registration. Do not use for an unrelated SDK feature or a language-only refactor.                                                                                                                                                                                                               | public     | Active | —           |
| `ptlam-health-connector-code-style-dart`   | Health Connector SDK | Write, review, and fix Dart source and tests in the Health Connector SDK against its analyzer rules, formatter contract, imports, visibility, documentation shape, structured logging syntax, and package-specific test layout. Use when editing Dart code, changing the shared lint package, or fixing a Dart format, analysis, documentation, or test-convention failure. Apply ptlam-code-style-dart first. Do not use for workspace architecture, public API design, Pigeon ownership, platform support, or an end-to-end health data type change.                                                                                                                                         | public     | Active | —           |
| `ptlam-health-connector-code-style-kotlin` | Health Connector SDK | Write, review, and fix Kotlin source and tests in Health Connector's Android package against its visibility, file and declaration shape, import order, structured logging syntax, ktlint and detekt configuration, and JUnit 5, MockK, Kotest, and coroutine-test conventions. Use when editing Kotlin code or fixing a Kotlin formatting, analysis, or test-convention failure. Apply ptlam-code-style-kotlin first. Do not use for Android architecture, Health Connect behavior, Pigeon ownership, or end-to-end handler registration.                                                                                                                                                      | public     | Active | —           |
| `ptlam-health-connector-code-style-swift`  | Health Connector SDK | Write, review, and fix Swift source in Health Connector's iOS package against its access, declaration and extension shape, structured logging syntax, SwiftLint baseline, and SwiftFormat configuration. Use when editing Swift code or fixing a Swift analysis, formatting, or native logging convention failure. Apply ptlam-code-style-swift first. Do not use for iOS architecture, HealthKit behavior, Pigeon threading, failure translation, or end-to-end handler registration.                                                                                                                                                                                                         | public     | Active | —           |

## Skill dependency graph

Arrows point from a dependent skill to the skill it requires.

```mermaid
---
config:
  htmlLabels: false
---
flowchart TB
    subgraph SkillCategory0["Engineering"]
        SkillNode1["`
            ptlam-git
            (active/public)
        `"]
        SkillNode2["`
            ptlam-implementing
            (active/public)
        `"]
        SkillNode3["`
            ptlam-prototyping
            (active/public)
        `"]
        SkillNode4["`
            ptlam-code-style
            (active/internal)
        `"]
        SkillNode5["`
            ptlam-code-style-dart
            (active/public)
        `"]
        SkillNode6["`
            ptlam-code-style-kotlin
            (active/public)
        `"]
        SkillNode7["`
            ptlam-code-style-swift
            (active/public)
        `"]
        SkillNode8["`
            ptlam-code-style-flutter
            (active/public)
        `"]
        SkillNode9["`
            ptlam-code-style-python
            (active/public)
        `"]
        SkillNode10["`
            ptlam-code-style-python-fastapi
            (active/public)
        `"]
        SkillNode11["`
            ptlam-code-style-typescript
            (active/public)
        `"]
        SkillNode12["`
            ptlam-creating-skill
            (active/public)
        `"]
        SkillNode13["`
            ptlam-reviewing-code
            (active/public)
        `"]
        SkillNode19["`
            ptlam-creating-adr
            (active/public)
        `"]
    end
    subgraph SkillCategory1["Productivity"]
        SkillNode14["`
            ptlam-grilling
            (active/public)
        `"]
        SkillNode15["`
            ptlam-creating-prd
            (active/public)
        `"]
        SkillNode16["`
            ptlam-creating-spec
            (active/public)
        `"]
        SkillNode17["`
            ptlam-planning-tickets
            (active/public)
        `"]
        SkillNode18["`
            ptlam-modeling-domain
            (active/public)
        `"]
        SkillNode20["`
            ptlam-creating-atomic-note
            (active/public)
        `"]
        SkillNode22["`
            ptlam-explaining
            (active/public)
        `"]
        SkillNode23["`
            ptlam-mermaiding
            (active/public)
        `"]
        SkillNode24["`
            ptlam-visualization-with-html
            (active/public)
        `"]
    end
    subgraph SkillCategory2["Utilities"]
        SkillNode0["`
            ptlam-setup
            (active/public)
        `"]
        SkillNode21["`
            ptlam-scraping-urls
            (active/public)
        `"]
    end
    subgraph SkillCategory3["Health Connector SDK"]
        SkillNode25["`
            ptlam-health-connector-architecture
            (active/public)
        `"]
        SkillNode26["`
            ptlam-health-connector-setup
            (active/public)
        `"]
        SkillNode27["`
            ptlam-health-connector-debug
            (active/public)
        `"]
        SkillNode28["`
            ptlam-health-connector-review
            (active/public)
        `"]
        SkillNode29["`
            ptlam-health-connector-data-type
            (active/public)
        `"]
        SkillNode30["`
            ptlam-health-connector-code-style-dart
            (active/public)
        `"]
        SkillNode31["`
            ptlam-health-connector-code-style-kotlin
            (active/public)
        `"]
        SkillNode32["`
            ptlam-health-connector-code-style-swift
            (active/public)
        `"]
    end
    SkillNode2 --> SkillNode1
    SkillNode2 --> SkillNode13
    SkillNode3 --> SkillNode1
    SkillNode5 --> SkillNode4
    SkillNode6 --> SkillNode4
    SkillNode7 --> SkillNode4
    SkillNode8 --> SkillNode5
    SkillNode9 --> SkillNode4
    SkillNode10 --> SkillNode9
    SkillNode11 --> SkillNode4
    SkillNode12 --> SkillNode23
    SkillNode13 --> SkillNode4
    SkillNode14 --> SkillNode18
    SkillNode14 --> SkillNode19
    SkillNode15 --> SkillNode22
    SkillNode15 --> SkillNode23
    SkillNode16 --> SkillNode22
    SkillNode16 --> SkillNode23
    SkillNode17 --> SkillNode22
    SkillNode17 --> SkillNode23
    SkillNode18 --> SkillNode23
    SkillNode19 --> SkillNode22
    SkillNode19 --> SkillNode23
    SkillNode24 --> SkillNode22
    SkillNode27 --> SkillNode25
    SkillNode28 --> SkillNode13
    SkillNode28 --> SkillNode25
    SkillNode28 --> SkillNode30
    SkillNode28 --> SkillNode31
    SkillNode28 --> SkillNode32
    SkillNode29 --> SkillNode25
    SkillNode29 --> SkillNode30
    SkillNode29 --> SkillNode31
    SkillNode29 --> SkillNode32
    SkillNode30 --> SkillNode5
    SkillNode31 --> SkillNode6
    SkillNode32 --> SkillNode7
    classDef publicSkill fill:#dbeafe,stroke:#1d4ed8,color:#172554
    classDef internalSkill fill:#f3f4f6,stroke:#4b5563,color:#111827,stroke-dasharray:5 5
    classDef deprecatedSkill fill:#fef3c7,stroke:#b45309,color:#78350f
    class SkillNode0 publicSkill
    class SkillNode1 publicSkill
    class SkillNode2 publicSkill
    class SkillNode3 publicSkill
    class SkillNode4 internalSkill
    class SkillNode5 publicSkill
    class SkillNode6 publicSkill
    class SkillNode7 publicSkill
    class SkillNode8 publicSkill
    class SkillNode9 publicSkill
    class SkillNode10 publicSkill
    class SkillNode11 publicSkill
    class SkillNode12 publicSkill
    class SkillNode13 publicSkill
    class SkillNode14 publicSkill
    class SkillNode15 publicSkill
    class SkillNode16 publicSkill
    class SkillNode17 publicSkill
    class SkillNode18 publicSkill
    class SkillNode19 publicSkill
    class SkillNode20 publicSkill
    class SkillNode21 publicSkill
    class SkillNode22 publicSkill
    class SkillNode23 publicSkill
    class SkillNode24 publicSkill
    class SkillNode25 publicSkill
    class SkillNode26 publicSkill
    class SkillNode27 publicSkill
    class SkillNode28 publicSkill
    class SkillNode29 publicSkill
    class SkillNode30 publicSkill
    class SkillNode31 publicSkill
    class SkillNode32 publicSkill
```
