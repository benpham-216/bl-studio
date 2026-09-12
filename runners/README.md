# Isolated Runners

The MVP provides one Node.js runner for TypeScript assets. A runner receives a fixed job specification and scoped credentials, checks out an exact commit, validates the manifest, restores locked dependencies, executes approved commands and uploads immutable outputs.

Runner security and cleanup must be validated before executing source from repositories outside a trusted development fixture.

