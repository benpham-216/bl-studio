# MVP Roadmap

## Outcome

A user connects a Git repository, registers one TypeScript asset, reviews an exact revision, runs isolated checks, publishes an immutable release and consumes that release in a clean project.

## Milestones

| Milestone | Deliverable | Exit criteria |
| --- | --- | --- |
| 0. Decisions | P0 architecture decision records and threat model | P0 gaps have owners, evidence and accepted decisions |
| 1. Foundation | Web shell, API, PostgreSQL, migrations, local environment, CI | Reproducible startup and workspace isolation checks |
| 2. Catalog | Workspaces, projects, repository connection, assets | Existing repository and asset path are registered |
| 3. Revisions | Commit snapshots, file browser and diff | UI identifies and compares exact commit SHAs |
| 4. Review | Submit, comment, request changes and approve | A changed revision cannot reuse approval |
| 5. Jobs | Outbox, queue, Go coordinator and Node runner | Duplicate jobs are safe; failed checks block publishing |
| 6. Release | Immutable artifact, digest and release history | A published version cannot be overwritten |
| 7. Consume | Package download/install and one template generation flow | Clean consumer uses a pinned released artifact |
| 8. Readiness | Failure recovery, audit, observability and runbook | Lifecycle and recovery checks pass in staging |

## First backlog

1. Write ADRs 0001–0008 from the architecture review.
2. Define the product resource hierarchy and roles.
3. Define the asset manifest and revision/release API contracts.
4. Create the local PostgreSQL environment and initial migrations.
5. Implement workspace/project authorization vertically through UI, API and database.
6. Add the GitHub repository adapter and exact commit resolution.
7. Deliver the catalog and revision comparison slice.

## Deferred

Executable third-party plugins, MCP integration, hosted functions, multiple Git providers, .NET/Go asset runners, advanced registries and a separate NoSQL database.

