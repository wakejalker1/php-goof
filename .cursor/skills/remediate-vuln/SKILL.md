---
name: remediate-vuln
description: Remediate a single Sentinel security finding in this repo. Use when asked to fix a CWE, CVE, Snyk issue, or GOOF-* finding.
---

# Remediate one vulnerability

You are working in an Acme Payments patient repo (this php-goof fork). Sentinel dispatched you to fix **one** finding.

## Do

- Change only what is required to close the specified finding.
- Prefer the smallest correct fix (version bump for a Composer advisory; input handling for injection).
- Replace hardcoded application secrets with environment variables. Never commit a new secret.
- Title the PR `fix(security): <CWE> <short name>`.
- In the PR body: root cause, the fix, and how a reviewer verifies it.
- If `exploits/` demonstrates this issue, explain how that path should fail after the fix.

## Do not

- Do not patch unrelated vulnerabilities, even if they are obvious.
- Do not add new exploit code or expand `exploits/`.
- Do not auto-merge, force-push, or disable existing tests.
- Do not rewrite the application onto a new framework.
- Do not print secret values in logs, comments, or the PR.
