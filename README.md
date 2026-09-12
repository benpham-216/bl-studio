# bl.Studio

bl.Studio manages reusable components, libraries, functions, templates, and plugins through a governed lifecycle:

```text
connect source -> register asset -> create revision -> review -> build/test -> publish -> consume
```

The repository is a monorepo for the platform implementation. Source repositories managed by the platform remain independent and are connected by repository, commit, and source path.

## Initial projects

| Project | Technology | First responsibility |
| --- | --- | --- |
| `apps/studio-web` | React, TypeScript, Vite | Catalog, revision diff, review, build and release views |
| `apps/platform-api` | ASP.NET Core | Workspaces, catalog, revision, review and release rules |
| `apps/job-worker-go` | Go | Durable build/test/package job coordination |
| `contracts` | OpenAPI, JSON Schema, event schemas | Stable boundaries between UI, API, workers and runners |
| `runners/node` | Node.js in an isolated runtime | First TypeScript component build and test runner |
| `infra` | Containers and Terraform | Local dependencies and environment provisioning |

`apps/mcp-adapter`, .NET/Go runners, executable plugins, and a separate NoSQL store are later capabilities.

## Architecture baseline

- Modular ASP.NET Core backend deployed as one service for the MVP.
- PostgreSQL stores workflow records; JSONB stores flexible manifests and configuration snapshots.
- Git stores source and commit history.
- Go coordinates asynchronous jobs but never runs submitted source inside its own process.
- Object storage holds immutable release artifacts and build reports.
- A transactional outbox delivers work to the queue.
- Reviews, builds and releases bind to exact commit SHAs.
- Published versions and artifact digests are immutable.

Detailed workspace boundaries are in [docs/architecture/workspace.md](docs/architecture/workspace.md). The delivery sequence is in [docs/roadmap/mvp.md](docs/roadmap/mvp.md).

## Repository workflow

All changes use a branch and pull request. Protect `main`, require successful checks, block force pushes and deletions, and require resolved review threads before merge.

## Start implementation

1. Review and merge the workspace initialization pull request.
2. Enable branch protection for `main` with required pull requests and checks.
3. Record the first architecture decisions before installing application dependencies.
4. Build the TypeScript asset lifecycle end to end before adding other ecosystems.
