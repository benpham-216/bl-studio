# Knowledge Base Reference

bl.Studio uses [benpham-216/knowledge-base](https://github.com/benpham-216/knowledge-base) for durable research and reusable architecture knowledge. The implementation repository owns current code, contracts, migrations, ADRs, and operational behavior.

## Linked notes

| Knowledge ID | Topic | Source |
| --- | --- | --- |
| `kb-software-cms-architecture-001` | Architecture baseline | [Architecture](https://github.com/benpham-216/knowledge-base/blob/main/notes/software/cms-component-studio-architecture.md) |
| `kb-software-cms-versioning-001` | Revision and release lifecycle | [Versioning](https://github.com/benpham-216/knowledge-base/blob/main/notes/software/cms-component-studio-versioning.md) |
| `kb-software-cms-extensions-001` | Template and plugin contracts | [Extensions](https://github.com/benpham-216/knowledge-base/blob/main/notes/software/cms-component-studio-extensions.md) |
| `kb-software-cms-mvp-plan-001` | MVP delivery plan | [MVP plan](https://github.com/benpham-216/knowledge-base/blob/main/notes/software/cms-component-studio-mvp-plan.md) |
| `kb-software-cms-investigation-001` | Open architecture investigations | [Investigation register](https://github.com/benpham-216/knowledge-base/blob/main/notes/software/cms-component-studio-investigation.md) |

The machine-readable form is [`knowledge-base.yaml`](../knowledge-base.yaml). Stable knowledge IDs are used for references; paths are navigation hints.

## Update workflow

1. Propose a project decision as an ADR in bl.Studio.
2. Review and merge the implementation or documentation change through a pull request.
3. Distill findings that are reusable beyond the immediate change into an atomic knowledge note.
4. Update the knowledge base through its own pull request and preserve the note's stable ID.
5. Update `knowledge-base.yaml` when a new note becomes part of the bl.Studio architecture set.

If a knowledge note and implemented behavior disagree, use the accepted ADR and current contracts to operate bl.Studio, then correct the knowledge note through a pull request.
