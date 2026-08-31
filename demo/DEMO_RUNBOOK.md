# OpsWarden Demo Runbook

This repository provides a deterministic GitHub Actions failure that OpsWarden can
turn into an Incident. The baseline on `main` is intentionally green.

## One-time OpsWarden configuration

1. In the `OpsWarden Demo` Team, configure a GitHub connection.
2. Register the webhook URL and secret shown by OpsWarden in this repository.
3. Subscribe the webhook to workflow-run events.
4. Create and enable a rule:
   - Action: GitHub / `ci_failed`;
   - repository: `opswarden-git/opswarden-demo`;
   - workflow: `OpsWarden Demo CI`;
   - branch: `demo/ci-failure`;
   - reaction: OpsWarden / create Incident;
   - severity: `critical`.

Production accounts and the optional Generic Webhook rehearsal are documented
in the local, ignored `demo/DEMO_TEST_ACCOUNTS.md` and
`demo/DEMO_GENERIC_WEBHOOK.md`. Never paste their secrets into this tracked
runbook, a commit, CI output or a demo capture.

## GitLab mirror

Create a blank GitLab project without a README, then push this same repository:

```bash
git remote add gitlab git@gitlab.com:<gitlab-namespace>/opswarden-demo.git
git push gitlab main
```

In OpsWarden, configure a GitLab connection with a new secret token. In the GitLab
project, open **Settings > Webhooks** and configure:

- URL: `https://api.opswarden.dev/webhooks/gitlab/<connection-id>`;
- Secret token: the exact token entered in the OpsWarden connection;
- Trigger events: **Pipeline events** and **Tag push events**;
- SSL verification: enabled.

Create the equivalent OpsWarden rule with repository
`<gitlab-namespace>/opswarden-demo`, pipeline failure, branch
`demo/ci-failure`, and the OpsWarden create-Incident reaction.

## Replay the controlled failure

The three canonical branches are immutable demo fixtures:

- `main`: one commit, healthy baseline;
- `demo/ci-failure`: two commits, failing SLO contract;
- `demo/ci-passing`: three commits, corrected contract.

Replay them by dispatching CI. Do not merge, recreate or delete these branches.

Authenticate the two CLIs once:

```bash
gh auth status
glab auth status

gh workflow run ci.yml \
  --repo opswarden-git/opswarden-demo \
  --ref demo/ci-failure

glab ci run \
  --repo romeo.cavazza/opswarden-demo \
  --branch demo/ci-failure
```

The `rejects a deployment that exceeds the five-percent SLO` test fails because
the implementation now tolerates a 50% error rate. GitHub sends the completed
workflow event to OpsWarden, which creates a critical Incident.

## Replay the recovery

After presenting the Incident and its War Room, dispatch the corrected fixture:

```bash
gh workflow run ci.yml \
  --repo opswarden-git/opswarden-demo \
  --ref demo/ci-passing

glab ci run \
  --repo romeo.cavazza/opswarden-demo \
  --branch demo/ci-passing
```

Follow the latest executions without modifying Git history:

```bash
gh run list --repo opswarden-git/opswarden-demo --limit 6
glab ci list --repo romeo.cavazza/opswarden-demo --per-page 6
```
