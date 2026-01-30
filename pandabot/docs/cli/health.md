---
summary: "CLI reference for `panda health` (gateway health endpoint via RPC)"
read_when:
  - You want to quickly check the running Gateway’s health
---

# `panda health`

Fetch health from the running Gateway.

```bash
panda health
panda health --json
panda health --verbose
```

Notes:
- `--verbose` runs live probes and prints per-account timings when multiple accounts are configured.
- Output includes per-agent session stores when multiple agents are configured.
