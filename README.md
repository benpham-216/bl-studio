# bl.Studio

bl.Studio is a **Git-backed design studio**. Tokens, schemas, template definitions, component/form/page contracts, and locator configuration live in the repository and remain the single source of truth.

```text
Git files -> resolve -> validate -> blast radius -> read-only preview
                                      |
                                      +-> Phase 1 save = commit
                                      +-> Phase 2 AI proposal = branch
```

## Phase 0.5 foundation

This repository currently implements the deterministic read-only foundation:

- `templates/base/` owns primitive + frozen semantic tokens and UI definitions.
- `projects/<name>/` contains project metadata plus **primitive-only diffs** from base.
- `packages/resolver/` resolves base (`include`) + project override (`source`) through Style Dictionary.
- `packages/validator/` enforces schemas, allowed override roots, semantic identity, and contrast gates.
- `packages/blast-radius/` derives token usage from component → form → page definitions.
- `apps/studio-web/` renders the resolved state with Mantine; it does not edit files yet.
- `dist/<project>/variables.css` and viewer data are generated and git-ignored.

## Inheritance

```text
resolved(project) = templates/base + projects/<project>/overrides
```

Phase 1 intentionally permits one inheritance level only. Clone creates another project pointing at `templates/base`; it never deep-copies the full template.

## Run locally

Node `22.23.2` and pnpm are the repository baseline.

```bash
corepack enable
corepack prepare pnpm@10.17.1 --activate
pnpm install --no-frozen-lockfile
pnpm check
pnpm dev
```

`pnpm check` validates the repository, runs invariant tests, generates resolved outputs, type-checks, and builds the viewer.

## Publication boundary

A local hook may provide quick feedback, but it is not a security boundary. Pull-request CI and protected `dev`/`main` rules are authoritative. Phase 1 will add GitAdapter-backed save/commit/rollback behavior; Phase 2 will map AI proposals to branches and human approval to merge.

## Deferred intentionally

Design editing, Git commits from the UI, clone/rollback actions, AI generation, HITL proposal controls, user accounts, comments, and telemetry are not part of Phase 0.5.
