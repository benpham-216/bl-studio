# Repository Working Agreement

## Scope

This repository implements bl.Studio. Durable general knowledge belongs in `benpham-216/knowledge-base`. For Studio design definitions, **Git files are the source of truth**; a future database may store accounts, comments, or telemetry but must never become authoritative for tokens, templates, schemas, or locator contracts.

## Change workflow

- Never push implementation changes directly to `dev` or `main`.
- Create a focused branch and pull request for every change.
- Feature work targets `dev`; promotion from `dev` to `main` is a separate reviewed change.
- Keep commits attributable and reversible.
- Update contracts before or with consumers.
- Include acceptance evidence in the pull request.
- Do not merge when required checks fail or review threads remain unresolved.

## Git-backed Studio invariants

- Projects inherit one template level only during Phase 1: `project -> template`.
- Project override files may change approved primitive token roots only. Semantic token names are frozen shared contracts.
- Use Style Dictionary `include` for base tokens and `source` for intentional project overrides.
- Generated `dist/` and `.studio/cache/` content is rebuildable and never authored as source.
- Stable test locators derive from logical identity, not project name or render order.
- Blast-radius indexes are generated from component/form/page definitions; never hand-maintain a second usage map.
- Local hooks are fast feedback only. CI plus protected branch rules are the authoritative publication gate.
- A base-template change must validate every dependent project. A project override change validates that project at minimum.

## Phase boundaries

- Phase 0.5: read, resolve, validate, index usage, render read-only viewer.
- Phase 1: edit primitive tokens, preview impact, save as commit, clone by inheritance, rollback through Git.
- Phase 2: AI proposal branches plus human approve/reject/comment flow.

Do not add AI generation or a design database before the deterministic Phase 0.5/1 contracts are proven.
