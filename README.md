# OpsWarden Demo

Deterministic CI failure and recovery fixture for the OpsWarden demo.

The TypeScript contract classifies a deployment as unhealthy when it is not
ready or when its error rate exceeds the five-percent SLO. The default branch is
kept green. A versioned patch introduces one controlled regression on a
disposable branch so GitHub Actions or GitLab CI can trigger an OpsWarden Incident.

```bash
npm ci
npm run check
```

Both `.github/workflows/ci.yml` and `.gitlab-ci.yml` execute the same locked
contract. See [`demo/DEMO_RUNBOOK.md`](demo/DEMO_RUNBOOK.md) for the complete
webhook, failure, AI-assisted repair and reset sequence.

Live credentials, test accounts and production webhook configuration belong in
the explicitly ignored `demo/DEMO_GENERIC_WEBHOOK.md` and
`demo/DEMO_TEST_ACCOUNTS.md`. They must never be committed or published.
