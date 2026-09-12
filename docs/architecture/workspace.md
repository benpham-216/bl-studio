# Workspace and Project Architecture

## Product workspace model

Use the following hierarchy in the product:

```text
Organization
  -> Workspace
       -> Project
            -> Repository connection
                 -> Asset
                      -> Revision
                      -> Review
                      -> Build
                      -> Release
```

An organization owns billing and organization-wide policy later. A workspace is the security and collaboration boundary. A project groups related applications and repositories. Repository connections grant access to source. An asset points to a repository plus source path and has an independent release lifecycle.

For the MVP, one account may own one workspace and one project, but the data model and authorization must still carry `workspace_id`.

## Code project boundaries

### Studio Web

Owns presentation and browser state. It consumes generated API clients, does not reproduce backend authorization rules, and shows exact revision/build/release identities.

First screens: workspace/project selector, asset catalog, asset details, revision comparison, review, job result and release history.

### Platform API

Owns synchronous business rules and persistence. Suggested modules:

- Identity and Workspaces
- Projects and Repository Connections
- Asset Catalog
- Source and Revisions
- Reviews
- Releases
- Templates
- Plugins
- Jobs
- Audit

Each module owns its tables and exposes application-level operations. Cross-module work uses explicit calls or internal events.

### Go Job Coordinator

Claims queued jobs, renews leases, handles cancellation, selects a runner, records progress, retries safe failures and reports final results. It must be idempotent for a stable job ID.

### Runners

A runner checks out an exact commit in an ephemeral workspace, validates the asset manifest, restores locked dependencies, builds/tests/packages, uploads immutable outputs and terminates. Apply CPU, memory, time, filesystem, credential and network limits.

### Contracts

Keep OpenAPI, asset manifests, plugin manifests and event schemas here. Version externally consumed contracts and generate clients where practical.

## Data ownership

| Store | Data |
| --- | --- |
| PostgreSQL | Organizations, workspaces, projects, connections, assets, revisions, reviews, builds, releases, jobs, audit, outbox |
| PostgreSQL JSONB | Versioned manifest and configuration snapshots with defined schemas |
| Git provider | Authored source, commits, branches and diffs |
| Object storage | Packages, checksums, logs, test reports and preview bundles |
| Queue | Delivery of commands/events; never the source of truth |

Start with PostgreSQL plus JSONB. Add a document database only after a measured workload shows a clear operational or scaling benefit.

## Environments

| Environment | Purpose | Data rule |
| --- | --- | --- |
| Local | Developer feedback | Disposable local data and fake credentials |
| Test | Automated integration and lifecycle checks | Created and destroyed by automation |
| Staging | Production-like validation | Synthetic or approved test data |
| Production | Real workspaces and releases | Backups, audit retention and controlled access |

Use separate databases, queues, object containers/buckets, identities and secrets for each deployed environment. Never reuse production credentials in local or CI runs.

## Required cross-cutting capabilities

- Authentication plus workspace and project authorization
- Audit trail for lifecycle and security changes
- Structured logs with correlation, workspace, asset, revision and job identifiers
- Metrics for job latency, failures, retries, queue age and publication outcomes
- Idempotency and transactional outbox for asynchronous workflows
- Database migrations and compatibility rules
- Secret management and scoped Git provider credentials
- Backup and restore procedures for records and release metadata

