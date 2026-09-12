# Repository Working Agreement

## Scope

This repository implements bl.Studio. Durable general knowledge belongs in `benpham-216/knowledge-base`; source managed by the studio remains in its own repository.

## Change workflow

- Never push implementation changes directly to `main` or `master`.
- Create a focused branch and pull request for every change.
- Keep commits attributable and reversible.
- Update contracts before or with consumers.
- Include acceptance evidence in the pull request.
- Do not merge when required checks fail or review threads remain unresolved.

## Architecture rules

- Keep the MVP backend modular and independently testable inside one deployment.
- Modules own their records and expose application services.
- Bind revision-sensitive operations to immutable commit SHAs.
- Never execute submitted source in the API or Go coordinator.
- Treat release versions and artifacts as immutable.
- Require workspace identity in tenant-owned records and authorization paths.
- Use idempotency keys for asynchronous commands.
- Record security-sensitive and lifecycle changes in the audit trail.

## Delivery focus

Complete one TypeScript asset lifecycle before adding another language, registry, executable plugin system, MCP adapter, or separate NoSQL database.
