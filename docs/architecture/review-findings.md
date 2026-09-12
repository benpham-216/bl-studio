# Architecture Review Findings

## Accepted baseline

The current architecture is coherent for an MVP: React/Vite for the studio, a modular ASP.NET Core API, PostgreSQL with JSONB, Git source history, a Go job coordinator, isolated runners, object storage and a durable queue.

## Gaps to close before feature implementation

| Priority | Gap | Required decision or evidence |
| --- | --- | --- |
| P0 | Workspace and project authorization | Define roles, resource hierarchy and authorization tests |
| P0 | Git provider authentication | Choose the first provider and test install, revoke, webhook and scoped access |
| P0 | Runner trust boundary | Threat model and escape/network/secret/timeout cleanup tests |
| P0 | Release invariants | Database constraints and failure tests for stale approval, duplicate delivery and concurrent publish |
| P1 | API and event contracts | Versioned OpenAPI and event envelope with idempotency/correlation fields |
| P1 | Observability | Logging fields, metrics, traces, retention and job diagnostics |
| P1 | Environment model | Isolated local/test/staging/production resources and secret handling |
| P1 | Package consumption | First TypeScript artifact format, dependency lock and clean consumer test |
| P2 | Go worker justification | Compare coordinator prototype with a .NET worker using maintenance and reliability criteria |
| P2 | Separate NoSQL need | Benchmark defined JSONB workloads before adding another database |

## Decisions to record first

1. Modular monolith boundaries and dependency rules.
2. Workspace/project/repository/asset tenancy model.
3. GitHub integration and credential lifecycle.
4. Immutable revision, approval, build and release invariants.
5. Queue, outbox, job leases and idempotency.
6. Runner isolation and artifact trust.
7. PostgreSQL JSONB boundary and trigger for another database.
8. First TypeScript package and template contracts.

Architecture decisions start as proposed, include evidence and consequences, and receive a review trigger.

