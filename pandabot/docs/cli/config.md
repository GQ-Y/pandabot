---
summary: "CLI reference for `panda config` (get/set/unset config values)"
read_when:
  - You want to read or edit config non-interactively
---

# `panda config`

Config helpers: get/set/unset values by path. Run without a subcommand to open
the configure wizard (same as `panda configure`).

## Examples

```bash
panda config get browser.executablePath
panda config set browser.executablePath "/usr/bin/google-chrome"
panda config set agents.defaults.heartbeat.every "2h"
panda config set agents.list[0].tools.exec.node "node-id-or-name"
panda config unset tools.web.search.apiKey
```

## Paths

Paths use dot or bracket notation:

```bash
panda config get agents.defaults.workspace
panda config get agents.list[0].id
```

Use the agent list index to target a specific agent:

```bash
panda config get agents.list
panda config set agents.list[1].tools.exec.node "node-id-or-name"
```

## Values

Values are parsed as JSON5 when possible; otherwise they are treated as strings.
Use `--json` to require JSON5 parsing.

```bash
panda config set agents.defaults.heartbeat.every "0m"
panda config set gateway.port 19001 --json
panda config set channels.whatsapp.groups '["*"]' --json
```

Restart the gateway after edits.
