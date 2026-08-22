# Contributing to ptlam-agent-plugin

You can help by reporting plugin problems, proposing skills, improving
documentation, or submitting focused skill changes.

## Before you start

1. Search existing
   [issues](https://github.com/fam-tung-lam/ptlam-agent-plugin/issues) and
   [pull requests](https://github.com/fam-tung-lam/ptlam-agent-plugin/pulls) to
   avoid duplicate work.
2. Open an issue before investing in a substantial new skill or behavior change.
   Small fixes can go directly to a pull request.
3. Read the [development guide](docs/DEVELOPMENT.md) before changing files.
4. Keep the contribution focused on one problem or outcome.

Do not include credentials, personal data, proprietary material, or content you
do not have permission to contribute.

## Report a problem

A useful bug report includes:

- the affected skill, command, or documentation path;
- the exact repository revision or plugin version;
- the agent, host, operating system, and Node.js version when relevant;
- minimal reproduction steps;
- expected and actual behavior; and
- logs or screenshots with secrets and personal data removed.

## Propose a skill

Describe:

- the user problem the skill would solve;
- when an agent should and should not use it;
- why an existing skill does not cover the problem; and
- one or two representative user requests.

## Make a change

1. Fork the repository and branch from current `main`.
2. Follow the setup steps in the [development guide](docs/DEVELOPMENT.md).
3. Edit authored skills under `plugin/skills/`, catalog data in
   `plugin/plugin.yml`, tests, or documentation. Do not edit generated files
   under `skills/`, `.claude-plugin/`, or `.codex-plugin/` by hand.
4. Record notable user or developer changes under `Unreleased` in
   `CHANGELOG.md`.
5. Add or update tests for behavior changes.
6. Run `npm run plugin:compile` after changing a skill or catalog data, and
   include the generated files in the pull request.
7. Run the complete [quality gates](docs/DEVELOPMENT.md#quality-gates).

## Commits and pull requests

Write concise commit titles that state the outcome, for example:

```text
feat(ptlam-agent-plugin): introduce <skill-name> skill to <purpose>
fix(compiler-integration): adopt a corrected package
docs: separate contributor and development guidance
```

A pull request should include:

- the problem and why the change is needed;
- the solution and any user-visible effects;
- the exact validation commands run; and
- related issues, if any.

Before requesting review, confirm that:

- [ ] Authored and generated files are in sync.
- [ ] Tests cover changed behavior.
- [ ] All local quality gates pass.
- [ ] Documentation and examples match the implemented behavior.
- [ ] The pull request contains no unrelated files, secrets, or private data.

## Review and licensing

Follow the project [Code of Conduct](CODE_OF_CONDUCT.md) in issues, pull
requests, and reviews. Report security vulnerabilities through the private
process in [SECURITY.md](SECURITY.md), not a public issue.

By contributing, you agree that your contribution is provided under the
project's [MIT License](LICENSE).
