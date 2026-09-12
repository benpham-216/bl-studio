# Go Job Coordinator

Coordinates queued build, test and packaging jobs.

The worker claims a lease, selects an isolated runner, streams bounded progress, handles cancellation, retries safe failures and reports a final result idempotently. It must not compile or execute submitted source inside the coordinator process.

