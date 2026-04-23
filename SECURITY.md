# Security Policy

The scope of this repository is a **public, static personal website** for
Cyrille Tabe, built with Astro and hosted on GitHub Pages. There is no
server runtime, no database, no user accounts, no authentication, and no
user-supplied inputs that reach persistent storage. The site is HTML,
CSS, images, fonts, and client-side JavaScript only.

## Reporting a vulnerability

If you believe you've found a security issue — a vulnerable dependency,
a cross-site-scripting vector, a data exposure, a supply-chain concern,
or anything that could harm a visitor — please email:

**cyrilletabe@gmail.com**

Include:

- A concise description of the issue and its impact.
- Steps to reproduce (URL, exact input, browser/OS where relevant).
- Any proof-of-concept code or payload, clearly labelled.
- Whether you'd like credit in a future fix note (optional).

Please **do not** open a public GitHub issue or pull request that
describes an exploitable flaw before it has been fixed. I will
acknowledge receipt within **7 calendar days** and aim to ship a fix or
a mitigation plan within **30 days** of acknowledgement, depending on
severity and complexity.

## Scope

In scope:

- The built site deployed to the `gh-pages` / Pages deployment of this
  repository, under the domain(s) that resolve to it (e.g.
  `cyrilletabe.github.io/*` or the custom domain once configured).
- The repository source: layouts, components, scripts in `scripts/`,
  build configuration.
- Third-party scripts loaded at runtime — currently **none in
  production** (Plausible is present but commented out in
  `BaseLayout.astro` until a domain is live).

Out of scope:

- Reports that require physical access to Cyrille's machines.
- Issues in unmaintained forks or copies of this repository.
- Denial-of-service or rate-limit complaints against third parties
  (GitHub Pages, DNS, Cloudflare) — take those up with them directly.
- Missing defence-in-depth headers that are not settable on GitHub
  Pages (HSTS, `X-Frame-Options`, `X-Content-Type-Options`). These are
  documented in `docs/qa/14-security-edge.md` with a migration path.
- Social-engineering reports that do not reveal a technical weakness.

## Supported versions

Only the currently deployed `main` branch is supported. Older commits
and branches receive no patches. If you find an issue in a historical
revision, confirm it still reproduces on `main` before reporting.

## Responsible disclosure

I'll work with reporters who act in good faith: test against your own
browsers/accounts, avoid destructive payloads, avoid pivoting to
third-party infrastructure, and keep findings private until a fix is
deployed. In exchange I'll acknowledge the report, credit you if you
want it, and publish a short post-mortem for any high-severity finding.

---

*This policy is intentionally narrow because the site is static.
Treat it as a contact-and-scope document, not as a bug-bounty program.*
