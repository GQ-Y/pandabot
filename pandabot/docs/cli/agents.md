---
summary: "CLI reference for `panda agents` (list/add/delete/set identity)"
read_when:
  - You want multiple isolated agents (workspaces + routing + auth)
---

# `panda agents`

Manage isolated agents (workspaces + auth + routing).

Related:
- Multi-agent routing: [Multi-Agent Routing](/concepts/multi-agent)
- Agent workspace: [Agent workspace](/concepts/agent-workspace)

## Examples

```bash
panda agents list
panda agents add work --workspace ~/panda-work
panda agents set-identity --workspace ~/panda --from-identity
panda agents set-identity --agent main --avatar avatars/panda.png
panda agents delete work
```

## Identity files

Each agent workspace can include an `IDENTITY.md` at the workspace root:
- Example path: `~/panda/IDENTITY.md`
- `set-identity --from-identity` reads from the workspace root (or an explicit `--identity-file`)

Avatar paths resolve relative to the workspace root.

## Set identity

`set-identity` writes fields into `agents.list[].identity`:
- `name`
- `theme`
- `emoji`
- `avatar` (workspace-relative path, http(s) URL, or data URI)

Load from `IDENTITY.md`:

```bash
panda agents set-identity --workspace ~/panda --from-identity
```

Override fields explicitly:

```bash
panda agents set-identity --agent main --name "Clawd" --emoji "🦞" --avatar avatars/panda.png
```

Config sample:

```json5
{
  agents: {
    list: [
      {
        id: "main",
        identity: {
          name: "Panda",
          theme: "default",
          emoji: "🐼",
          avatar: "avatars/panda.png"
        }
      }
    ]
  }
}
```
