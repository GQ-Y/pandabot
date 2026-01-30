---
summary: "CLI reference for `panda reset` (reset local state/config)"
read_when:
  - You want to wipe local state while keeping the CLI installed
  - You want a dry-run of what would be removed
---

# `panda reset`

Reset local config/state (keeps the CLI installed).

```bash
panda reset
panda reset --dry-run
panda reset --scope config+creds+sessions --yes --non-interactive
```

