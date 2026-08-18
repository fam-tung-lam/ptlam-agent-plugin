# Security Policy

## Supported versions

Security fixes are applied to the latest GitHub release and the `main` branch.
Older releases do not receive security updates.

| Version               | Supported |
| --------------------- | --------- |
| Latest GitHub release | Yes       |
| `main`                | Yes       |
| Older releases        | No        |

## Report a vulnerability

Do not open a public issue or discussion for a suspected vulnerability.

Email [fam.tung.lam@gmail.com](mailto:fam.tung.lam@gmail.com) with the subject
`[ptlam-agent-plugin security]` and include:

- the affected version, commit, skill, or file;
- a description of the vulnerability and its potential impact;
- minimal steps or a proof of concept that reproduces the issue;
- any known mitigations or workarounds; and
- whether you want to be credited in a future advisory.

Remove credentials, personal data, and unrelated sensitive information from the
report. If a secret has been exposed, revoke or rotate it before reporting the
incident.

The maintainer will acknowledge the report within five business days, assess its
scope and severity, and coordinate remediation and disclosure with the reporter.
Please allow a reasonable remediation period before publishing the
vulnerability.

## Scope

This policy covers vulnerabilities in this repository's authored plugin, skills,
generated artifacts, release process, and direct integration with the plugin
compiler.

Report vulnerabilities in the compiler itself to the
[`ptlam-agent-plugin-compiler`](https://github.com/fam-tung-lam/ptlam-agent-plugin-compiler)
repository. Report vulnerabilities in an agent host, package manager, or other
third-party dependency to that project's maintainers. If the correct owner is
unclear, use the private contact above and the maintainer will help route the
report.

Ordinary bugs, documentation problems, and feature requests belong in the
project's
[public issue tracker](https://github.com/fam-tung-lam/ptlam-agent-plugin/issues).

## Safe research

When investigating a possible vulnerability:

- use only accounts, data, and systems you own or have permission to test;
- avoid privacy violations, data destruction, service degradation, and social
  engineering; and
- stop testing and report the issue if you encounter personal data, credentials,
  or access beyond what is necessary to demonstrate the vulnerability.
