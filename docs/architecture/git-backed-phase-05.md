# Git-Backed Studio — Phase 0.5

## Status

Phase 0.5 proves that the design system can be resolved, validated, inspected, and rendered from Git-backed files without a design database.

## Source-of-truth boundary

- `templates/base/` owns the shared design contract.
- `projects/<name>/project.json` points to one base template.
- `projects/<name>/overrides/primitives.tokens.json` contains project-specific primitive diffs only.
- `dist/` and `.studio/cache/` are generated and disposable.
- Future account, comment, or telemetry persistence is non-authoritative for design.

## Resolve pipeline

```text
templates/base/tokens/**  --Style Dictionary include--+
                                                     +--> resolved(project)
projects/<name>/overrides/** --Style Dictionary source--+
```

`source` intentionally overrides `include`. Semantic token names remain defined by base and are identical across projects.

## Validation pipeline

```text
schema -> primitive override boundary -> semantic identity -> contrast -> blast radius -> render
```

Local hooks may duplicate these checks later for faster feedback. Pull-request CI remains authoritative because local hooks are bypassable.

## Locator contract

Locators derive from logical identity and exclude project identity:

```text
{Component}.{instanceName}.{slot}
Button.login-submit.root
```

The same logical component therefore keeps the same locator across inherited projects and regenerations.

## Blast radius

The blast-radius index is generated from component, form, and page definitions. It is never hand-authored as a second source of truth.

```text
token -> component -> form -> page
```

A future base-token change must validate every dependent project. A project override change validates that project at minimum.

## Phase 0.5 completion gate

- Base semantic tokens resolve through each project primitive override.
- Semantic override attempts are rejected.
- Resolved output is deterministic.
- Stable locators do not contain project or render-order identity.
- Blast radius is derived from definitions.
- Contrast and schema gates pass for every sample project.
- Viewer switches projects and displays resolved values and affected surfaces.
- Generated output remains git-ignored.

Editing, Git commit/rollback operations, clone actions, and AI proposal branches remain Phase 1/2 work.
