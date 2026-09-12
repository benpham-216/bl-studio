# Infrastructure

Local development requires PostgreSQL and an object storage substitute plus a queue abstraction suitable for integration tests. Deployed environments use isolated resources and managed identities.

Terraform is introduced after the deployment target, queue and object storage decisions are accepted. Keep local/test/staging/production configuration separate and commit only safe examples.

